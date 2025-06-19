import { Module } from '@nestjs/common';
import { InfrastructureController } from './infrastructure/controllers/transaction.controller';
import { TransactionService } from './application/transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './domain/entities/transaction';
import { TransactionRepositoryImpl } from './infrastructure/repository/transaction.repository.impl';
import { AwsModule } from '../../shared/aws/aws.module';
import { CostumerModule } from '../../modules/customers/costumer.module';
import { ProductsModule } from '../../modules/products/products.module';
import { DeliveriesModule } from '../../modules/deliveries/deliveries.module';
@Module({
  imports: [TypeOrmModule.forFeature([Transaction]),AwsModule,CostumerModule,ProductsModule,DeliveriesModule],
  controllers: [InfrastructureController],
  providers: [TransactionService,{
    provide: 'TransactionRepositoryPort',
    useClass: TransactionRepositoryImpl,
    
    
  }],
  exports: [TransactionService]

})
export class TransactionsModule {}
