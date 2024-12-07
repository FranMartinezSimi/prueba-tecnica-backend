import { Test, TestingModule } from '@nestjs/testing';
import { PerfumesController } from './perfumes.controller';
import { PerfumesService } from '../services/perfumes.service';
import { Perfume } from '../../../entities/Perfume.entity';
import { Brand } from '../../../entities/Brand.entity';
import { CreatePerfumeDto } from '../dto/createPerfume.dto';
import { UpdatePerfumeDto } from '../dto/updatePerfume.dto';
import { HttpStatus, Logger } from '@nestjs/common';
import { Response } from '../../../assets/response';
import { JwtService } from '@nestjs/jwt';
describe('PerfumesController', () => {
  let controller: PerfumesController;
  let service: PerfumesService;

  const perfume: Perfume = {
    id: 1,
    name: 'Perfume 1',
    brand: new Brand(),
    description: 'Description 1',
    imageUrl: '',
    inventory: []
  };

  const createPerfumeDto: CreatePerfumeDto = {
    name: 'New Perfume',
    brandId: 1,
    description: 'Description 1',
    imageUrl: '',
  };    

  const updatePerfumeDto: UpdatePerfumeDto = {
    name: 'Updated Perfume',
    brandId: 1,
    description: 'Description 1',
    imageUrl: '',
  };

  const mockPerfumesService = {
    findAllPerfumes: jest.fn().mockResolvedValue([perfume]),
    findPerfumeById: jest.fn().mockResolvedValue(perfume),
    createPerfume: jest.fn().mockResolvedValue(null),
    updatePerfume: jest.fn().mockResolvedValue(null),
    deletePerfume: jest.fn().mockResolvedValue(null),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerfumesController],
      providers: [
        { provide: PerfumesService, useValue: mockPerfumesService },
        { provide: Logger, useValue: { log: jest.fn() } },
        JwtService,
      ],
    }).compile();

    controller = module.get<PerfumesController>(PerfumesController);
    service = module.get<PerfumesService>(PerfumesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAllPerfumes', () => {
    it('should return an array of perfumes', async () => {
      const result = await controller.findAllPerfumes();
      expect(result).
      toEqual({
        status: 'success',
        statusCode: HttpStatus.OK,
        message: 'Perfumes obtenidos exitosamente',
        data: [perfume]
      })
    });

    it('should throw an internal server error', async () => {
      mockPerfumesService.findAllPerfumes.mockRejectedValue(new Error('Error interno del servidor'));
      await expect(controller.findAllPerfumes()).rejects.toThrow('Error interno del servidor');
    });
  });

  describe('findPerfumeById', () => {
    it('should return a perfume by id', async () => {
      const result = await controller.findPerfumeById(1);
      expect(result).toEqual(Response.success('Perfume obtenido exitosamente', perfume, HttpStatus.OK));
    });

    it('should throw an internal server error', async () => {
      mockPerfumesService.findPerfumeById.mockRejectedValue(new Error('Error interno del servidor'));
      await expect(controller.findPerfumeById(1)).rejects.toThrow('Error interno del servidor');
    });
  });

  describe('createPerfume', () => {
    it('should create a new perfume', async () => {
      const result = await controller.createPerfume(createPerfumeDto);
      expect(result).toEqual(Response.success('Perfume created successfully', null, HttpStatus.CREATED));
    });

    it('should throw an internal server error', async () => {
      mockPerfumesService.createPerfume.mockRejectedValue(new Error('Error interno del servidor'));
      await expect(controller.createPerfume(createPerfumeDto)).rejects.toThrow('Error interno del servidor');
    });
  });

  describe('updatePerfume', () => {
    it('should update a perfume', async () => {
      const result = await controller.updatePerfume(1, updatePerfumeDto);
      expect(result).toEqual(Response.success('Perfume actualizado exitosamente', null, HttpStatus.OK));
    });

    it('should throw an internal server error', async () => {
      mockPerfumesService.updatePerfume.mockRejectedValue(new Error('Error interno del servidor'));
      await expect(controller.updatePerfume(1, updatePerfumeDto)).rejects.toThrow('Error interno del servidor');
    });
  });

  describe('deletePerfume', () => {
    it('should delete a perfume', async () => {
      const result = await controller.deletePerfume(1);
      expect(result).toEqual(Response.success('Perfume eliminado exitosamente', null, HttpStatus.OK));
    });

    it('should throw an internal server error', async () => {
      mockPerfumesService.deletePerfume.mockRejectedValue(new Error('Error interno del servidor'));
      await expect(controller.deletePerfume(1)).rejects.toThrow('Error interno del servidor');
    });
  });
});
