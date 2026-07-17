import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.entity';
import { Course } from './course.entity';

@Entity('study_plans')
export class StudyPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  student: User;

  @Column({ type: 'int' })
  academicYear: number; // เช่น 2569

  @Column({ type: 'int' })
  semester: number; // 1, 2 หรือ 3 (ฤดูร้อน)

  @ManyToMany(() => Course)
  @JoinTable({ name: 'study_plan_courses' })
  selectedCourses: Course[];
}
