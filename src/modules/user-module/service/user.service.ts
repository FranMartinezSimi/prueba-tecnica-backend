import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../../../entities/User.entity';
import { IUserRepository } from '../interfaces/user.interface';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { RegisterDto } from '@/modules/auth-module/dto/register.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: IUserRepository,
    private readonly logger: Logger,
  ) {}

  async getUser(email: string): Promise<User> {
    this.logger.log('Searching User');
    try {
      return await this.userRepository.findByEmail(email);
    } catch (error) {
      this.logger.error(`Error finding user`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    this.logger.log(`Finding user by email: ${email}`);
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      this.logger.error(`Error finding user by email: ${email}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createUser(user: RegisterDto): Promise<InsertResult> {
    this.logger.log('Creating user');
    try {
      const result = await this.userRepository.createUser({
        email: user.email,
        password: user.password,
        id: 0,
        updatedAt: undefined,
      });
      if (result?.raw?.length === 0) {
        throw new BadRequestException('User not created');
      }
      this.logger.log('Successfully created user');
      return result;
    } catch (error) {
      this.logger.error(`Error creating user: ${error}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateUser(user: User): Promise<UpdateResult> {
    this.logger.log('Updating user');
    try {
      const existingUser = await this.userRepository.findById(user.id);
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }
      const result = await this.userRepository.updateUser(user);
      if (result.raw.length === 0) {
        throw new BadRequestException('User not updated');
      }
      this.logger.log('Successfully updated user');
      return result;
    } catch (error) {
      this.logger.error(`Error updating user: ${error}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteUser(id: number): Promise<DeleteResult> {
    this.logger.log(`Deleting user by id: ${id}`);
    try {
      const result = await this.userRepository.deleteUser(id);
      if (result.raw.length === 0) {
        throw new BadRequestException('User not deleted');
      }
      this.logger.log('Successfully deleted user');
      return result;
    } catch (error) {
      this.logger.error(`Error deleting user by id: ${id}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
