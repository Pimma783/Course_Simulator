import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async create(userDto: any): Promise<User> {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(userDto.password, saltRounds);

    const newUser = this.userRepository.create({
      username: userDto.username,
      fullName: userDto.fullName,
      passwordHash: passwordHash,
      role: 'student', // Default role
    });

    return this.userRepository.save(newUser);
  }
}
