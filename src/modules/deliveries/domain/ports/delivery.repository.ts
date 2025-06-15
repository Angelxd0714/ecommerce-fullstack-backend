import { Delivery } from "../entities/delivery";

export interface DeliveryRepositoryPort {
    findAll(): Promise<Delivery[]>;
    findById(id: string): Promise<Delivery | null>;
    create(delivery: Delivery): Promise<Delivery>;
    update(id: string, delivery: Delivery): Promise<Delivery>;
    delete(id: string): Promise<void>;
}