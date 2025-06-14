import { InjectRepository } from '@nestjs/typeorm';
    import { Costumer } from '../../domain/entities/costumers';
import { Injectable } from '@nestjs/common';
import { CostumerRepositoryPort } from '../../domain/ports/costumer.repository';
@Injectable()
export class CostumerRepositoryImpl implements CostumerRepositoryPort {
    constructor(
        @InjectRepository(Costumer  )
        private readonly costumerRepository: CostumerRepositoryPort,
    ) {}
    findAll(): Promise<Costumer[]> {
        return this.costumerRepository.findAll();
    }
    findById(id: string): Promise<Costumer | null> {
        return this.costumerRepository.findById(id);
    }
    create(costumer: Costumer): Promise<Costumer> {
        return this.costumerRepository.create(costumer);
    }
    update(id: string, costumer: Costumer): Promise<Costumer> {
        return this.costumerRepository.update(id, costumer);
    }
    delete(id: string): Promise<void> {
        return this.costumerRepository.delete(id);
    }
}