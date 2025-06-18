import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ResponseDelivery } from '../../application/dto/reponse-delivery';
import { CreateDelivery } from '../../application/dto/create-delivery';
import { Delivery } from '../../domain/entities/delivery';
import { DeliveryService } from '../../application/delivery.service';
import { ApiResponse } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Deliveries')
@Controller('deliveries')
export class InfrastructureController {
  constructor(private readonly deliveryService: DeliveryService) {}
  @Get()
  async findAll(): Promise<ResponseDelivery[]> {
    try {
      return this.deliveryService.findAll().then((deliveries) => {
        return deliveries.map((delivery) => ({
          id: delivery.id,
          transactionId: delivery.transactionId,
          address: delivery.address,
          city: delivery.city,
          postalCode: delivery.postalCode,
          delivered: delivery.delivered,
          createdAt: delivery.createdAt,
          updatedAt: delivery.updatedAt,
        }));
      });
    } catch (error) {
      throw error;
    }
  }
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Entrega encontrada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Entrega no encontrada',
  })
  async findById(@Param('id') id: string): Promise<ResponseDelivery | null> {
    try {
      return this.deliveryService.findById(id).then((delivery) => {
        return {
          id: delivery.id,
          transactionId: delivery.transactionId,
          address: delivery.address,
          city: delivery.city,
          postalCode: delivery.postalCode,
          delivered: delivery.delivered,
          createdAt: delivery.createdAt,
          updatedAt: delivery.updatedAt,
        };
      });
    } catch (error) {
      throw error;
    }
  }
  @ApiResponse({
    status: 201,
    description: 'Entrega creada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @Post()
  async create(@Body() delivery: CreateDelivery): Promise<ResponseDelivery> {
    try {
      const newDelivery = new Delivery();
      newDelivery.transactionId = delivery.transactionId;
      newDelivery.address = delivery.address;
      newDelivery.city = delivery.city;
      newDelivery.postalCode = delivery.postalCode;
      newDelivery.delivered = delivery.delivered;
      newDelivery.createdAt = new Date();
      return this.deliveryService.create(newDelivery).then((delivery) => {
        return {
          id: delivery.id,
          transactionId: delivery.transactionId,
          address: delivery.address,
          city: delivery.city,
          postalCode: delivery.postalCode,
          delivered: delivery.delivered,
          createdAt: delivery.createdAt,
          updatedAt: delivery.updatedAt,
        };
      });
    } catch (error) {
      throw error;
    }
  }
  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Entrega actualizada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Entrega no encontrada',
  })
  async update(
    @Param('id') id: string,
    @Body() delivery: CreateDelivery,
  ): Promise<ResponseDelivery> {
    try {
      const updatedDelivery = new Delivery();
      updatedDelivery.transactionId = delivery.transactionId;
      updatedDelivery.address = delivery.address;
      updatedDelivery.city = delivery.city;
      updatedDelivery.postalCode = delivery.postalCode;
      updatedDelivery.delivered = delivery.delivered;
      updatedDelivery.updatedAt = new Date();
      return this.deliveryService
        .update(id, updatedDelivery)
        .then((delivery) => {
          return {
            id: delivery.id,
            transactionId: delivery.transactionId,
            address: delivery.address,
            city: delivery.city,
            postalCode: delivery.postalCode,
            delivered: delivery.delivered,
            createdAt: delivery.createdAt,
            updatedAt: delivery.updatedAt,
          };
        });
    } catch (error) {
      throw error;
    }
  }
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Entrega eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Entrega no encontrada',
  })
  async delete(@Param('id') id: string): Promise<void> {
    try {
      return this.deliveryService.delete(id).then(() => {
        return;
      });
    } catch (error) {
      throw error;
    }
  }
}
