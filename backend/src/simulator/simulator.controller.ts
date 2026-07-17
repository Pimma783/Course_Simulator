import { Controller, Post, Get, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { IsArray, IsString, IsInt, Min, Max, IsBoolean } from 'class-validator';
import { SimulatorService } from './simulator.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

export class SimulationInputDto {
  @IsArray()
  @IsString({ each: true })
  passedCourses: string[];

  @IsArray()
  @IsString({ each: true })
  fCourses: string[];

  @IsInt()
  @Min(1)
  @Max(8)
  currentSemester: number;
}

export class SaveSimulationDto {
  @IsArray()
  @IsString({ each: true })
  failedCourses: string[];

  @IsInt()
  expectedGraduationSemester: number;

  @IsInt()
  delaySemesters: number;

  @IsBoolean()
  isDismissed: boolean;
}

@Controller('simulator')
export class SimulatorController {
  constructor(private readonly simulatorService: SimulatorService) {}

  @Post('eligibility')
  checkEligibility(@Body() body: SimulationInputDto): Promise<any> {
    return this.simulatorService.checkEligibility(body);
  }

  @Post('impact')
  analyzeImpact(@Body() body: SimulationInputDto): Promise<any> {
    return this.simulatorService.computeImpact(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('save')
  saveSimulation(@Request() req: any, @Body() body: SaveSimulationDto) {
    return this.simulatorService.saveSimulationRecord(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  getHistory(@Request() req: any) {
    return this.simulatorService.getSimulationRecordsByUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('history/:id')
  deleteHistory(@Request() req: any, @Param('id') id: string) {
    return this.simulatorService.deleteSimulationRecord(id, req.user.userId);
  }
}
