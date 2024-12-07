import { Controller, Get, Post, Put, Delete, Param, Body, Logger, HttpStatus, HttpCode, UseGuards } from '@nestjs/common';
import { BrandsService } from '../services/brands.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from '../../../assets/response';
import { CreateBrandDto } from '../dto/create.dto';
import { UpdateBrandDto } from '../dto/update.dto';
import { AuthGuard } from '../../../guards/Auth.guard';


@UseGuards(AuthGuard)
@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService, private readonly logger: Logger) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOperation({ summary: 'Obtener todas las marcas' })
  @ApiResponse({ status: 200, description: 'Marcas obtenidas exitosamente' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAllBrands(): Promise<Response> {
    this.logger.log('Finding all brands');
    const brands = await this.brandsService.findAllBrands();
    return Response.success('Marcas obtenidas exitosamente', brands, HttpStatus.OK);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una marca por ID' })
  @ApiResponse({ status: 200, description: 'Marca obtenida exitosamente' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findBrandById(@Param('id') id: number): Promise<Response> {
    this.logger.log(`Finding brand by id: ${id}`);
    const brand = await this.brandsService.findBrandById(id);
    return Response.success('Marca obtenida exitosamente', brand, HttpStatus.OK);
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  @ApiOperation({ summary: 'Crear una nueva marca' })
  @ApiResponse({ status: 200, description: 'Marca creada exitosamente' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async createBrand(@Body() brand: CreateBrandDto): Promise<Response> {
    this.logger.log('Creating brand');
    await this.brandsService.createBrand(brand);
    return Response.success('Marca creada exitosamente', null, HttpStatus.OK);
  }

  @HttpCode(HttpStatus.OK)
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una marca' })
  @ApiResponse({ status: 200, description: 'Marca actualizada exitosamente' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async updateBrand(@Param('id') id: number, @Body() brand: UpdateBrandDto): Promise<Response> {
    this.logger.log(`Updating brand by id: ${id}`);
    await this.brandsService.updateBrand(id, brand);
    return Response.success('Marca actualizada exitosamente', null, HttpStatus.OK);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una marca' })
  @ApiResponse({ status: 200, description: 'Marca eliminada exitosamente' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async deleteBrand(@Param('id') id: number): Promise<Response> {
    this.logger.log(`Deleting brand by id: ${id}`);
    await this.brandsService.deleteBrand(id);
    return Response.success('Marca eliminada exitosamente', null, HttpStatus.OK);
  }
}
