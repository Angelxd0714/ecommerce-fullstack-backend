import { Transaction } from "../entities/transaction";

export interface TransactionRepositoryPort {
    findAll(): Promise<Transaction[]>;
    findById(id: string): Promise<Transaction | null>;
    create(transaction: Transaction): Promise<Transaction>;
    update(id: string, transaction: Transaction): Promise<Transaction>;
    delete(id: string): Promise<void>;
}
