import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  
  const mockUserRepository = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  const mockUser = {
    id: 1,
    email: 'test@test.com',
    password: 'password',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'USER_REPOSITORY',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserByEmail', () => {
    it('should return a user', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      const result = await service.getUserByEmail(mockUser.email);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      await expect(service.getUserByEmail(mockUser.email)).rejects.toThrow('User not found');
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      mockUserRepository.createUser.mockResolvedValue(mockUser);
      const result = await service.createUser(mockUser);
      expect(result).toBeDefined();
    });

    it('should throw an error if user creation fails', async () => {
      mockUserRepository.createUser.mockRejectedValue(new Error('User creation failed'));
      await expect(service.createUser(mockUser)).rejects.toThrow('User creation failed');
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      mockUserRepository.updateUser.mockResolvedValue(mockUser);
      const result = await service.updateUser(mockUser);
      expect(result).toBeDefined();
    });

    it('should throw an error if user update fails', async () => {
      mockUserRepository.updateUser.mockRejectedValue(new Error('User update failed'));
      await expect(service.updateUser(mockUser)).rejects.toThrow('User update failed');
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      mockUserRepository.deleteUser.mockResolvedValue(mockUser);
      const result = await service.deleteUser(mockUser.id);
      expect(result).toBeDefined();
    });

    it('should throw an error if user deletion fails', async () => {
      mockUserRepository.deleteUser.mockRejectedValue(new Error('User deletion failed'));
      await expect(service.deleteUser(mockUser.id)).rejects.toThrow('User deletion failed');
    });
  });
});
