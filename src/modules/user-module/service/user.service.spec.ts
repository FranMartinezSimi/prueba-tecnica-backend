import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Logger } from '@nestjs/common';
import { User } from '../../../entities/User.entity';

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository;

  beforeEach(async () => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      findById: jest.fn(),
      deleteUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        Logger,
        {
          provide: 'USER_REPOSITORY',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('getUserByEmail', () => {
    it('debería encontrar un usuario por email', async () => {
      const mockUser = { id: 1, email: 'test@test.com' } as User;
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.getUserByEmail('test@test.com');
      expect(result).toEqual(mockUser);
    });

    it('debería lanzar error si el usuario no existe', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(service.getUserByEmail('test@test.com'))
        .rejects
        .toThrow('User not found');
    });
  });

  describe('createUser', () => {
    it('debería crear un usuario exitosamente', async () => {
      const mockUser = { id: 1, email: 'test@test.com' } as User;
      const mockResult = { raw: [{ id: 1 }] };
      
      mockUserRepository.createUser.mockResolvedValue(mockResult);

      const result = await service.createUser(mockUser);
      expect(result).toEqual(mockResult);
    });

    it('debería lanzar error si no se crea el usuario', async () => {
      const mockUser = { id: 1, email: 'test@test.com' } as User;
      mockUserRepository.createUser.mockResolvedValue({ raw: [] });

      await expect(service.createUser(mockUser))
        .rejects
        .toThrow('User not created');
    });
  });

  describe('updateUser', () => {
    it('debería actualizar un usuario exitosamente', async () => {
      const mockUser = { id: 1, email: 'test@test.com' } as User;
      const mockResult = { raw: [{ id: 1 }] };
      
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.updateUser.mockResolvedValue(mockResult);

      const result = await service.updateUser(mockUser);
      expect(result).toEqual(mockResult);
    });

    it('debería lanzar error si el usuario no existe', async () => {
      const mockUser = { id: 1, email: 'test@test.com' } as User;
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.updateUser(mockUser))
        .rejects
        .toThrow('User not found');
    });

    it('debería lanzar error si la actualización falla', async () => {
      const mockUser = { id: 1, email: 'test@test.com' } as User;
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.updateUser.mockResolvedValue({ raw: [] });

      await expect(service.updateUser(mockUser))
        .rejects
        .toThrow('User not updated');
    });
  });

  describe('deleteUser', () => {
    it('debería eliminar un usuario exitosamente', async () => {
      const mockResult = { raw: [{ id: 1 }] };
      mockUserRepository.deleteUser.mockResolvedValue(mockResult);

      const result = await service.deleteUser(1);
      expect(result).toEqual(mockResult);
    });

    it('debería lanzar error si la eliminación falla', async () => {
      mockUserRepository.deleteUser.mockResolvedValue({ raw: [] });

      await expect(service.deleteUser(1))
        .rejects
        .toThrow('User not deleted');
    });
  });
});