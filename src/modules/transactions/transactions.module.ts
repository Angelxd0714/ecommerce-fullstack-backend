import { Module } from '@nestjs/common';
import { InfrastructureController } from './infrastructure/controllers/transaction.controller';
import { TransactionService } from './application/transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './domain/entities/transaction';
import { TransactionRepositoryImpl } from './infrastructure/repository/transaction.repository.impl';
@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [InfrastructureController],
  providers: [TransactionService,{
    provide: 'TransactionRepositoryPort',
    useClass: TransactionRepositoryImpl
  }],
  exports: [TransactionService]

})
export class TransactionsModule {}
