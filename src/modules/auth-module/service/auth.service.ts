import { Injectable, UnauthorizedException, NotFoundException, HttpStatus, HttpException, BadRequestException } from '@nestjs/common';
import { UserService } from '../../user-module/service/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';


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
      this.logger.error(`Error en login: ${error.message}`);
      
      if (error instanceof NotFoundException || 
          error instanceof UnauthorizedException) {
        throw error;
      }
      
      console.error('Error completo:', error);
      
      throw new HttpException(
        `Error en login: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
}

  async createHashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async register(register: RegisterDto): Promise<void> {
    this.logger.log('Registering user');
    try {
      const findUser = await this.userService.getUserByEmail(register.email);
      if (findUser) {
        this.logger.error('User already exists');
        throw new BadRequestException('User already exists');
      }
      const hashedPassword = await this.createHashPassword(register.password);
      this.logger.log('Creating user');
      await this.userService.createUser({
        email: register.email, 
        password: hashedPassword,
      });
      this.logger.log('User created');
    } catch (error) {
      this.logger.error('Error registering user');
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
