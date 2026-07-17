import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { CoursesService } from './courses/courses.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // (Fix #7) CORS: read allowed origins from environment variable
  // so it works both in local development and production.
  // FRONTEND_URL can be a comma-separated list of origins.
  const defaultOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
  const envOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map(o => o.trim())
    : [];
  const allowedOrigins = envOrigins.length > 0 ? envOrigins : defaultOrigins;

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Global ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  const coursesService = app.get(CoursesService);
  await coursesService.seedCourses();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
