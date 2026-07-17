# เอกสารข้อกำหนด Frontend (Next.js) — ฉบับขยาย
### CS Course Prerequisite Simulator

เอกสารนี้ขยายจากส่วนที่ 4 ของสเปคเดิม และคู่กับ `backend-specification.md` — type และ endpoint ที่อ้างถึงในนี้ต้องตรงกับฝั่ง backend ทุกจุด **ไม่มีการ mock ข้อมูลใดๆ** ทุก component ดึงข้อมูลจริงผ่าน `lib/api.ts` เท่านั้น ไม่มีการฝัง array ของวิชาไว้ในไฟล์ component

---

## 0. โครงสร้างโปรเจกต์ (App Router)

```
app/
├── page.tsx                         # Landing (/)
├── simulator/
│   └── page.tsx                     # Dashboard (/simulator)
├── result/
│   └── page.tsx                     # Result (/result)
├── layout.tsx
│
├── components/
│   ├── landing/
│   │   ├── Hero.tsx
│   │   └── FeatureCard.tsx
│   ├── simulator/
│   │   ├── SemesterColumn.tsx
│   │   ├── CourseChip.tsx
│   │   └── StickySummaryBar.tsx
│   └── result/
│       ├── EligibilityCard.tsx
│       ├── EligibilityGrid.tsx
│       ├── ImpactBanner.tsx
│       ├── AffectedCourseList.tsx
│       └── ExportButtons.tsx
│
├── lib/
│   ├── api.ts                       # fetch wrapper เรียก Nest.js backend
│   └── types.ts                     # ต้องตรงกับ interface ฝั่ง backend
│
├── hooks/
│   ├── useCourseSelection.ts        # จัดการ state passed/failed ของหน้า simulator
│   └── useSimulationResult.ts       # เรียก API + จัดการ loading/error state ของหน้า result
│
└── store/
    └── simulationStore.ts           # ส่ง SimulationInput ข้ามหน้า /simulator → /result
```

**เหตุผลที่แยก `hooks/` ออกจาก component:** หน้า Simulator และ Result มี logic ที่ไม่ใช่ UI ล้วน (state ของวิชาที่เลือก, การเรียก API, การจัดการ error) การแยกออกมาเป็น custom hook ทำให้ component เหลือแค่หน้าที่ render และเทส logic แยกจาก UI ได้

---

## 1. Types กลาง (`lib/types.ts`)

ต้องตรงกับ interface ที่นิยามไว้ฝั่ง backend เป๊ะๆ (import แนวคิดเดียวกัน ไม่ต้อง re-define ต่างออกไป):

```typescript
export interface Course {
  courseCode: string;
  courseName: string;
  semester: number;
  prerequisites: string[];
}

export type CourseStatus = 'passed' | 'failed' | undefined;

export interface SimulationInput {
  passedCourses: string[];
  fCourses: string[];
  currentSemester: number;
}

export interface BlockedCourseInfo {
  course: Course;
  blockedBy: string[];
  reason: 'FAILED_PREREQUISITE' | 'PREREQUISITE_NOT_PASSED';
}

export interface EligibilityResult {
  targetSemester: number;
  eligibleCourses: Course[];
  blockedCourses: BlockedCourseInfo[];
}

export interface CascadeChain {
  triggerCourse: string;
  chain: string[];
}

export interface ImpactResult {
  delaySemesters: number;
  finalBlockedSemester: number;
  affectedCourses: Course[];
  cascadeChains: CascadeChain[];
}
```

## 2. ชั้นเรียก API (`lib/api.ts`)

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function getCourses(): Promise<Course[]> {
  const res = await fetch(`${API_BASE}/courses`);
  if (!res.ok) throw new ApiError(res.status, await res.text());
  return res.json();
}

