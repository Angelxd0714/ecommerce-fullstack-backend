import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { TransactionRepositoryPort } from '../domain/ports/transaction.repository';
import { Transaction } from '../domain/entities/transaction';
import { TransactionServiceInterface } from '../domain/ports/transaction.service.interface';
import { WompiService } from 'src/shared/wompi/wompi.service';
import { PayWithCardDto } from './dto/pay-with-card.dto';
import { ProductService } from 'src/modules/products/application/product.service';
import { DeliveryService } from 'src/modules/deliveries/application/delivery.service';
import { v4 as uuid } from 'uuid';
import { CostumerService } from 'src/modules/customers/application/costumer.service';
import { CreateCardDto } from './dto/create-card';
import { DataSource } from 'typeorm';
import { Product } from 'src/modules/products/domain/entities/product.entity';
import { Costumer } from 'src/modules/customers/domain/entities/costumers';

@Injectable()
export class TransactionService implements TransactionServiceInterface {
  constructor(
    @Inject('TransactionRepositoryPort')
    private readonly transactionRepository: TransactionRepositoryPort,
    @Inject('WompiService')
    private readonly wompiService: WompiService,

    private readonly productService: ProductService,

    private readonly customerService: CostumerService,

    private readonly deliveryService: DeliveryService,
    private readonly dataSource: DataSource
  ) {}
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
    const createdTransaction =
      await this.transactionRepository.create(transaction);
    return createdTransaction;
  }
  async update(id: string, transaction: Transaction): Promise<Transaction> {
    const updatedTransaction = await this.transactionRepository.update(
      id,
      transaction,
    );
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
  
  async processPayment(dto: PayWithCardDto): Promise<Transaction> {
   return await this.dataSource.transaction(async (manager) => {
    console.log("dto",dto);
    const products = await Promise.all(
      dto.products.map(p => 
        manager.findOne(Product, { 
          where: { id: p.productId },
          lock: { mode: "pessimistic_write" } // Bloqueo para evitar race conditions
        })
      )
    );    
    console.log("products",products);
      // Validaciones de stock
      const totalQuantity = dto.products.reduce((sum, p) => sum + p.quantity, 0);
      console.log('totalQuantity',totalQuantity);
      const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
      console.log('totalStock',totalStock);
      if (totalStock < totalQuantity) {
        throw new BadRequestException('Stock insufficient');
      }
    
      const transaction = manager.create(Transaction, {
        id: uuid(),
        status: 'PENDING',
       
        amount: products.map(p => p.price).reduce((sum, p) => sum + p *dto.products.find(p => p.productId === p.productId)?.quantity, 0),
        currency: 'COP',
      });
    
      await manager.save(transaction);
    
      // Customer
      const customer = manager.create(Costumer, dto.customerIdentity);
      await manager.save(customer);
    
      // Wompi
      const reference = `order-${Date.now()}`;
      const wompiResponse = await this.wompiService.createTransaction({
        amountInCents: transaction.amount * 100,
        currency: 'COP',
        cardToken: dto.cardToken,
        reference,
        customerEmail: customer.email,
        customerName: customer.name,
        installments: dto.installments,
        acceptanceToken: dto.acceptanceToken,
      });
      if(wompiResponse.status == 422){
        throw new InternalServerErrorException(wompiResponse.error.message);
      }
      
    
      if (wompiResponse.status === 'PENDING') {
        transaction.status = 'APPROVED';
        transaction.reference = reference;
        transaction.customerId = customer.id;
        transaction.updatedAt = new Date();
        transaction.wompiTransactionId = wompiResponse.id;
    
        await manager.save(transaction);
    
        // Reducir stock
        for (const p of dto.products) {
          if (products) {
            products.forEach(product => {
              product.stock -= p.quantity;
              manager.save(product);
            });
          }
        }
    
        // Crear delivery si quieres
      } else {
        transaction.status = 'DECLINED';
        await manager.save(transaction);
      }
    
      return transaction;
    });
    
  }
  async createCardToken(card: CreateCardDto): Promise<string> {
    return this.wompiService.createCardToken(card);
  }
}
