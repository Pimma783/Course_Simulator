import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './database/entities/user.entity';
import { Course } from './database/entities/course.entity';
import { StudyPlan } from './database/entities/study-plan.entity';
import { FailedCourse } from './database/entities/failed-course.entity';
import { SimulationRecord } from './database/entities/simulation-record.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { PlansModule } from './plans/plans.module';
import { TranscriptModule } from './transcript/transcript.module';
import { SimulatorModule } from './simulator/simulator.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'database',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER || 'cpas_user',
      password: process.env.DB_PASSWORD || 'cpas_password',
      database: process.env.DB_NAME || 'cpas_db',
      entities: [User, Course, StudyPlan, FailedCourse, SimulationRecord],
      synchronize: true, // Use with caution in production!
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
    }),
    AuthModule,
    UsersModule,
    CoursesModule,
    PlansModule,
    TranscriptModule,
    SimulatorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
