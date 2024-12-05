import { Body, Controller, Post, Logger } from '@nestjs/common';
import { AuthService } from '../../auth-module/service/auth.service';
import { LoginDto } from '../dto/auth.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly logger: Logger) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() login: LoginDto): Promise<LoginResponse> {
    this.logger.log('Login request received');
    return this.authService.login(login.email, login.password);
  }
}
