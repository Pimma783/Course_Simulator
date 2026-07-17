import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('simulation_records')
export class SimulationRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  student: User;

  @Column({ type: 'json' })
  failedCourses: string[]; // Array of course codes, e.g., ["ศท141-1", "วท320"]

  @Column({ type: 'int' })
  expectedGraduationSemester: number; // e.g., 9

  @Column({ type: 'int' })
  delaySemesters: number; // e.g., 1

  @Column({ type: 'boolean', default: false })
  isDismissed: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
