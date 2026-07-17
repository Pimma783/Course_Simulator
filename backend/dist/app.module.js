"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("./database/entities/user.entity");
const course_entity_1 = require("./database/entities/course.entity");
const study_plan_entity_1 = require("./database/entities/study-plan.entity");
const failed_course_entity_1 = require("./database/entities/failed-course.entity");
const simulation_record_entity_1 = require("./database/entities/simulation-record.entity");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const courses_module_1 = require("./courses/courses.module");
const plans_module_1 = require("./plans/plans.module");
const transcript_module_1 = require("./transcript/transcript.module");
const simulator_module_1 = require("./simulator/simulator.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.DB_HOST || 'database',
                port: parseInt(process.env.DB_PORT || '3306', 10),
                username: process.env.DB_USER || 'cpas_user',
                password: process.env.DB_PASSWORD || 'cpas_password',
                database: process.env.DB_NAME || 'cpas_db',
                entities: [user_entity_1.User, course_entity_1.Course, study_plan_entity_1.StudyPlan, failed_course_entity_1.FailedCourse, simulation_record_entity_1.SimulationRecord],
                synchronize: true,
                ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            courses_module_1.CoursesModule,
            plans_module_1.PlansModule,
            transcript_module_1.TranscriptModule,
            simulator_module_1.SimulatorModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map