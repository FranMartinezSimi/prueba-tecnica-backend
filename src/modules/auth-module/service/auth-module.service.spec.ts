import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../user-module/service/user.service';
import { JwtService } from '@nestjs/jwt';
import {
  Logger,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;
  let logger: jest.Mocked<Logger>;

  const mockUser = {
    id: 1,
    email: 'test@test.com',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  beforeEach(async () => {
    const mockUserService = {
      getUserByEmail: jest.fn(),
      getUser: jest.fn().mockResolvedValue(mockUser),
      createUser: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
    logger = module.get(Logger);

    jest.spyOn(bcrypt, 'compare').mockImplementation();
  });

  describe('login', () => {
    it('should successfully login a user', async () => {
      const loginDto = {
        email: 'test@test.com',
        password: 'password123',
      };

      userService.getUserByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('jwt_token');

      const result = await service.login(loginDto.email, loginDto.password);

      expect(result).toEqual({
        access_token: 'jwt_token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
        },
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      userService.getUserByEmail.mockResolvedValue(null);

      await expect(
        service.login('wrong@email.com', 'password'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      userService.getUserByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login('test@test.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const registerDto = {
        email: 'test@test.com',
        password: 'password123',
      };

      userService.getUser.mockResolvedValue(null);
      userService.createUser.mockResolvedValue(undefined);

      // Esperar a que se complete el registro
      await expect(service.register(registerDto)).resolves.not.toThrow();

      expect(userService.createUser).toHaveBeenCalled();
    });

    it('should throw BadRequestException when user already exists', async () => {
      const registerDto = {
        email: 'test@test.com',
        password: 'password123',
      };

      userService.getUser.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when an error occurs', async () => {
      const registerDto = {
        email: 'test@test.com',
        password: 'password123',
      };

      userService.getUser.mockRejectedValue(new Error('Database error'));

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
