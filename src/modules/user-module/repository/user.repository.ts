import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { User } from '@/entities/User.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  private readonly logger = new Logger(UserRepository.name);
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner,
    );
  }
  findByEmail(email: string): Promise<User> {
    this.logger.log(`Finding user by email: ${email}`);
    try {
      return this.userRepository.findOne({ where: { email } });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async createUser(user: User): Promise<void> {
    this.logger.log('Creating user');
    try {
      await this.userRepository.save(user);
      this.logger.log('Successfully created user');
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async updateUser(user: User): Promise<void> {
    this.logger.log('Updating user');
    try {
      await this.userRepository.save(user);
      this.logger.log('Successfully updated user');
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteUser(id: number): Promise<void> {
    this.logger.log(`Deleting user by id: ${id}`);
    try {
      await this.userRepository.delete(id);
      this.logger.log('Successfully deleted user');
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(id: number): Promise<User> {
    this.logger.log(`Finding user by id: ${id}`);
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });
      this.logger.log('Successfully found user by id');
      return user;
    } catch (error) {
      this.logger.error(`Error finding user by id: ${id}`);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
