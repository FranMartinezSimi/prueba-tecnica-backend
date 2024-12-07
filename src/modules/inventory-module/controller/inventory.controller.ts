import { Controller, Get, Param, Query, Put, Logger, HttpStatus, Body, UseGuards } from '@nestjs/common';
import { InventoryService } from '../service/inventory.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from '../../../assets/response';
import { UpdateInventoryData } from '../dto/UpdateInventory.dto';
import { PerfumeSize } from '@/entities/Inventory.entity';
import { AuthGuard } from '../../../guards/Auth.guard';


@UseGuards(AuthGuard)
@ApiTags('Inventario')
@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService, private readonly logger: Logger) {}

    @Get()
    @ApiOperation({ summary: 'Obtener todos los inventarios' })
    @ApiResponse({ status: 200, description: 'Inventarios obtenidos exitosamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    async findAllInventories(): Promise<Response> {
        this.logger.log('Finding all inventories');
        const inventories = await this.inventoryService.findAllInventories();
        return Response.success('Inventarios obtenidos exitosamente', inventories, HttpStatus.OK);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un inventario por ID' })
    @ApiResponse({ status: 200, description: 'Inventario obtenido exitosamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    async findInventoryById(@Param('id') id: number): Promise<Response> {
        this.logger.log(`Finding inventory by id: ${id}`);
        const inventory = await this.inventoryService.findInventoryById(id);
        return Response.success('Inventario obtenido exitosamente', inventory, HttpStatus.OK);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar un inventario' })
    @ApiResponse({ status: 200, description: 'Inventario actualizado exitosamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    async updateInventory(@Param('id') id: number, @Body() data: UpdateInventoryData): Promise<Response> {
        this.logger.log(`Updating inventory with id: ${id}`);
        await this.inventoryService.updateInventory(id, data);
        return Response.success('Inventario actualizado exitosamente', null, HttpStatus.OK);
    }

    @Put(':id/stock')
    @ApiOperation({ summary: 'Actualizar el stock de un inventario' })
    @ApiResponse({ status: 200, description: 'Stock actualizado exitosamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    async updateStock(
        @Param('id') id: number, 
        @Body('quantity') quantity: number
    ): Promise<Response> {
        this.logger.log(`Updating stock of inventory with id: ${id}`);
        await this.inventoryService.updateStock(id, quantity);
        return Response.success('Stock actualizado exitosamente', null, HttpStatus.OK);
    }

    @Get('search')
    @ApiOperation({ summary: 'Buscar inventarios' })
    @ApiResponse({ status: 200, description: 'Inventarios encontrados exitosamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    async searchInventory(@Query() filters:  {
        query?: string;
        size?: PerfumeSize;
        minPrice?: number;
        maxPrice?: number;
        inStock?: boolean;
    }): Promise<Response> {
        this.logger.log('Searching inventory');
        const inventories = await this.inventoryService.searchInventory(filters);
        return Response.success('Inventarios encontrados exitosamente', inventories, HttpStatus.OK);
    }
}
