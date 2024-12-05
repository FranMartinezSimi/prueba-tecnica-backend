import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';
import { Logger } from '@nestjs/common';
import { LoginDto } from '../dto/auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let logger: Logger;

  const mockAuthService = {
    login: jest.fn().mockResolvedValue({
      status: 'success',
      statusCode: 200,
      message: 'Inicio de sesión exitoso',
      data: {
        token: 'mock-token',
        user: { id: 1, email: 'test@test.com' }
      }
    }),
    register: jest.fn()
  };

  const mockLogger = {
    log: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService
        },
        {
          provide: Logger,
          useValue: mockLogger
        }
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login with correct parameters', async () => {
      const loginDto: LoginDto = {
        email: 'test@test.com',
        password: 'password123'
      };
      const serviceResponse = {
        token: 'mock-token',
        user: { id: 1, email: 'test@test.com' }
      };
      mockAuthService.login.mockResolvedValue(serviceResponse);
      const expectedResponse = {
        status: 'success',
        statusCode: 200,
        message: 'Inicio de sesión exitoso',
        data: serviceResponse
      };
      const result = await controller.login(loginDto);
      expect(mockLogger.log).toHaveBeenCalledWith('Login request received');
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('register', () => {
    it('debería registrar un nuevo usuario exitosamente', async () => {
      const expectedResponse = { id: 1, email: 'test@test.com' };
      mockAuthService.register.mockResolvedValue(expectedResponse);
      const mockRegisterDto = {
        email: 'test@test.com',
        password: 'password123'
      };
      const result = await controller.register(mockRegisterDto);
      expect(logger.log).toHaveBeenCalledWith('Register request received');
      expect(authService.register).toHaveBeenCalledWith(mockRegisterDto);
      expect(result).toEqual({
        status: 'success',
        statusCode: 200,
        message: 'Usuario registrado exitosamente',
        data: expectedResponse
      });
    });

    it('debería manejar errores durante el registro', async () => {
      const error = new Error('Error de registro');
      mockAuthService.register.mockRejectedValue(error);
      const mockRegisterDto = {
        email: 'test@test.com',
        password: 'password123'
      };
      await expect(controller.register(mockRegisterDto)).rejects.toThrow(error);
      expect(logger.log).toHaveBeenCalledWith('Register request received');
      expect(authService.register).toHaveBeenCalledWith(mockRegisterDto);
    });
  });
});
