import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { StudyPlan } from '../database/entities/study-plan.entity';
import { Course } from '../database/entities/course.entity';
import { User } from '../database/entities/user.entity';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(StudyPlan)
    private studyPlanRepository: Repository<StudyPlan>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async savePlan(studentId: string, academicYear: number, semester: number, courseCodes: string[]) {
    const student = await this.userRepository.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // (Fix #5) Validate that all submitted course codes actually exist
    const courses = courseCodes && courseCodes.length > 0 
      ? await this.courseRepository.findBy({ courseCode: In(courseCodes) })
      : [];

    if (courseCodes && courseCodes.length > 0 && courses.length !== courseCodes.length) {
      const foundCodes = new Set(courses.map(c => c.courseCode));
      const invalidCodes = courseCodes.filter(code => !foundCodes.has(code));
      throw new BadRequestException(
        `รหัสวิชาไม่ถูกต้อง: ${invalidCodes.join(', ')}`,
      );
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
    } else {
      plan = this.studyPlanRepository.create({
        student,
        academicYear,
        semester,
        selectedCourses: courses,
      });
    }

    return this.studyPlanRepository.save(plan);
  }
}
