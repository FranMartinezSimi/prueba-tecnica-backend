import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './service/user.service';
import { UserRepository } from './repository/user.repository';
import { User } from '@/entities/User.entity';


@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UserService,
    UserRepository,
    {
      provide: 'USER_REPOSITORY',
      useClass: UserRepository,
    }
  ],
  exports: [UserService, 'USER_REPOSITORY'],
})
export class UserModule {}