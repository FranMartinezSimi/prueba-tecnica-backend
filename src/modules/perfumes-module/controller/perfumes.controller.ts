import { Controller, Get, Post, Put, Delete, Param, Body, HttpStatus, HttpCode, Logger } from '@nestjs/common';
import { PerfumesService } from '../services/perfumes.service';
import { CreatePerfumeDto } from '../dto/createPerfume.dto';
import { UpdatePerfumeDto } from '../dto/updatePerfume.dto';
import { Response } from '../../../assets/response';

import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('perfumes')
export class PerfumesController {
  constructor(private readonly perfumesService: PerfumesService, private readonly logger: Logger) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOperation({ summary: 'Obtener todos los perfumes' })
  @ApiResponse({ status: 200, description: 'Perfumes obtenidos exitosamente' })
  async findAllPerfumes(): Promise<Response> {
    this.logger.log('Finding all perfumes');
    const perfumes = await this.perfumesService.findAllPerfumes();
    return Response.success('Perfumes obtenidos exitosamente', perfumes, HttpStatus.OK);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un perfume por ID' })
  @ApiResponse({ status: 200, description: 'Perfume obtenido exitosamente' })
  async findPerfumeById(@Param('id') id: number): Promise<Response> {
    this.logger.log(`Finding perfume by id: ${id}`);
    const perfume = await this.perfumesService.findPerfumeById(id);
    return Response.success('Perfume obtenido exitosamente', perfume, HttpStatus.OK);
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  @ApiOperation({ summary: 'Crear un perfume' })
  @ApiResponse({ status: 200, description: 'Perfume creado exitosamente' })
  async createPerfume(@Body() perfume: CreatePerfumeDto): Promise<Response> {
    this.logger.log(`Creating perfume: ${JSON.stringify(perfume)}`);
    await this.perfumesService.createPerfume(perfume);
    return Response.success('Perfume created successfully', null, HttpStatus.CREATED);
  }

  @HttpCode(HttpStatus.OK)
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un perfume' })
  @ApiResponse({ status: 200, description: 'Perfume actualizado exitosamente' })
  async updatePerfume(@Param('id') id: number, @Body() perfume: UpdatePerfumeDto): Promise<Response> {
    this.logger.log(`Updating perfume: ${JSON.stringify(perfume)}`);
    const updatedPerfume = await this.perfumesService.updatePerfume(id, perfume);
    return Response.success('Perfume actualizado exitosamente', updatedPerfume, HttpStatus.OK);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un perfume' })
  @ApiResponse({ status: 200, description: 'Perfume eliminado exitosamente' })
  async deletePerfume(@Param('id') id: number): Promise<Response> {
    this.logger.log(`Deleting perfume by id: ${id}`);
    const deletedPerfume = await this.perfumesService.deletePerfume(id);
    return Response.success('Perfume eliminado exitosamente', deletedPerfume, HttpStatus.OK);
  }
}

