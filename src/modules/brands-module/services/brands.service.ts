import { ConflictException, HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IBrandsRepository } from '../interface/brands.repository.interface';
import { Brand } from '@/entities/Brand.entity';
import { CreateBrandDto } from '../dto/create.dto';
import { UpdateBrandDto } from '../dto/update.dto';

@Injectable()
export class BrandsService {
  constructor(
    @Inject('BRANDS_REPOSITORY')
    private brandsRepository: IBrandsRepository,
    private readonly logger: Logger
  ) {}

  async findAllBrands(): Promise<Brand[]> {
    this.logger.log('Finding all brands');
    try {
      const brands = await this.brandsRepository.findAllBrands();
      if (brands.length === 0) {
        this.logger.log('No brands found');
        throw new NotFoundException('No se encontraron marcas');
      }
      this.logger.log(`Successfully found ${brands.length} brands`);
      return brands;
    } catch (error) {
      this.logger.error(`Error finding all brands: ${error}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findBrandById(id: number): Promise<Brand> {
    this.logger.log(`Finding brand by id: ${id}`);
    try {
      const brand = await this.brandsRepository.findBrandById(id);
      if (!brand) {
        this.logger.log(`Brand not found by id: ${id}`);
        throw new NotFoundException('Marca no encontrada');
      }
      this.logger.log(`Successfully found brand by id: ${id}`);
      return brand;
    } catch (error) {
      this.logger.error(`Error finding brand by id: ${id}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  async createBrand(brand: CreateBrandDto): Promise<void> {
    this.logger.log('Creating brand');
    try {
      const findBrand = await this.brandsRepository.findBrandByName(brand.name);
      if (findBrand) {
        this.logger.log(`Brand already exists: ${brand.name}`);
        throw new ConflictException('Marca ya existe');
      }
      await this.brandsRepository.createBrand({ ...brand, logo: brand.logo || '' });
      this.logger.log('Successfully created brand');
    } catch (error) {
      this.logger.error(`Error creating brand: ${error}`);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateBrand(id: number, brand: UpdateBrandDto): Promise<void> {
    this.logger.log('Updating brand');
    try {
      const result = await this.brandsRepository.updateBrand(id, brand);
      if (result.affected === 0) {
        this.logger.log(`Brand not found by id: ${id}`);
        throw new NotFoundException('Marca no encontrada');
      }
      this.logger.log('Successfully updated brand');
    } catch (error) {
      this.logger.error(`Error updating brand: ${error}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        'Error al actualizar la marca',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
}

async deleteBrand(id: number): Promise<void> {
  this.logger.log(`Deleting brand by id: ${id}`);
  try {
    const result = await this.brandsRepository.deleteBrand(id);
    if (result.affected === 0) {
      this.logger.log(`Brand not found by id: ${id}`);
      throw new NotFoundException('Marca no encontrada');
    }
    this.logger.log('Successfully deleted brand');
  } catch (error) {
    this.logger.error(`Error deleting brand by id: ${id}`);
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new HttpException(
      'Error al eliminar la marca', 
      HttpStatus.INTERNAL_SERVER_ERROR
    );
    }
  }
}
