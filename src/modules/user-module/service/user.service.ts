import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../../entities/User.entity';
import { Response } from '../../../assets/response';
import { IUserRepository } from '../interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: IUserRepository) {}

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createUser(user: User): Promise<Response> {
    try {
      await this.userRepository.createUser(user);
      return new Response('success', 'User created successfully', null);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateUser(user: User): Promise<Response> {
    try {
      await this.userRepository.updateUser(user);
      return new Response('success', 'User updated successfully', null);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteUser(id: number): Promise<Response> {
    try {
      await this.userRepository.deleteUser(id);
      return new Response('success', 'User deleted successfully', null);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
