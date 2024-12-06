import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from './inventory.controller';
import { InventoryService } from '../service/inventory.service';
import { HttpStatus, Logger } from '@nestjs/common';
import { Response } from '../../../assets/response';
import { PerfumeSize } from '../../../entities/Inventory.entity';

describe('InventoryController', () => {
  let controller: InventoryController;
  let service: InventoryService;

  const mockInventoryService = {
    findAllInventories: jest.fn(),
    findInventoryById: jest.fn(),
    updateInventory: jest.fn(),
    updateStock: jest.fn(),
    searchInventory: jest.fn(),
  };

  const mockResponse = {
    success: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [
        { provide: InventoryService, useValue: mockInventoryService },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    controller = module.get<InventoryController>(InventoryController);
    service = module.get<InventoryService>(InventoryService);
  });

  describe('findAllInventories', () => {
    it('debería retornar todos los inventarios exitosamente', async () => {
      const mockInventories = [{ id: 1, stock: 10 }];
      mockInventoryService.findAllInventories.mockResolvedValue(mockInventories);

      const result = await controller.findAllInventories();

      expect(result).toEqual({
        data: mockInventories,
        message: 'Inventarios obtenidos exitosamente',
        status: 'success',
        statusCode: HttpStatus.OK,
      });
      expect(mockLogger.log).toHaveBeenCalledWith('Finding all inventories');
    });
  });

  describe('findInventoryById', () => {
    it('debería retornar un inventario por ID exitosamente', async () => {
      const mockInventory = { id: 1, stock: 10 };
      mockInventoryService.findInventoryById.mockResolvedValue(mockInventory);

      const result = await controller.findInventoryById(1);

    expect(result).toEqual({
        data: mockInventory,
        message: 'Inventario obtenido exitosamente',
        status: 'success',
        statusCode: HttpStatus.OK,
      });
      expect(mockLogger.log).toHaveBeenCalledWith('Finding inventory by id: 1');
    });
  });

  describe('updateInventory', () => {
    it('debería actualizar un inventario exitosamente', async () => {
      const updateData = { stock: 20 };
      
      const result = await controller.updateInventory(1, updateData);

      expect(result).toEqual({
        data: null,
        message: 'Inventario actualizado exitosamente',
        status: 'success',
        statusCode: HttpStatus.OK,
      });
      expect(mockInventoryService.updateInventory).toHaveBeenCalledWith(1, updateData);
      expect(mockLogger.log).toHaveBeenCalledWith('Updating inventory with id: 1');
    });
  });

  describe('updateStock', () => {
    it('debería actualizar el stock exitosamente', async () => {
      const result = await controller.updateStock(1, 15);

      expect(result).toEqual({
        data: null,
        message: 'Stock actualizado exitosamente',
        status: 'success',
        statusCode: HttpStatus.OK,
      });
      expect(mockInventoryService.updateStock).toHaveBeenCalledWith(1, 15);
      expect(mockLogger.log).toHaveBeenCalledWith('Updating stock of inventory with id: 1');
    });
  });

  describe('searchInventory', () => {
    it('debería buscar inventarios con filtros exitosamente', async () => {
      const mockFilters = {
        query: 'perfume',
        size: PerfumeSize.SMALL,
        minPrice: 10,
        maxPrice: 100,
        inStock: true,
      };
      const mockResults = [{ id: 1, stock: 10 }];
      mockInventoryService.searchInventory.mockResolvedValue(mockResults);

      const result = await controller.searchInventory(mockFilters);

      expect(result).toEqual({
        data: mockResults,
        message: 'Inventarios encontrados exitosamente',
        status: 'success',
        statusCode: HttpStatus.OK,
      });
      expect(mockInventoryService.searchInventory).toHaveBeenCalledWith(mockFilters);
      expect(mockLogger.log).toHaveBeenCalledWith('Searching inventory');
    });
  });
});