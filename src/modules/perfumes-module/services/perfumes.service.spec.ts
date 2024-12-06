import { Test, TestingModule } from '@nestjs/testing';
import { PerfumesService } from './perfumes.service';
import { Logger, NotFoundException, ConflictException, HttpException } from '@nestjs/common';
import { Perfume } from '@/entities/Perfume.entity';
import { CreatePerfumeDto } from '../dto/createPerfume.dto';
import { UpdatePerfumeDto } from '../dto/updatePerfume.dto';

describe('PerfumesService', () => {
  let service: PerfumesService;
  let mockPerfumesRepository;
  let mockInventoryRepository;
  let mockLogger;

  const mockPerfume: Perfume = {
      id: 1,
      name: 'Test Perfume',
      description: 'Test Description',
      imageUrl: 'test.png',
      brand: { id: 1, name: 'Test Brand', logo: 'brand.png', perfumes: [] },
      inventory: []
  };

  const createPerfumeDto: CreatePerfumeDto = {
    name: 'Test Perfume',
    description: 'Test Description',
    imageUrl: 'test.png',
    brandId: 1
  };

  const updatePerfumeDto: UpdatePerfumeDto = {
    name: 'Updated Perfume',
    description: 'Updated Description',
    imageUrl: 'updated.png',
    brandId: 1
  };

  beforeEach(async () => {
    mockPerfumesRepository = {
      findAllPerfumes: jest.fn(),
      findPerfumeById: jest.fn(),
      findPerfumeByName: jest.fn(),
      createPerfume: jest.fn(),
      updatePerfume: jest.fn(),
      deletePerfume: jest.fn(),
    };

    mockInventoryRepository = {
      createInventory: jest.fn(),
    };

    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PerfumesService,
        {
          provide: 'PERFUMES_REPOSITORY',
          useValue: mockPerfumesRepository,
        },
        {
          provide: 'INVENTORY_REPOSITORY',
          useValue: mockInventoryRepository,
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<PerfumesService>(PerfumesService);
  });
  
  describe('findAllPerfumes', () => {
    it('should return an array of perfumes', async () => {
      mockPerfumesRepository.findAllPerfumes.mockResolvedValue([mockPerfume]);
      const result = await service.findAllPerfumes();
      expect(result).toEqual([mockPerfume]);
    });

    it('should throw an error if no perfumes are found', async () => {
      mockPerfumesRepository.findAllPerfumes.mockResolvedValue([]);
      await expect(service.findAllPerfumes()).rejects.toThrow('No perfumes registered');
    });

    it('should throw if error when searching for perfumes', async () => {
      mockPerfumesRepository.findAllPerfumes.mockRejectedValue(new Error('Error when searching for perfumes'));
      await expect(service.findAllPerfumes()).rejects.toThrow(HttpException);
    });
  });

  describe('findPerfumeById', () => {
    it('should return a perfume by id', async () => {
      mockPerfumesRepository.findPerfumeById.mockResolvedValue(mockPerfume);
      const result = await service.findPerfumeById(1);
      expect(result).toEqual(mockPerfume);
    });

    it('should throw an error if no perfume is found', async () => {
      mockPerfumesRepository.findPerfumeById.mockResolvedValue(null);
      await expect(service.findPerfumeById(1)).rejects.toThrow('Perfume not found with id: 1');
    });

    it('should throw if error when searching for perfume', async () => {
      mockPerfumesRepository.findPerfumeById.mockRejectedValue(new Error('Error when searching for perfume'));
      await expect(service.findPerfumeById(1)).rejects.toThrow(HttpException);
    });
  });

  describe('createPerfume', () => {
    it('should create a new perfume', async () => {
      const mockInsertResult = {
        identifiers: [{ id: 1 }],
        generatedMaps: [],
        raw: []
      };
      
      mockPerfumesRepository.findPerfumeByName.mockResolvedValue(null);
      mockPerfumesRepository.createPerfume.mockResolvedValue(mockInsertResult);
      mockInventoryRepository.createInventory.mockResolvedValue();
  
      const result = await service.createPerfume(createPerfumeDto);
      
      expect(result).toEqual(mockInsertResult);
      expect(mockInventoryRepository.createInventory).toHaveBeenCalledWith(
        expect.objectContaining({
          perfume: 1,
          stock: 0,
          price: 0
        })
      );
    });
  
    it('should throw if perfume name is empty', async () => {
      const invalidDto = { ...createPerfumeDto, name: '' };
      await expect(service.createPerfume(invalidDto))
        .rejects.toThrow('Perfume name is required');
    });
  
    it('should throw if perfume already exists', async () => {
      mockPerfumesRepository.findPerfumeByName.mockResolvedValue(mockPerfume);
      await expect(service.createPerfume(createPerfumeDto))
        .rejects.toThrow(ConflictException);
    });
  
    it('should throw if error when creating perfume', async () => {
      mockPerfumesRepository.findPerfumeByName.mockResolvedValue(null);
      mockPerfumesRepository.createPerfume.mockRejectedValue(new Error('Error when creating perfume'));
      await expect(service.createPerfume(createPerfumeDto)).rejects.toThrow(HttpException);
    });
  });

  describe('updatePerfume', () => {
    it('should update a perfume', async () => {
      mockPerfumesRepository.findPerfumeByName.mockResolvedValue(null);
      mockPerfumesRepository.updatePerfume.mockResolvedValue(mockPerfume);
    });

    it('should throw if perfume already exists', async () => {
      mockPerfumesRepository.findPerfumeByName.mockResolvedValue(mockPerfume);
      await expect(service.updatePerfume(1, updatePerfumeDto))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw if error when updating perfume', async () => {
      mockPerfumesRepository.findPerfumeByName.mockResolvedValue(null);
      mockPerfumesRepository.updatePerfume.mockRejectedValue(new Error('Error when updating perfume'));
      await expect(service.updatePerfume(1, updatePerfumeDto)).rejects.toThrow(HttpException);
    });
  });

  describe('deletePerfume', () => {
    it('should delete a perfume', async () => {
      mockPerfumesRepository.findPerfumeById.mockResolvedValue(mockPerfume);
      mockPerfumesRepository.deletePerfume.mockResolvedValue(mockPerfume);
      const result = await service.deletePerfume(1);
      expect(result).toEqual(mockPerfume);
    });

    it('should throw if perfume not found', async () => {
      mockPerfumesRepository.deletePerfume.mockResolvedValue(null);
      await expect(service.deletePerfume(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw if error when deleting perfume', async () => {
      mockPerfumesRepository.findPerfumeById.mockResolvedValue(mockPerfume);
      mockPerfumesRepository.deletePerfume.mockRejectedValue(new Error('Error when deleting perfume'));
      await expect(service.deletePerfume(1)).rejects.toThrow(HttpException);
    });
  });
});
