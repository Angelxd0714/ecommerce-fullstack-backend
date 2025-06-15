
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Delivery } from "../../domain/entities/delivery";
import { DeliveryRepositoryPort } from "../../domain/ports/delivery.repository";

export class DeliveryRepositoryImpl implements DeliveryRepositoryPort {
    constructor(
        @InjectRepository(Delivery)
        private readonly repo: Repository<Delivery>
    ) {}
   
      
    findAll(): Promise<Delivery[]> {
        return this.repo.find();
    }
    findById(id: string): Promise<Delivery | null> {
        return this.repo.findOneBy({ id });
    }
    create(delivery: Delivery): Promise<Delivery> {
        return this.repo.save(delivery);
    }
    update(id: string, delivery: Delivery): Promise<Delivery> {
        return this.repo.save({ ...delivery, id });
    }
    delete(id: string): Promise<void> {
        this.repo.delete(id);
        return Promise.resolve();
    }
}