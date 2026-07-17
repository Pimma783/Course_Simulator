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
exports.SimulatorController = exports.SaveSimulationDto = exports.SimulationInputDto = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const simulator_service_1 = require("./simulator.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
class SimulationInputDto {
    passedCourses;
    fCourses;
    currentSemester;
}
exports.SimulationInputDto = SimulationInputDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SimulationInputDto.prototype, "passedCourses", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SimulationInputDto.prototype, "fCourses", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(8),
    __metadata("design:type", Number)
], SimulationInputDto.prototype, "currentSemester", void 0);
class SaveSimulationDto {
    failedCourses;
    expectedGraduationSemester;
    delaySemesters;
    isDismissed;
}
exports.SaveSimulationDto = SaveSimulationDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SaveSimulationDto.prototype, "failedCourses", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], SaveSimulationDto.prototype, "expectedGraduationSemester", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], SaveSimulationDto.prototype, "delaySemesters", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SaveSimulationDto.prototype, "isDismissed", void 0);
let SimulatorController = class SimulatorController {
    simulatorService;
    constructor(simulatorService) {
        this.simulatorService = simulatorService;
    }
    checkEligibility(body) {
        return this.simulatorService.checkEligibility(body);
    }
    analyzeImpact(body) {
        return this.simulatorService.computeImpact(body);
    }
    saveSimulation(req, body) {
        return this.simulatorService.saveSimulationRecord(req.user.userId, body);
    }
    getHistory(req) {
        return this.simulatorService.getSimulationRecordsByUser(req.user.userId);
    }
    deleteHistory(req, id) {
        return this.simulatorService.deleteSimulationRecord(id, req.user.userId);
    }
};
exports.SimulatorController = SimulatorController;
__decorate([
    (0, common_1.Post)('eligibility'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SimulationInputDto]),
    __metadata("design:returntype", Promise)
], SimulatorController.prototype, "checkEligibility", null);
__decorate([
    (0, common_1.Post)('impact'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SimulationInputDto]),
    __metadata("design:returntype", Promise)
], SimulatorController.prototype, "analyzeImpact", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('save'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, SaveSimulationDto]),
    __metadata("design:returntype", void 0)
], SimulatorController.prototype, "saveSimulation", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SimulatorController.prototype, "getHistory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('history/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SimulatorController.prototype, "deleteHistory", null);
exports.SimulatorController = SimulatorController = __decorate([
    (0, common_1.Controller)('simulator'),
    __metadata("design:paramtypes", [simulator_service_1.SimulatorService])
], SimulatorController);
//# sourceMappingURL=simulator.controller.js.map