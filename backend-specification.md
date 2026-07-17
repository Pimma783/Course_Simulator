# เอกสารข้อกำหนด Backend (Nest.js) — ฉบับขยาย
### CS Course Prerequisite Simulator

เอกสารนี้ขยายจากส่วนที่ 5 ของสเปคเดิม โดยลงรายละเอียดระดับที่พร้อมนำไปเขียนโค้ดต่อได้ทันที **ไม่มีการ mock ข้อมูลใดๆ** — ทุกส่วนที่เกี่ยวกับแหล่งข้อมูลจริง (ไฟล์ JSON / ฐานข้อมูล) ถูกออกแบบให้เป็น interface ที่นายไปต่อเองได้ในภายหลัง

---

## 0. โครงสร้างโปรเจกต์ (Module Structure)

```
src/
├── main.ts
├── app.module.ts
│
├── common/
│   ├── interfaces/
│   │   └── course.interface.ts
│   └── filters/
│       └── http-exception.filter.ts
│
├── courses/
│   ├── courses.module.ts
│   ├── courses.controller.ts
│   ├── courses.service.ts
│   └── repositories/
│       └── course.repository.ts        # interface เท่านั้น ยังไม่ implement แหล่งข้อมูลจริง
│
└── simulator/
    ├── simulator.module.ts
    ├── simulator.controller.ts
    ├── simulator.service.ts
    ├── dto/
    │   ├── simulation-input.dto.ts
    │   ├── eligibility-result.dto.ts
    │   └── impact-result.dto.ts
    └── algorithms/
        ├── eligibility.algorithm.ts     # pure function, ไม่ผูกกับ Nest
        └── impact.algorithm.ts          # pure function, ไม่ผูกกับ Nest
```

**เหตุผลที่แยก `algorithms/` ออกจาก `.service.ts`:** สอง endpoint หลักของระบบนี้คือ business logic ล้วนๆ (ไม่ยุ่งกับ DB, ไม่ยุ่งกับ HTTP) การแยกเป็น pure function ทำให้เขียน unit test ได้ง่ายโดยไม่ต้อง mock Nest DI เลย — ส่ง array ของ `Course[]` กับ input เข้าไป แล้วเช็ค output ตรงๆ

---

## 1. Course Module

### 1.1 Interface กลาง

```typescript
// common/interfaces/course.interface.ts
export interface Course {
  courseCode: string;
  courseName: string;
  semester: number;
  prerequisites: string[];
}
```

### 1.2 ชั้นเข้าถึงข้อมูล (Repository Pattern — เตรียมไว้เฉยๆ)

ยังไม่ต้อง implement แหล่งข้อมูลจริง แต่ให้วาง interface ไว้ก่อน เพื่อให้ `CoursesService` ไม่ผูกกับว่าข้อมูลมาจากไหน (ไฟล์ JSON, Postgres, Prisma ฯลฯ) — สลับได้ภายหลังโดยไม่แตะ business logic:

```typescript
// courses/repositories/course.repository.ts
export interface CourseRepository {
  findAll(): Promise<Course[]>;
  findByCode(code: string): Promise<Course | null>;
  findByCodes(codes: string[]): Promise<Course[]>;
}

// ให้ inject ผ่าน token เพื่อสลับ implementation ได้
export const COURSE_REPOSITORY = Symbol('COURSE_REPOSITORY');
```

`CoursesService` และ `SimulatorService` เรียกผ่าน interface นี้เท่านั้น — วันที่นายต่อ DB จริง แค่เขียน class ที่ implement `CourseRepository` แล้ว provide เข้า module

### 1.3 Endpoint: `GET /courses`

| รายการ | รายละเอียด |
|---|---|
| Method | `GET` |
| Path | `/courses` |
| Query params | ไม่มี (เผื่ออนาคต: `?semester=3` เพื่อกรองเฉพาะเทอม) |
| Response 200 | `Course[]` |
| Response 500 | แหล่งข้อมูลอ่านไม่สำเร็จ |

---

## 2. Simulator Module

### 2.1 DTO ขาเข้า

```typescript
// simulator/dto/simulation-input.dto.ts
import { IsArray, IsInt, IsString, Min, Max } from 'class-validator';

export class SimulationInputDto {
  @IsArray()
  @IsString({ each: true })
  passedCourses: string[];

  @IsArray()
  @IsString({ each: true })
  fCourses: string[];

  @IsInt()
  @Min(1)
  @Max(8)
  currentSemester: number;
}
```

