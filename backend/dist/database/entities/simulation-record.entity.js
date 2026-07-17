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
exports.SimulationRecord = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let SimulationRecord = class SimulationRecord {
    id;
    student;
    failedCourses;
    expectedGraduationSemester;
    delaySemesters;
    isDismissed;
    createdAt;
};
exports.SimulationRecord = SimulationRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SimulationRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.id, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], SimulationRecord.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Array)
], SimulationRecord.prototype, "failedCourses", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], SimulationRecord.prototype, "expectedGraduationSemester", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], SimulationRecord.prototype, "delaySemesters", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], SimulationRecord.prototype, "isDismissed", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SimulationRecord.prototype, "createdAt", void 0);
exports.SimulationRecord = SimulationRecord = __decorate([
    (0, typeorm_1.Entity)('simulation_records')
], SimulationRecord);
//# sourceMappingURL=simulation-record.entity.js.map