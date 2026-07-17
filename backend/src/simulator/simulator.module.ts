import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimulatorController } from './simulator.controller';
import { SimulatorService } from './simulator.service';
import { CoursesModule } from '../courses/courses.module';
import { SimulationRecord } from '../database/entities/simulation-record.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SimulationRecord]),
    CoursesModule
  ],
  controllers: [SimulatorController],
  providers: [SimulatorService],
})
export class SimulatorModule {}