**Business-rule validation ที่ต้องทำเพิ่มใน service (นอกเหนือจาก class-validator):**
- `passedCourses` และ `fCourses` ต้องไม่มีรหัสวิชาซ้ำกัน (วิชาเดียวกันจะผ่านและติด F พร้อมกันไม่ได้)
- ทุกรหัสวิชาใน `passedCourses` และ `fCourses` ต้องมีอยู่จริงในฐานข้อมูลวิชา (เช็คผ่าน `CourseRepository.findByCodes`) — ถ้าไม่พบ ให้ตอบ `400` พร้อมระบุรหัสที่หาไม่เจอ

### 2.2 Endpoint ที่ 1: `POST /simulator/eligibility`

| รายการ | รายละเอียด |
|---|---|
| Request body | `SimulationInputDto` |
| Response 200 | `EligibilityResultDto` (ด้านล่าง) |
| Response 400 | validation ล้มเหลว หรือรหัสวิชาไม่มีอยู่จริง |

```typescript
// simulator/dto/eligibility-result.dto.ts
export interface BlockedCourseInfo {
  course: Course;
  blockedBy: string[];   // รหัสวิชาบังคับก่อนที่เป็นสาเหตุ
  reason: 'FAILED_PREREQUISITE' | 'PREREQUISITE_NOT_PASSED';
}

export interface EligibilityResultDto {
  targetSemester: number;
  eligibleCourses: Course[];
  blockedCourses: BlockedCourseInfo[];
}
```

**⚠️ จุดที่ต้องตัดสินใจต่อ (สเปคเดิมไม่ได้ระบุชัด):** "ภาคเรียนถัดไป" หมายถึง `currentSemester + 1` — เอกสารนี้ยึดตามสมมติฐานนี้ ถ้าความหมายจริงต่างจากนี้ (เช่น ผู้ใช้เลือกภาคเรียนเป้าหมายเองได้) ให้ปรับ DTO เพิ่ม field `targetSemester` แยกจาก `currentSemester`

**Algorithm (pseudocode สำหรับ `eligibility.algorithm.ts`):**

```
function checkEligibility(allCourses, input):
    targetSemester = input.currentSemester + 1
    candidates = allCourses.filter(c => c.semester === targetSemester)

    eligible = []
    blocked = []

    for course in candidates:
        failedPrereqs = course.prerequisites.filter(p => p in input.fCourses)
        if failedPrereqs.length > 0:
            blocked.push({ course, blockedBy: failedPrereqs, reason: 'FAILED_PREREQUISITE' })
            continue

        missingPrereqs = course.prerequisites.filter(p => p not in input.passedCourses)
        if missingPrereqs.length > 0:
            blocked.push({ course, blockedBy: missingPrereqs, reason: 'PREREQUISITE_NOT_PASSED' })
            continue

        eligible.push(course)

    return { targetSemester, eligibleCourses: eligible, blockedCourses: blocked }
```

### 2.3 Endpoint ที่ 2: `POST /simulator/impact`

| รายการ | รายละเอียด |
|---|---|
| Request body | `SimulationInputDto` (ใช้จริงแค่ `fCourses` และ `currentSemester` แต่คง DTO เดียวกันเพื่อความสม่ำเสมอของ API) |
| Response 200 | `ImpactResultDto` |
| Response 400 | validation ล้มเหลว |

```typescript
// simulator/dto/impact-result.dto.ts
export interface CascadeChain {
  triggerCourse: string;      // วิชาที่ติด F ตั้งต้น
  chain: string[];            // ลำดับวิชาที่ถูกบล็อกต่อเนื่องจากวิชานี้
}

export interface ImpactResultDto {
  delaySemesters: number;         // จำนวนภาคเรียนที่ต้องจบช้าลง
  finalBlockedSemester: number;   // ภาคเรียนของวิชาสุดท้ายที่ถูกบล็อก
  affectedCourses: Course[];      // รวมทุกวิชาที่ได้รับผลกระทบ (unique)
  cascadeChains: CascadeChain[];  // แยกเป็นสายตามวิชาต้นเหตุ เผื่อ frontend อยากวาดกราฟ
}
```

**Algorithm (pseudocode สำหรับ `impact.algorithm.ts`):**

