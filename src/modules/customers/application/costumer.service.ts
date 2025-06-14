import { Injectable } from '@nestjs/common';
import { CostumerServiceInterface } from '../domain/ports/costumer.service.interface';
import { Costumer } from '../domain/entities/costumers';
import { CostumerRepositoryPort } from '../domain/ports/costumer.repository';
import { Inject } from '@nestjs/common';

@Injectable()
export class CostumerService implements CostumerServiceInterface {
    constructor(
        @Inject('CostumerRepositoryPort')
        private readonly costumerRepository: CostumerRepositoryPort,
    ) {}
    async findAll(): Promise<Costumer[]> {
        const costumers = await this.costumerRepository.findAll();
        if (!costumers) {
            throw new Error('Costumers not found');
        }
        return costumers;
    }
    async findById(id: string): Promise<Costumer | null> {
        const costumer = await this.costumerRepository.findById(id);
          if (!costumer) {
            throw new Error('Costumer not found');
        }
        return costumer;
    }
    async create(costumer: Costumer): Promise<Costumer> {
        const createdCostumer = await this.costumerRepository.create(costumer);
        if (!createdCostumer) {
            throw new Error('Costumer not created');
        }
        return createdCostumer;
    }
    async update(id: string, costumer: Costumer): Promise<Costumer> {
        const updatedCostumer = await this.costumerRepository.findById(id);
        if (!updatedCostumer) {
            throw new Error('Costumer not found');
        }
        updatedCostumer.name = costumer.name;
        updatedCostumer.email = costumer.email;
         updatedCostumer.phone = costumer.phone;
        return this.costumerRepository.update(id, updatedCostumer);
    }
    async delete(id: string): Promise<void> {
        const deletedCostumer = await this.costumerRepository.findById(id);
        if (!deletedCostumer) {
            throw new Error('Costumer not found');
        }
        return this.costumerRepository.delete(id);
    }
}
