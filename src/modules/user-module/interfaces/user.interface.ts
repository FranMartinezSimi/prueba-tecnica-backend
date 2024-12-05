import { User } from 'src/entities/User.entity';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';

export interface IUserRepository {
  findById(id: number): Promise<User>;
  findByEmail(email: string): Promise<User>;
  createUser(user: User): Promise<InsertResult>;
  updateUser(user: User): Promise<UpdateResult>;
  deleteUser(id: number): Promise<DeleteResult>;
}
