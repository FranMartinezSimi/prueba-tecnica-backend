import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { Perfume } from '../../../entities/Perfume.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePerfumeDto } from '../dto/createPerfume.dto';
import { UpdatePerfumeDto } from '../dto/updatePerfume.dto';
import { IPerfumesRepository } from '../interfaces/perfumes.repository.interface';

@Injectable()
export class PerfumesRepository extends Repository<Perfume> implements IPerfumesRepository {
  constructor(
    @InjectRepository(Perfume)
    private perfumeRepository: Repository<Perfume>,
    private readonly logger: Logger,
  ) {
    super(perfumeRepository.target, perfumeRepository.manager, perfumeRepository.queryRunner);
  }

  async findAllPerfumes(): Promise<Perfume[]> {
    this.logger.log('Finding all perfumes');
    try {
      return this.perfumeRepository.find({ relations: ['brand'] });
    } catch (error) {
      this.logger.error(`Error finding all perfumes: ${error}`);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findPerfumeById(id: number): Promise<Perfume> {
    this.logger.log(`Finding perfume by id: ${id}`);
    try {
      return this.perfumeRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(`Error finding perfume by id: ${id}`);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createPerfume(perfume: CreatePerfumeDto): Promise<InsertResult> {
    this.logger.log('Creating perfume');
    try {
      return this.perfumeRepository.insert(perfume);
    } catch (error) {
      this.logger.error(`Error creating perfume: ${error}`);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updatePerfume(id: number, perfume: UpdatePerfumeDto): Promise<UpdateResult> {
    this.logger.log(`Updating perfume by id: ${id}`);
    try {
      return this.perfumeRepository.update(id, perfume);
    } catch (error) {
      this.logger.error(`Error updating perfume by id: ${id}`);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deletePerfume(id: number): Promise<DeleteResult> {
    this.logger.log(`Deleting perfume by id: ${id}`);
    try {
      return this.perfumeRepository.delete(id);
    } catch (error) {
      this.logger.error(`Error deleting perfume by id: ${id}`);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findPerfumeByName(name: string): Promise<Perfume> {
    this.logger.log(`Finding perfume by name: ${name}`);
    try {
      return this.perfumeRepository.findOne({ where: { name } });
    } catch (error) {
      this.logger.error(`Error finding perfume by name: ${name}`);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
