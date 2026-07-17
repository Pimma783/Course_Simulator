import { Controller, Get, Post } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  getAllCourses() {
    return this.coursesService.findAll();
  }

  @Post('seed')
  async seedCourses() {
    await this.coursesService.seedCourses();
    return { message: 'Courses seeded successfully' };
  }
}
