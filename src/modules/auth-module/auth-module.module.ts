import { Module, Logger } from '@nestjs/common';
import { AuthService } from '@/modules/auth-module/service/auth.service';
import { UserModule } from '../user-module/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from './constants';
import { AuthController } from './controller/auth.controller';


@Module({
  providers: [AuthService, Logger],
  imports: [UserModule,
    JwtModule.register({
      secret: JwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    })],
  exports:[AuthService],
  controllers: [AuthController]
})
export class AuthModuleModule {}