```
function computeImpact(allCourses, input):
    affectedSet = new Set()
    chains = []

    for failedCode in input.fCourses:
        chain = []
        dfs(failedCode, visited=new Set([failedCode]))
        chains.push({ triggerCourse: failedCode, chain })

    function dfs(code, visited):
        dependents = allCourses.filter(c => code in c.prerequisites)
        for dep in dependents:
            if dep.courseCode in visited:
                continue    # กัน cycle เผื่อข้อมูลวิชาผิดพลาด ไม่ใช่ business case ปกติ
            visited.add(dep.courseCode)
            affectedSet.add(dep.courseCode)
            chain.push(dep.courseCode)
            dfs(dep.courseCode, visited)

    affectedCourses = allCourses.filter(c => c.courseCode in affectedSet)
    finalBlockedSemester = max(c.semester for c in affectedCourses, default = input.currentSemester)
    delaySemesters = max(0, finalBlockedSemester - input.currentSemester)

    return { delaySemesters, finalBlockedSemester, affectedCourses, cascadeChains: chains }
```

**สิ่งที่ pseudocode นี้กันไว้ล่วงหน้า ที่สเปคเดิมยังไม่ได้พูดถึง:**
- **Cycle guard** — ถ้าข้อมูลวิชาบังคับก่อนถูกกรอกผิดจนเกิดวนลูป (A ต้องพึ่ง B, B ต้องพึ่ง A) DFS ธรรมดาจะวนไม่รู้จบ จึงใส่ `visited` set ต่อสาย
- **หลายวิชาติด F พร้อมกัน** — DFS แยกทำทีละวิชาต้นเหตุ แล้ว union ผลกระทบทั้งหมดเข้า `affectedSet` เพื่อไม่นับวิชาซ้ำตอนสรุปผล แต่ยังเก็บสายแยกไว้ใน `cascadeChains` เผื่อ frontend อยากโชว์ว่าอะไรมาจากอะไร

### 2.4 ตารางสรุป Error/Status Code

| Status | เมื่อไหร่ |
|---|---|
| `200` | สำเร็จ |
| `400` | DTO ไม่ผ่าน validation, มีรหัสวิชาซ้ำระหว่าง passed/failed, หรือรหัสวิชาไม่มีอยู่จริง |
| `500` | อ่านข้อมูลวิชาไม่สำเร็จ (repository layer ล้มเหลว) |

---

## 3. เรื่องข้ามโมดูล (Cross-cutting Concerns)

- **CORS** — เปิดเฉพาะ origin ของ Next.js frontend ผ่าน `app.enableCors({ origin: [...] })` ใน `main.ts`
- **Global ValidationPipe** — ตั้ง `whitelist: true, forbidNonWhitelisted: true, transform: true` เพื่อตัด field แปลกปลอมออกจาก request และแปลง type อัตโนมัติ
- **Exception filter** — ใช้ `common/filters/http-exception.filter.ts` เพื่อคุมรูปแบบ error response ให้เหมือนกันทุก endpoint เช่น `{ statusCode, message, error }`
- **Testing priority** — เนื่องจาก `eligibility.algorithm.ts` และ `impact.algorithm.ts` เป็น pure function ควรเขียน unit test ครอบคลุมกรณีขอบ (edge case) ก่อนต่อ controller/service จริง เช่น: ไม่มีวิชาติด F เลย, ติด F วิชาที่ไม่มีใครพึ่งพา, ติด F หลายวิชาที่ส่งผลถึงกันเอง, ข้อมูล prerequisites เป็น cycle

---

## 4. จุดที่เปิดไว้ให้นายตัดสินใจต่อ

1. **แหล่งข้อมูลจริง** — จะ implement `CourseRepository` ด้วยไฟล์ JSON นิ่งๆ ก่อน หรือขึ้นฐานข้อมูลจริง (Prisma + Postgres) เลย
2. **ความหมายของ "ภาคเรียนถัดไป"** — ยึดตาม `currentSemester + 1` ตามที่เอกสารนี้สมมติไว้ หรือให้ผู้ใช้เลือก target semester เอง
3. **โมดูล Export (PDF/CSV)** — ตามสเปคหน้า Result มีปุ่ม export แต่ยังไม่มีการออกแบบ endpoint รองรับ แนะนำให้แยกเป็น `export/` module ที่เรียกผลลัพธ์จาก `SimulatorService` มาแปลงเป็นไฟล์ ไม่ควรฝัง logic นี้ไว้ใน `simulator.service.ts`
