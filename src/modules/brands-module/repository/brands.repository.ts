import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { Brand } from '../../../entities/Brand.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBrandDto } from '../dto/create.dto';
import { UpdateBrandDto } from '../dto/update.dto';

@Injectable()
export class BrandsRepository extends Repository<Brand> {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    private readonly logger: Logger,
  ) {
    super(brandRepository.target, brandRepository.manager, brandRepository.queryRunner);
  }

  async findAllBrands(): Promise<Brand[]> {
    this.logger.log('Finding all brands');
    try {
      return this.brandRepository.find();
    } catch (error) {
      this.logger.error(`Error finding all brands: ${error}`);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findBrandById(id: number): Promise<Brand> {
    this.logger.log(`Finding brand by id: ${id}`);
    try {
      return this.brandRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(`Error finding brand by id: ${id}`);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createBrand(brand: CreateBrandDto): Promise<InsertResult> {
    this.logger.log('Creating brand');
    try {
      return this.brandRepository.insert(brand);
    } catch (error) {
      this.logger.error(`Error creating brand: ${error}`);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateBrand(id: number, brand: UpdateBrandDto): Promise<UpdateResult> {
    this.logger.log('Updating brand');
    try {
      return this.brandRepository.update(
        { id },
        brand,
      );
    } catch (error) {
      this.logger.error(`Error updating brand: ${error}`);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteBrand(id: number): Promise<DeleteResult> {
    this.logger.log(`Deleting brand by id: ${id}`);
    try {
      return this.brandRepository.delete(id);
    } catch (error) {
      this.logger.error(`Error deleting brand by id: ${id}`);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findBrandByName(name: string): Promise<Brand> {
    this.logger.log(`Finding brand by name: ${name}`);
    try {
      return this.brandRepository.findOne({ where: { name } });
    } catch (error) {
      this.logger.error(`Error finding brand by name: ${name}`);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
