import { Body, Controller, Post, Logger, HttpCode } from '@nestjs/common';
import { AuthService } from '../../auth-module/service/auth.service';
import { LoginDto } from '../dto/auth.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterDto } from '../dto/register.dto';
import { Response } from '../../../assets/response';
import { HttpStatus } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly logger: Logger) {}
  
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() login: LoginDto): Promise<Response> {
    this.logger.log('Login request received');
    const response = await this.authService.login(login.email, login.password);
    return Response.success('Inicio de sesión exitoso', response, HttpStatus.OK);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 200, description: 'Registro exitoso' })
  async register(@Body() register: RegisterDto): Promise<Response> {
    this.logger.log('Register request received');
    const response = await this.authService.register(register);
    return Response.success('Usuario registrado exitosamente', response, HttpStatus.OK);
  }
}
