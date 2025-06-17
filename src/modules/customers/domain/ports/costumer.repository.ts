import { Costumer } from "../entities/costumers";

export interface CostumerRepositoryPort {
    findAll(): Promise<Costumer[]>;   
    findById(id: string): Promise<Costumer | null>;
    create(costumer: Costumer): Promise<Costumer>;
    update(id: string, costumer: Costumer): Promise<Costumer>;
    delete(id: string): Promise<void>;
    findByIdentity(identity: number): Promise<Costumer | null>;
}