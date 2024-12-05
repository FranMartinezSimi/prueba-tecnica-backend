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
    login: jest.fn()
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
      const expectedResponse = {
        token: 'mock-token',
        user: { id: 1, email: 'test@test.com' }
      };
      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(loginDto);

      expect(mockLogger.log).toHaveBeenCalledWith('Login request received');
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(result).toEqual(expectedResponse);
    });
  });
});