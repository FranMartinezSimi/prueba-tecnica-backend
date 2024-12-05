import { Module, Logger } from '@nestjs/common';
import { AuthService } from '@/modules/auth-module/service/auth.service';
import { UserModule } from '../user-module/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from './constants';
import { AuthController } from './controller/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

const configService = new ConfigService();

@Module({
  providers: [AuthService, Logger],
  imports: [UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { 
          expiresIn: '24h'
        },
      }),
      inject: [ConfigService],
    })
  ],
  exports:[AuthService],
  controllers: [AuthController],
})
export class AuthModuleModule {}
