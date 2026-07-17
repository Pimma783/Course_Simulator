import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string; // รหัสนักศึกษา หรือ ชื่อล็อกอินอาจารย์

  @Column()
  passwordHash: string;

  @Column({ type: 'enum', enum: ['student', 'advisor'] })
  role: 'student' | 'advisor';

  @Column()
  fullName: string;

  // สำหรับนักศึกษา: ระบุไอดีของอาจารย์ที่ปรึกษา
  @ManyToOne(() => User, (user) => user.advisees, { nullable: true })
  advisor: User;

  // สำหรับอาจารย์ที่ปรึกษา: ลิสต์นักศึกษาในความดูแล
  @OneToMany(() => User, (user) => user.advisor)
  advisees: User[];
}
