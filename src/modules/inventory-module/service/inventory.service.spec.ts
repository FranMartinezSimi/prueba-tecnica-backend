import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { HttpException, NotFoundException } from '@nestjs/common';
import { PerfumeSize } from '../../../entities/Inventory.entity';

describe('InventoryService', () => {
  let service: InventoryService;
  let mockInventoryRepository;

  const mockInventory = {
    id: 1,
    name: 'Test Perfume',
    price: 100,
    size: 'SMALL',
    stock: 10
  };

  beforeEach(async () => {
    mockInventoryRepository = {
      findAllInventories: jest.fn().mockResolvedValue([mockInventory]),
      findInventoryById: jest.fn().mockResolvedValue(mockInventory),
      updateInventory: jest.fn(),
      updateStock: jest.fn(),
      searchInventory: jest.fn().mockResolvedValue([mockInventory]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: 'INVENTORY_REPOSITORY',
          useValue: mockInventoryRepository,
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
  });

  describe('findAllInventories', () => {
    it('should return all inventories', async () => {
      mockInventoryRepository.findAllInventories.mockResolvedValue([mockInventory]);
      
      const result = await service.findAllInventories();
      
      expect(result).toEqual([mockInventory]);
      expect(mockInventoryRepository.findAllInventories).toHaveBeenCalled();
    });

    it('should handle errors when searching for inventories', async () => {
      mockInventoryRepository.findAllInventories.mockRejectedValue(new Error());
      
      await expect(service.findAllInventories()).rejects.toThrow(HttpException);
    });
  });

  describe('findInventoryById', () => {
    it('should return an inventory by ID', async () => {
      mockInventoryRepository.findInventoryById.mockResolvedValue(mockInventory);
      
      const result = await service.findInventoryById(1);
      
      expect(result).toEqual(mockInventory);
    });

    it('should throw an error when the inventory is not found', async () => {
      mockInventoryRepository.findInventoryById.mockResolvedValue(null);
      
      await expect(service.findInventoryById(999)).rejects.toThrow(HttpException);
    });
  });


  describe('updateStock', () => {
    it('should update the stock of an inventory', async () => {
      mockInventoryRepository.findInventoryById.mockResolvedValue(mockInventory);
      
      await service.updateStock(1, 20);
      
      expect(mockInventoryRepository.updateStock).toHaveBeenCalledWith(1, 20);
    });

    it('should throw an error when the inventory is not found', async () => {
      mockInventoryRepository.findInventoryById.mockResolvedValue(null);
      
      await expect(service.updateStock(999, 20)).rejects.toThrow(HttpException);
    });
  });

  describe('searchInventory', () => {
    it('should search inventories with filters', async () => {
      const filters = {
        query: 'perfume',
        size: 'SMALL',
        minPrice: 50,
        maxPrice: 200,
        inStock: true
      };

      mockInventoryRepository.searchInventory.mockResolvedValue([mockInventory]);
      
      const result = await service.searchInventory({
        ...filters,
        size: PerfumeSize.SMALL
      });
      
      expect(result).toEqual([mockInventory]);
      expect(mockInventoryRepository.searchInventory).toHaveBeenCalledWith({
        ...filters,
        size: PerfumeSize.SMALL
      });
    });
  });
});