import { Costumer } from "../entities/costumers";

export interface CostumerServiceInterface {
    findAll(): Promise<Costumer[]>;   
    findById(id: string): Promise<Costumer | null>;
    create(costumer: Costumer): Promise<Costumer>;
    update(id: number, costumer: Costumer): Promise<Costumer>;
    delete(id: number): Promise<void>;
    findByIdentity(identity: number): Promise<Costumer | null>;
}