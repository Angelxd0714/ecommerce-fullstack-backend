import { InjectRepository } from '@nestjs/typeorm';
    import { Costumer } from '../../domain/entities/costumers';
import { Injectable } from '@nestjs/common';
import { CostumerRepositoryPort } from '../../domain/ports/costumer.repository';
import { Repository } from 'typeorm';
@Injectable()
export class CostumerRepositoryImpl implements CostumerRepositoryPort {
    constructor(
        @InjectRepository(Costumer  )
        private readonly costumerRepository: Repository<Costumer>,
    ) {}
    findByIdentity(identity: number): Promise<Costumer | null> {
        return this.costumerRepository.findOneBy({ identity });
    }
    findAll(): Promise<Costumer[]> {
        return this.costumerRepository.find();
    }
    findById(id: string): Promise<Costumer | null> {
        return this.costumerRepository.findOneBy({ id });
    }
    create(costumer: Costumer): Promise<Costumer> {
        return this.costumerRepository.save(costumer);
    }
    async update(id: string, costumer: Costumer): Promise<Costumer> {
        const costumerUpdated = await this.costumerRepository.findOneBy({ id });
        if (!costumerUpdated) {
            throw new Error('Costumer not found');
        }
        return this.costumerRepository.save(costumer);
    }
    async delete(id: string): Promise<void> {
        await this.costumerRepository.delete(id);
    }
}