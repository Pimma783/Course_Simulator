"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlansService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const study_plan_entity_1 = require("../database/entities/study-plan.entity");
const course_entity_1 = require("../database/entities/course.entity");
const user_entity_1 = require("../database/entities/user.entity");
let PlansService = class PlansService {
    studyPlanRepository;
    courseRepository;
    userRepository;
    constructor(studyPlanRepository, courseRepository, userRepository) {
        this.studyPlanRepository = studyPlanRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }
    async savePlan(studentId, academicYear, semester, courseCodes) {
        const student = await this.userRepository.findOne({ where: { id: studentId } });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const courses = courseCodes && courseCodes.length > 0
            ? await this.courseRepository.findBy({ courseCode: (0, typeorm_2.In)(courseCodes) })
            : [];
        if (courseCodes && courseCodes.length > 0 && courses.length !== courseCodes.length) {
            const foundCodes = new Set(courses.map(c => c.courseCode));
            const invalidCodes = courseCodes.filter(code => !foundCodes.has(code));
            throw new common_1.BadRequestException(`รหัสวิชาไม่ถูกต้อง: ${invalidCodes.join(', ')}`);
        }
        let plan = await this.studyPlanRepository.findOne({
            where: {
                student: { id: studentId },
                academicYear,
                semester,
            },
            relations: { selectedCourses: true },
        });
        if (plan) {
            plan.selectedCourses = courses;
        }
        else {
            plan = this.studyPlanRepository.create({
                student,
                academicYear,
                semester,
                selectedCourses: courses,
            });
        }
        return this.studyPlanRepository.save(plan);
    }
};
exports.PlansService = PlansService;
exports.PlansService = PlansService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(study_plan_entity_1.StudyPlan)),
    __param(1, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PlansService);
//# sourceMappingURL=plans.service.js.map