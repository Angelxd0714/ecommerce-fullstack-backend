import { Transaction } from "../entities/transaction";

export interface TransactionRepositoryPort {
    findOneBy(arg0: { wompiTransactionId: string; }): Promise<Transaction>;
    findAll(): Promise<Transaction[]>;
    findById(id: string): Promise<Transaction | null>;
    create(transaction: Transaction): Promise<Transaction>;
    update(id: string, transaction: Transaction): Promise<Transaction>;
    delete(id: string): Promise<void>;
}
