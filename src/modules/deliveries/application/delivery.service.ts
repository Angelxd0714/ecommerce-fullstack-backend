import { Injectable } from '@nestjs/common';
import { DeliveryServicePortInterface } from '../domain/ports/delivery.service.interface';
import { Delivery } from '../domain/entities/delivery';
import { DeliveryRepositoryPort } from '../domain/ports/delivery.repository';
import { Inject } from '@nestjs/common';

@Injectable()
export class DeliveryService implements DeliveryServicePortInterface {
    constructor(
        @Inject('DeliveryRepositoryPort')
        private readonly deliveryService: DeliveryRepositoryPort,
    ) { }
    async findAll(): Promise<Delivery[]> {
        const delivery = await this.deliveryService.findAll();
        if (!delivery) {
            throw new Error('Delivery not found');
        }
        return delivery;
    }
    async findById(id: string): Promise<Delivery | null> {
        const delivery = await this.deliveryService.findById(id);
        if (!delivery) {
            throw new Error('Delivery not found');
        }
        return delivery;
    }
    async create(delivery: Delivery): Promise<Delivery> {
        const createdDelivery = await this.deliveryService.create(delivery);
        if (!createdDelivery) {
            throw new Error('Delivery not found');
        }
        return createdDelivery;
    }
    async update(id: string, delivery: Delivery): Promise<Delivery> {
        const updatedDelivery = await this.deliveryService.update(id, delivery);
        if (!updatedDelivery) {
            throw new Error('Delivery not found');
        }
        return updatedDelivery;
    }
    async delete(id: string): Promise<void> {
        await this.deliveryService.delete(id);
    }
}
