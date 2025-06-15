import { TransactionRepositoryPort } from "../../domain/ports/transaction.repository";
import { Transaction } from "../../domain/entities/transaction";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
@Injectable()
export class TransactionRepositoryImpl implements TransactionRepositoryPort {
    constructor(
        @InjectRepository(Transaction)
        private readonly repo: Repository<Transaction>,
    ) { }
    findAll(): Promise<Transaction[]> {
        const transactions = this.repo.find();
        if (!transactions) {
            throw new Error('No transactions found');
        }
        return transactions;
    }
    findById(id: string): Promise<Transaction | null> {
        const transaction = this.repo.findOneBy({ id });
        if (!transaction) {
            throw new Error('No transaction found');
        }
        return transaction;
    }
    create(transaction: Transaction): Promise<Transaction> {
        const newTransaction = this.repo.create(transaction);
        return this.repo.save(newTransaction);
    }
    update(id: string, transaction: Transaction): Promise<Transaction> {
            const updatedTransaction = this.repo.create({ id, ...transaction });
        return this.repo.save(updatedTransaction);
    }
    delete(id: string): Promise<void> {
        const transaction = this.repo.findOneBy({ id });
        if (!transaction) {
            throw new Error('No transaction found');
        }
        this.repo.delete(id);
        return;
    }
}
