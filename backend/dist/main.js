"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const courses_service_1 = require("./courses/courses.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const defaultOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
    const envOrigins = process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.split(',').map(o => o.trim())
        : [];
    const allowedOrigins = envOrigins.length > 0 ? envOrigins : defaultOrigins;
    app.enableCors({
        origin: allowedOrigins,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    const coursesService = app.get(courses_service_1.CoursesService);
    await coursesService.seedCourses();
    await app.listen(process.env.PORT || 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map