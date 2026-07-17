import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../database/entities/course.entity';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  findAll(): Promise<Course[]> {
    return this.courseRepository.find();
  }

  async seedCourses(): Promise<void> {
    // Use __dirname instead of process.cwd() so the path works both
    // during development (src/) and after build (dist/).
    const coursesPath = path.join(__dirname, '..', 'courses', 'courses-data.json');

    // Also check the source path as a fallback for development
    const srcCoursesPath = path.join(process.cwd(), 'src', 'courses', 'courses-data.json');

    let resolvedPath: string;
    try {
      await fs.access(coursesPath);
      resolvedPath = coursesPath;
    } catch {
      try {
        await fs.access(srcCoursesPath);
        resolvedPath = srcCoursesPath;
      } catch {
        console.log('No courses-data.json found. Skipping seed.');
        return;
      }
    }

    // Use async file read to avoid blocking the event loop
    const fileContent = await fs.readFile(resolvedPath, 'utf8');
    const courses = JSON.parse(fileContent);
    
    for (const courseData of courses) {
      let course = await this.courseRepository.findOne({ where: { courseCode: courseData.courseCode } });
      if (!course) {
        const newCourse = this.courseRepository.create(courseData as Partial<Course>);
        await this.courseRepository.save(newCourse);
      } else {
        // Update existing course to sync prerequisites
        Object.assign(course, courseData);
        await this.courseRepository.save(course);
      }
    }
  }
}
