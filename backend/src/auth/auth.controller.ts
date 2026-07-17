import { Controller, Post, Body, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: any) {
    // (Fix #6) Wrap the entire create+save flow in try/catch to handle
    // race conditions where two concurrent requests register the same
    // username. The DB unique constraint will throw a QueryFailedError;
    // we catch it and return a friendly 409 instead of 500.
    try {
      const existingUser = await this.usersService.findByUsername(body.username);
      if (existingUser) {
        throw new ConflictException('Username already exists');
      }
      
      const newUser = await this.usersService.create({
        username: body.username,
        password: body.password,
        fullName: body.fullName || body.username
      });

      // Automatically login after registration
      return this.authService.login(newUser);
    } catch (error) {
      // Re-throw NestJS HTTP exceptions as-is
      if (error instanceof ConflictException) {
        throw error;
      }

      // Catch DB unique constraint violation (MySQL: ER_DUP_ENTRY 1062, PostgreSQL: 23505)
      const dbError = error as any;
      if (
        dbError?.code === 'ER_DUP_ENTRY' ||
        dbError?.errno === 1062 ||
        dbError?.code === '23505'
      ) {
        throw new ConflictException('Username already exists');
      }

      // Re-throw unexpected errors
      throw new InternalServerErrorException('Registration failed');
    }
  }
}
