import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findByUsername(username: string): Promise<User | null>;
    create(userDto: any): Promise<User>;
}