export async function getEligibility(input: SimulationInput): Promise<EligibilityResult> {
  const res = await fetch(`${API_BASE}/simulator/eligibility`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new ApiError(res.status, await res.text());
  return res.json();
}

export async function getImpact(input: SimulationInput): Promise<ImpactResult> {
  const res = await fetch(`${API_BASE}/simulator/impact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new ApiError(res.status, await res.text());
  return res.json();
}

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
```

**หมายเหตุ:** หน้า Result ต้องเรียกทั้ง `getEligibility` และ `getImpact` (คนละ endpoint ตามสเปค backend) — แนะนำให้ยิงพร้อมกันด้วย `Promise.all` ใน `useSimulationResult` แทนที่จะยิงทีละอันเรียงกัน

---

## 3. หน้า Landing (`app/page.tsx`)

| ส่วน | รายละเอียด |
|---|---|
| ข้อมูลที่ต้องใช้ | ไม่มีการเรียก API — เป็น static content ล้วน |
| Component ที่ใช้ | `Hero`, `FeatureCard` × 3 |
| Interaction | ปุ่ม CTA `router.push('/simulator')` |

ไม่มี state ต้องจัดการในหน้านี้ ทำเป็น Server Component ได้เลยเพราะไม่มี client-side interactivity นอกจากปุ่มนำทาง (ปุ่มเดียวใส่ `'use client'` เฉพาะจุด หรือใช้ `<Link>` ของ Next.js แทนก็พอไม่ต้อง client component เลย)

---

## 4. หน้า Simulator (`app/simulator/page.tsx`)

### 4.1 การโหลดข้อมูล
เมื่อเข้าหน้านี้ ต้องเรียก `getCourses()` ก่อนเพื่อเอารายวิชาทั้งหมดมาวาด roadmap — ควรทำเป็น Server Component ที่ fetch แล้วส่ง `courses` เป็น prop ลงไปให้ client component ที่จัดการ state ต่อ (แยก data fetching ออกจาก interactivity)

### 4.2 State ที่ต้องจัดการ (`hooks/useCourseSelection.ts`)

```typescript
function useCourseSelection(courses: Course[]) {
  const [status, setStatus] = useState<Record<string, CourseStatus>>({});

  function cycleStatus(courseCode: string): void {
    // undefined -> 'passed' -> 'failed' -> undefined
  }

  function toSimulationInput(currentSemester: number): SimulationInput {
    // แปลง status map เป็น { passedCourses, fCourses, currentSemester }
  }

  return { status, cycleStatus, toSimulationInput,
           passedCount: /* derived */, failedCount: /* derived */ };
}
```

**กฎ UI ที่ต้องตรงกับสเปคเดิม (ส่วนที่ 4.2):** คลิกที่ chip วิชา 1 ครั้งวนสถานะ ยังไม่ลง → ผ่านแล้ว → ติด F → ยังไม่ลง ห้ามให้เลือกได้ทั้งผ่านและติด F พร้อมกันในวิชาเดียว (คุมด้วย type `CourseStatus` ที่เป็นค่าเดียว ไม่ใช่ boolean สองตัวแยกกัน จะได้ไม่มีทางเกิด state ขัดแย้งกันเองในฝั่ง frontend)

### 4.3 การส่งต่อไปหน้า Result

เมื่อกด "ประมวลผลแผนการเรียน":
1. เรียก `toSimulationInput()` เพื่อได้ `SimulationInput`
2. เก็บลง `simulationStore` (ดูส่วนที่ 6) เพื่อให้หน้า `/result` อ่านได้
3. `router.push('/result')`

**⚠️ จุดที่ต้องตัดสินใจต่อ:** สเปคเดิมไม่ได้ระบุว่าค่า `currentSemester` มาจากไหน — เอกสารนี้แนะนำว่าควรให้ผู้ใช้เลือกเอง (dropdown/selector บนหน้า simulator) แทนที่จะ hardcode เพราะแต่ละคนอยู่คนละภาคเรียนกัน

### 4.4 Loading / Error state
- ตอนโหลดรายวิชา (`getCourses`): แสดง skeleton ของ roadmap 8 คอลัมน์
- ถ้าโหลดไม่สำเร็จ: แสดงข้อความ error พร้อมปุ่มลองใหม่ ไม่ปล่อยหน้าว่างเปล่า

---

## 5. หน้า Result (`app/result/page.tsx`)

### 5.1 การโหลดข้อมูล (`hooks/useSimulationResult.ts`)

```typescript
function useSimulationResult() {
  const input = simulationStore.get();   // ถ้าไม่มีข้อมูล -> redirect กลับ /simulator

  const [eligibility, setEligibility] = useState<EligibilityResult | null>(null);
  const [impact, setImpact] = useState<ImpactResult | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    Promise.all([getEligibility(input), getImpact(input)])
      .then(([e, i]) => { setEligibility(e); setImpact(i); setStatus('success'); })
      .catch(() => setStatus('error'));
  }, []);

  return { eligibility, impact, status };
}
```

**กรณี edge case ที่ต้องจัดการ:** ถ้าผู้ใช้เปิดหน้า `/result` ตรงๆ โดยไม่ได้ผ่านหน้า simulator มาก่อน (ไม่มีข้อมูลใน `simulationStore`) ต้อง redirect กลับไป `/simulator` ทันที ไม่ใช่ปล่อยให้หน้าพังหรือเรียก API ด้วยข้อมูลว่าง

### 5.2 ส่วนแสดงสิทธิ์ลงทะเบียน

- `EligibilityGrid` รับ `eligibility.eligibleCourses` และ `eligibility.blockedCourses` มาวาดเป็นการ์ด 2 สี ตามสเปคเดิม (เขียว = ลงได้, แดง = ลงไม่ได้)
- การ์ดที่ลงไม่ได้ต้องโชว์ `reason` ที่ backend ส่งมา (`FAILED_PREREQUISITE` หรือ `PREREQUISITE_NOT_PASSED`) แปลเป็นข้อความไทยที่อ่านง่าย ไม่ใช่โชว์ enum ดิบๆ

### 5.3 ส่วนแสดงผลกระทบโดมิโน

- ถ้า `impact.affectedCourses.length === 0` → แสดงสถานะ "ไม่มีผลกระทบ" (all-clear state) แทนแถบเตือน
- ถ้ามีผลกระทบ → `ImpactBanner` โชว์ `impact.delaySemesters` เด่นๆ ตามสเปค พร้อม `AffectedCourseList` แสดงรายชื่อวิชาที่ถูกบล็อกทั้งหมดจาก `impact.affectedCourses`
- `impact.cascadeChains` (แยกสายตามวิชาต้นเหตุ) เป็นข้อมูลเสริมที่สเปคเดิมไม่ได้ขอ แต่ backend เตรียมส่งมาให้ — จะใช้วาดกราฟ dependency แบบละเอียดขึ้นในเวอร์ชันถัดไปก็ได้ หรือจะไม่ใช้เลยตอนนี้ก็ได้ ไม่กระทบ MVP

### 5.4 ส่วน Export

ปุ่ม PDF/CSV ตามสเปคเดิม — **ยังไม่มี endpoint รองรับในสเปค backend ปัจจุบัน** (ดูข้อ 4 ในเอกสาร backend) ดังนั้นให้ทำปุ่มไว้ก่อนแต่ปิด action ไว้ (disabled หรือ toast "เร็วๆ นี้") จนกว่าฝั่ง backend จะมี endpoint export จริง

---

## 6. การส่งข้อมูลข้ามหน้า (`store/simulationStore.ts`)

สเปคเดิมไม่ได้ระบุวิธีส่งข้อมูลจากหน้า Simulator ไปหน้า Result — มีตัวเลือกที่ต้องเทียบกัน:

| แนวทาง | ข้อดี | ข้อเสีย |
|---|---|---|
| **In-memory store** (เช่น Zustand/Context) | เรียบง่าย ไม่ต้อง encode ข้อมูล | รีเฟรชหน้า `/result` แล้วข้อมูลหาย ต้อง redirect กลับ |
| **Query string** | รีเฟรชแล้วข้อมูลไม่หาย, แชร์ลิงก์ได้ | ข้อมูลอาจยาวถ้าวิชาเยอะ ต้อง encode/decode array |
| **sessionStorage** | รอดรีเฟรช, ไม่ต้องพึ่ง URL | ต้องเขียน guard เผื่อ SSR (ไม่มี `window` ตอน server render) |

เอกสารนี้ยังไม่ฟันธงว่าใช้แบบไหน เพราะขึ้นกับว่านายอยากให้หน้า `/result` แชร์ลิงก์ได้หรือไม่ — ถ้าต้องแชร์ได้ ให้ใช้ query string, ถ้าไม่จำเป็น ใช้ in-memory store ง่ายกว่า

---

## 7. จุดที่เปิดไว้ให้นายตัดสินใจต่อ

1. **ที่มาของ `currentSemester`** — ให้ผู้ใช้เลือกเองผ่าน selector บนหน้า simulator (แนะนำ) หรือดึงจากระบบอื่น เช่น login/ข้อมูลนักศึกษา
2. **วิธีส่งข้อมูลข้ามหน้า** — เทียบ 3 แนวทางในข้อ 6 แล้วเลือกตามว่าต้องการให้แชร์ลิงก์ผลลัพธ์ได้หรือไม่
3. **Export PDF/CSV** — รอ backend มี endpoint ก่อน ค่อยต่อปุ่มจริง
4. **Responsive/mobile สำหรับหน้า Simulator** — roadmap แนวนอน 8 คอลัมน์บนจอกว้างจะเป็น scroll แนวนอนบนมือถือ ต้องตัดสินใจว่าจะคง layout เดิมหรือสลับเป็น accordion ตามภาคเรียนแทนบนหน้าจอเล็ก
