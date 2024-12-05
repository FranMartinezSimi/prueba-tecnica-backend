import { Test, TestingModule } from '@nestjs/testing';
import { BrandsService } from './brands.service';
import { Logger, NotFoundException, ConflictException, HttpException } from '@nestjs/common';
import { Brand } from '@/entities/Brand.entity';

describe('BrandsService', () => {
  let service: BrandsService;
  let mockBrandsRepository;
  let mockLogger;

  const mockBrand: Brand = {
    id: 1,
    name: 'Test Brand',
    logo: 'test.png',
    perfumes: [],
  };

  const createBrandDto = {
    name: 'Test Brand',
    logo: ''
  };
  
  const updateBrandDto = {
    name: 'Updated Brand',
    logo: ''
  };
  

  beforeEach(async () => {
    mockBrandsRepository = {
      findAllBrands: jest.fn(),
      findBrandById: jest.fn(),
      findBrandByName: jest.fn(),
      createBrand: jest.fn(),
      updateBrand: jest.fn(),
      deleteBrand: jest.fn(),
    };

    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandsService,
        {
          provide: 'BRANDS_REPOSITORY',
          useValue: mockBrandsRepository,
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<BrandsService>(BrandsService);
  });

  describe('should be defined', () => {
    it('service should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('findAllBrands', () => {
    it('debería retornar un array de marcas', async () => {
      mockBrandsRepository.findAllBrands.mockResolvedValue([mockBrand]);
      const result = await service.findAllBrands();
      expect(result).toEqual([mockBrand]);
    });

    it('debería lanzar NotFoundException cuando no hay marcas', async () => {
      mockBrandsRepository.findAllBrands.mockResolvedValue([]);
      await expect(service.findAllBrands())
        .rejects
        .toThrow(new NotFoundException('No se encontraron marcas'));
    });
  });


  describe('findBrandById', () => {
    it('debería retornar una marca por ID', async () => {
      mockBrandsRepository.findBrandById.mockResolvedValue(mockBrand);
      
      const result = await service.findBrandById(1);
      
      expect(result).toEqual(mockBrand);
      expect(mockBrandsRepository.findBrandById).toHaveBeenCalledWith(1);
    });

    it('debería lanzar NotFoundException cuando la marca no existe', async () => {
      mockBrandsRepository.findBrandById.mockResolvedValue(null);
      
      await expect(service.findBrandById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createBrand', () => {
    it('debería crear una marca exitosamente', async () => {
      mockBrandsRepository.findBrandByName.mockResolvedValue(null);
      await service.createBrand(createBrandDto);
      expect(mockBrandsRepository.createBrand).toHaveBeenCalledWith(createBrandDto);
    });

    it('debería lanzar ConflictException cuando la marca ya existe', async () => {
      mockBrandsRepository.findBrandByName.mockResolvedValue(mockBrand);
      await expect(service.createBrand(createBrandDto))
        .rejects
        .toThrow(new ConflictException('Marca ya existe'));
    });
  });

  describe('updateBrand', () => {
    it('debería actualizar una marca exitosamente', async () => {
      mockBrandsRepository.updateBrand.mockResolvedValue({ affected: 1 });
      
      await service.updateBrand(1, {
        name: 'Updated Brand',
        logo: ''
      });
      
      expect(mockBrandsRepository.updateBrand).toHaveBeenCalledWith(1, { name: 'Updated Brand', logo: '' });
    });

    it('debería lanzar NotFoundException cuando la marca no existe', async () => {
      mockBrandsRepository.updateBrand.mockResolvedValue({ affected: 0 });
      
      await expect(service.updateBrand(999, {
        name: 'Updated Brand',
        logo: ''
      }))
        .rejects.toThrow(NotFoundException);
      expect(mockLogger.log).toHaveBeenCalledWith('Brand not found by id: 999');
    });

    it('debería lanzar HttpException cuando ocurre un error interno', async () => {
      mockBrandsRepository.updateBrand.mockRejectedValue(new Error('DB Error'));
      
      await expect(service.updateBrand(1, {
        name: 'Updated Brand',
        logo: ''
      }))
        .rejects.toThrow(HttpException);
      expect(mockLogger.error).toHaveBeenCalled();
    });
});

describe('deleteBrand', () => {
  it('debería eliminar una marca exitosamente', async () => {
    mockBrandsRepository.deleteBrand.mockResolvedValue({ affected: 1 });
    
    await service.deleteBrand(1);
    
    expect(mockBrandsRepository.deleteBrand).toHaveBeenCalledWith(1);
    expect(mockLogger.log).toHaveBeenCalledWith('Successfully deleted brand');
  });

  it('debería lanzar NotFoundException cuando la marca no existe', async () => {
    mockBrandsRepository.deleteBrand.mockResolvedValue({ affected: 0 });
    
    await expect(service.deleteBrand(999))
      .rejects
      .toThrow(new NotFoundException('Marca no encontrada'));
    
    expect(mockLogger.log).toHaveBeenCalledWith('Brand not found by id: 999');
  });

  it('debería lanzar HttpException cuando ocurre un error interno', async () => {
    mockBrandsRepository.deleteBrand.mockRejectedValue(new Error('DB Error'));
    
    await expect(service.deleteBrand(1))
      .rejects
      .toThrow(HttpException);
    
    expect(mockLogger.error).toHaveBeenCalled();
    });
  });
});
