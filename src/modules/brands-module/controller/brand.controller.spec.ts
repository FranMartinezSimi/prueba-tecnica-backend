import { Test, TestingModule } from '@nestjs/testing';
import { BrandsController } from './brands.controller';
import { BrandsService } from '../services/brands.service';
import { Logger } from '@nestjs/common';
import { CreateBrandDto } from '../dto/create.dto';

describe('BrandsController', () => {
  let controller: BrandsController;
  let service: BrandsService;

  const mockBrandsService = {
    findAllBrands: jest.fn(),
    findBrandById: jest.fn(),
    createBrand: jest.fn(),
    updateBrand: jest.fn(),
    deleteBrand: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandsController],
      providers: [
        { provide: BrandsService, useValue: mockBrandsService },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    controller = module.get<BrandsController>(BrandsController);
    service = module.get<BrandsService>(BrandsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAllBrands', () => {
    it('debería retornar todas las marcas exitosamente', async () => {
      const mockBrands = [{ id: 1, name: 'Brand 1' }];
      mockBrandsService.findAllBrands.mockResolvedValue(mockBrands);

      const result = await controller.findAllBrands();

      expect(result).toEqual({
        status: 'success',
        statusCode: 200,
        message: 'Marcas obtenidas exitosamente',
        data: mockBrands
      });
      expect(mockLogger.log).toHaveBeenCalledWith('Finding all brands');
    });
  });

  describe('findBrandById', () => {
    it('debería retornar una marca por ID exitosamente', async () => {
      const mockBrand = { id: 1, name: 'Brand 1' };
      mockBrandsService.findBrandById.mockResolvedValue(mockBrand);

      const result = await controller.findBrandById(1);

      expect(result).toEqual({
        status: 'success',
        statusCode: 200,
        message: 'Marca obtenida exitosamente',
        data: mockBrand
      });
      expect(mockLogger.log).toHaveBeenCalledWith('Finding brand by id: 1');
    });
  });

  describe('createBrand', () => {
    it('debería crear una marca exitosamente', async () => {
      const createBrandDto: CreateBrandDto = {
          name: 'New Brand',
          logo: ''
      };

      const result = await controller.createBrand(createBrandDto);

      expect(result).toEqual({
        status: 'success',
        statusCode: 200,
        message: 'Marca creada exitosamente',
        data: null
      });
      expect(mockLogger.log).toHaveBeenCalledWith('Creating brand');
      expect(mockBrandsService.createBrand).toHaveBeenCalledWith(createBrandDto);
    });
  });

  describe('updateBrand', () => {
    it('debería actualizar una marca exitosamente', async () => {
      const updateBrandDto: CreateBrandDto = {
          name: 'Updated Brand',
          logo: ''
      };

      const result = await controller.updateBrand(1, updateBrandDto);

      expect(result).toEqual({
        status: 'success',
        statusCode: 200,
        message: 'Marca actualizada exitosamente',
        data: null  
      });
      expect(mockLogger.log).toHaveBeenCalledWith('Updating brand by id: 1');
      expect(mockBrandsService.updateBrand).toHaveBeenCalledWith(1, updateBrandDto);
    });
  });

  describe('deleteBrand', () => {
    it('debería eliminar una marca exitosamente', async () => {
      const result = await controller.deleteBrand(1);

      expect(result).toEqual({
        status: 'success',
        statusCode: 200,
        message: 'Marca eliminada exitosamente',
        data: null
      });
      expect(mockLogger.log).toHaveBeenCalledWith('Deleting brand by id: 1');
      expect(mockBrandsService.deleteBrand).toHaveBeenCalledWith(1);
    });
  });
});