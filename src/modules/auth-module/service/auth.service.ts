import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UserService } from '../../user-module/service/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';


@Injectable()
export class AuthService{
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private logger: Logger
  ) {}

  private async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    this.logger.log('Verifying password');
    try {
      const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
      if (!isMatch) {
        this.logger.error('Invalid credentials');
        throw new UnauthorizedException('Invalid credentials');
      }
      return isMatch;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        this.logger.error('Invalid credentials');
        throw error;
      }
      this.logger.error('Error verifying password');
      throw new UnauthorizedException('Error verifying password');
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      this.logger.log('Getting user by email');
      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        this.logger.error('User not found');
        throw new NotFoundException('User not found');
      }
      this.logger.log('Verifying password');
      await this.verifyPassword(password, user.password);

      const payload: JwtPayload = { 
        id: user.id, 
        email: user.email 
      };
      this.logger.log('Generating JWT');
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
        }
      };

    } catch (error) {
      this.logger.error('Error logging in');
      if (error instanceof NotFoundException || 
          error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error('Login failed');
      throw new UnauthorizedException('Login failed');
    }
  }
}