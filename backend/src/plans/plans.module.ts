import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyPlan } from '../database/entities/study-plan.entity';
import { Course } from '../database/entities/course.entity';
import { User } from '../database/entities/user.entity';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StudyPlan, Course, User])],
  providers: [PlansService],
  controllers: [PlansController],
  exports: [PlansService],
})
export class PlansModule {}
