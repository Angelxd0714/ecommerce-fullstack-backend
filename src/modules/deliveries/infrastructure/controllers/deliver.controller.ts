import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ResponseDelivery } from '../../application/dto/reponse-delivery';
import { CreateDelivery } from '../../application/dto/create-delivery';
import { Delivery } from '../../domain/entities/delivery';
import { DeliveryService } from '../../application/delivery.service';

@Controller('deliveries')
export class InfrastructureController {
    constructor(
        private readonly deliveryService: DeliveryService,
    ) {}
    @Get()
    async findAll(): Promise<ResponseDelivery[]> {
        return this.deliveryService.findAll().then(deliveries => {
            return deliveries.map(delivery => ({
                id: delivery.id,
                transactionId: delivery.transactionId,
                address: delivery.address,
                city: delivery.city,
                postalCode: delivery.postalCode,
                delivered: delivery.delivered,
                createdAt: delivery.createdAt,
                updatedAt: delivery.updatedAt
            }));
        });
    }
    @Get(':id')
    async findById(@Param('id') id: string): Promise<ResponseDelivery | null> {
        return this.deliveryService.findById(id).then(delivery => {
            return {
                id: delivery.id,
                transactionId: delivery.transactionId,
                address: delivery.address,
                city: delivery.city,
                postalCode: delivery.postalCode,
                delivered: delivery.delivered,
                createdAt: delivery.createdAt,
                updatedAt: delivery.updatedAt
            };
        });
    }
    @Post()
    async create(@Body() delivery: CreateDelivery): Promise<ResponseDelivery> {
        const newDelivery = new Delivery();
        newDelivery.transactionId = delivery.transactionId;
        newDelivery.address = delivery.address;
        newDelivery.city = delivery.city;
        newDelivery.postalCode = delivery.postalCode;
        newDelivery.delivered = delivery.delivered;
        newDelivery.createdAt = new Date();
        return this.deliveryService.create(newDelivery).then(delivery => {
            return {
                id: delivery.id,
                transactionId: delivery.transactionId,
                address: delivery.address,
                city: delivery.city,
                postalCode: delivery.postalCode,
                delivered: delivery.delivered,
                createdAt: delivery.createdAt,
                updatedAt: delivery.updatedAt
            };
        });
    }
    @Put(':id')
    async update(@Param('id') id: string, @Body() delivery: CreateDelivery): Promise<ResponseDelivery> {
        const updatedDelivery = new Delivery();
        updatedDelivery.transactionId = delivery.transactionId;
        updatedDelivery.address = delivery.address;
        updatedDelivery.city = delivery.city;
        updatedDelivery.postalCode = delivery.postalCode;
        updatedDelivery.delivered = delivery.delivered;
        updatedDelivery.updatedAt = new Date();
        return this.deliveryService.update(id, updatedDelivery).then(delivery => {
            return {
                id: delivery.id,
                transactionId: delivery.transactionId,
                address: delivery.address,
                city: delivery.city,
                postalCode: delivery.postalCode,
                delivered: delivery.delivered,
                createdAt: delivery.createdAt,
                updatedAt: delivery.updatedAt
            };
        });
    }
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.deliveryService.delete(id).then(() => {
            return;
        });
    }   
}
