import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('courses')
export class Course {
  @PrimaryColumn()
  courseCode: string;

  @Column()
  courseName: string;

  @Column({ type: 'int', nullable: true })
  totalCredits: number;

  @Column({ nullable: true })
  creditsBreakdown: string;

  @Column({ type: 'int' })
  semester: number;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'boolean', default: false })
  isPlaceholderSlot: boolean;

  @Column({ nullable: true })
  choiceGroupId: string;

  @Column({ type: 'simple-array', nullable: true })
  prerequisites: string[];
}
