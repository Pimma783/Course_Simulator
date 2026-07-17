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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyPlan = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const course_entity_1 = require("./course.entity");
let StudyPlan = class StudyPlan {
    id;
    student;
    academicYear;
    semester;
    selectedCourses;
};
exports.StudyPlan = StudyPlan;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StudyPlan.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], StudyPlan.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], StudyPlan.prototype, "academicYear", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], StudyPlan.prototype, "semester", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => course_entity_1.Course),
    (0, typeorm_1.JoinTable)({ name: 'study_plan_courses' }),
    __metadata("design:type", Array)
], StudyPlan.prototype, "selectedCourses", void 0);
exports.StudyPlan = StudyPlan = __decorate([
    (0, typeorm_1.Entity)('study_plans')
], StudyPlan);
//# sourceMappingURL=study-plan.entity.js.map