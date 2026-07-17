import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Course } from './course.entity';

@Entity('failed_courses')
export class FailedCourse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  student: User;

  @ManyToOne(() => Course)
  course: Course;

  @Column({ default: false })
  isResolved: boolean; // มีสถานะเป็น true เมื่อนักศึกษาลงทะเบียนเรียนใหม่และสอบผ่านแล้ว
}
