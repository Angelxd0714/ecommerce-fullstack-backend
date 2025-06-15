import { Injectable, Inject } from '@nestjs/common';
import { TransactionRepositoryPort } from '../domain/ports/transaction.repository';
import { Transaction } from '../domain/entities/transaction';
import { TransactionServiceInterface     } from '../domain/ports/transaction.service.interface';

@Injectable()
export class TransactionService implements TransactionServiceInterface {
    constructor(
        @Inject('TransactionRepositoryPort')
        private readonly transactionRepository: TransactionRepositoryPort,
    ) { }
    async findAll(): Promise<Transaction[]> {
        const transactions = await this.transactionRepository.findAll();
        if (!transactions) {
            throw new Error('No transactions found');
        }
        return transactions;
    }
    async findById(id: string): Promise<Transaction | null> {
        const transaction = await this.transactionRepository.findById(id);
        if (!transaction) {
            throw new Error('No transaction found');
        }
        return transaction;
    }
    async create(transaction: Transaction): Promise<Transaction> {
        const createdTransaction = await this.transactionRepository.create(transaction);
        return createdTransaction;
    }
    async update(id: string, transaction: Transaction): Promise<Transaction> {
        const updatedTransaction = await this.transactionRepository.update(id, transaction);
        if (!updatedTransaction) {
            throw new Error('No transaction found');
        }
        return updatedTransaction;
    }
    async delete(id: string): Promise<void> {
        const find = await this.transactionRepository.findById(id);
        if (!find) {
            throw new Error('Transaction not found');
        }
        return this.transactionRepository.delete(id);
    }
   
}
