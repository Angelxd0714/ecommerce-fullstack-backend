import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { TransactionService } from '../../application/transaction.service';

import { CreateTransaction } from '../../application/dto/create-transaction';
import { Transaction } from '../../domain/entities/transaction';
import { ResponseTransaction } from '../../application/dto/response-transaction';
import { PayWithCardDto } from '../../application/dto/pay-with-card.dto';
import { CreateCardDto } from '../../application/dto/create-card';
import { ResponseToken } from '../../application/dto/response-token';
import { ApiResponse } from '@nestjs/swagger';
import { WebHookDto } from '../../application/dto/webHook';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Transactions')
@Controller('transactions')
export class InfrastructureController {
    constructor(
        private readonly transactionService: TransactionService,
    ) { }
    @Post()
    @ApiResponse({ 
        status: 201, 
        description: 'Transacción creada exitosamente' 
      })
    @ApiResponse({ 
        status: 400, 
        description: 'Datos de entrada inválidos' 
      })
    async create(@Body() transaction: CreateTransaction  ): Promise<Transaction> {
        const transactionCreated = new Transaction();
        transactionCreated.amount = transaction.amount;
        transactionCreated.currency = transaction.currency;
        transactionCreated.createdAt = transaction.createdAt;
        transactionCreated.updatedAt = transaction.updatedAt;
        transactionCreated.customerId = transaction.customerId;
        transactionCreated.wompiTransactionId = transaction.wompiTransactionId;
        transactionCreated.reference = transaction.reference;
        return this.transactionService.create(transactionCreated);
    }
    @Get()
    @ApiResponse({ 
        status: 200, 
        description: 'Transacciones encontradas exitosamente' 
      })
    @ApiResponse({ 
        status: 404, 
        description: 'Transacciones no encontradas' 
      })  
    async findAll(): Promise<ResponseTransaction[]> {
        const transactions = await this.transactionService.findAll();
        return transactions.map(transaction => {
            return {
                transactionId: transaction.id,
                amount: transaction.amount,
                currency: transaction.currency,
                createdAt: transaction.createdAt,
                updatedAt: transaction.updatedAt,
                customerId: transaction.customerId,
                wompiTransactionId: transaction.wompiTransactionId,
                reference: transaction.reference,
            };
        });
    }
    @Get(':id')
    @ApiResponse({ 
        status: 200, 
        description: 'Transacción encontrada exitosamente' 
      })
    @ApiResponse({ 
        status: 404, 
        description: 'Transacción no encontrada' 
      })
    async findById(@Param('id') id: string): Promise<ResponseTransaction> {
        const transaction = await this.transactionService.findById(id);
        return {
            transactionId: transaction.id,
            amount: transaction.amount,
            currency: transaction.currency,
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt,
            
            customerId: transaction.customerId,
            wompiTransactionId: transaction.wompiTransactionId,
        };
    }
    @Put(':id')
    @ApiResponse({ 
        status: 200, 
        description: 'Transacción actualizada exitosamente' 
      })
    @ApiResponse({ 
        status: 404, 
        description: 'Transacción no encontrada' 
      })
    @ApiResponse({ 
        status: 400, 
        description: 'Datos de entrada inválidos' 
      })
    async update(@Param('id') id: string, @Body() transaction: Transaction): Promise<ResponseTransaction> {
      try {
  
      const updatedTransaction = await this.transactionService.update(id, transaction);
        return {
            transactionId: updatedTransaction.id,
            amount: updatedTransaction.amount,
            currency: updatedTransaction.currency,
            createdAt: updatedTransaction.createdAt,
            updatedAt: updatedTransaction.updatedAt,
          
            customerId: updatedTransaction.customerId,
            wompiTransactionId: updatedTransaction.wompiTransactionId,
        };
      } catch (error) {
        throw error;
      }
    }
    @ApiResponse({ 
        status: 200, 
        description: 'Transacción eliminada exitosamente' 
      })
    @ApiResponse({ 
        status: 404, 
        description: 'Transacción no encontrada' 
      })
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
      try {
        return this.transactionService.delete(id);
      } catch (error) {
        throw error;
      }
    }
   
  @Post('process-payment')
  @ApiResponse({ 
    status: 200, 
    description: 'Pago procesado exitosamente' 
  })
  @ApiResponse({ 
    status: 422, 
    description: 'Error en los datos de pago (Wompi)' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos' 
  })
  async processPayment(@Body() dto: PayWithCardDto): Promise<Transaction> {
    try {
      console.log("dto request",dto);
      return await this.transactionService.processPayment(dto);
    } catch (error) {
      // El filtro global manejará este error
      throw error;
    }
  
  }
   
  @Post('create-card-token')
  @ApiResponse({ 
    status: 200, 
    description: 'Token creado exitosamente' 
  })
  @ApiResponse({ 
    status: 422, 
    description: 'Error al crear el token (Wompi)' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos' 
  })
  async createCardToken(@Body() dto: CreateCardDto): Promise<ResponseToken> {
    try {
      const token = await this.transactionService.createCardToken(dto);
      return { token };
    } catch (error) {
     
    }
  }
  @Post('webhook')
  @ApiResponse({ 
    status: 200, 
    description: 'Webhook procesado exitosamente' 
  })
  @ApiResponse({ 
    status: 422, 
    description: 'Error en los datos del webhook (Wompi)' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos' 
  })
  async webhook(@Body() dto: WebHookDto): Promise<WebHookDto> {
    try {
      await this.transactionService.webHook(dto);
      return dto;
    } catch (error) {
      // El filtro global manejará este error
      throw error;
    }
  }


}
