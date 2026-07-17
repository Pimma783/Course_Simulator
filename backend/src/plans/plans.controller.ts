import { Controller, Put, Param, Body } from '@nestjs/common';
import { PlansService } from './plans.service';

@Controller('api/students')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Put(':studentId/plans')
  async updatePlan(
    @Param('studentId') studentId: string,
    @Body() body: { academicYear: number; semester: number; courses: string[] },
  ) {
    return this.plansService.savePlan(studentId, body.academicYear, body.semester, body.courses);
  }
}
