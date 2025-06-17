import { Controller, Post, Get, Put, Delete, Body, Param, BadRequestException, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common';
import { TransactionService } from '../../application/transaction.service';

import { CreateTransaction } from '../../application/dto/create-transaction';
import { Transaction } from '../../domain/entities/transaction';
import { ResponseTransaction } from '../../application/dto/response-transaction';
import { PayWithCardDto } from '../../application/dto/pay-with-card.dto';
import { CreateCardDto } from '../../application/dto/create-card';
import { ResponseToken } from '../../application/dto/response-token';

@Controller('transactions')
export class InfrastructureController {
    constructor(
        private readonly transactionService: TransactionService,
    ) { }
    @Post()
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
    async update(@Param('id') id: string, @Body() transaction: Transaction): Promise<ResponseTransaction> {
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
    }
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.transactionService.delete(id);
    }
   
  @Post('process-payment')
  async processPayment(@Body() dto: PayWithCardDto): Promise<Transaction> {
    try {
      return await this.transactionService.processPayment(dto);
    } catch (error) {
      console.error('Error processing payment:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data || null,
      });

      if (error.response?.status === 422) {
        const wompiError = error.response.data?.error || {};
        throw new HttpException(
          {
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'Error en los datos de pago',
            details: this.parseWompiError(wompiError),
          },
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }

      throw new HttpException(
        {
          statusCode: error.status || HttpStatus.BAD_REQUEST,
          message: error.message || 'Error procesando el pago',
          details: error.details || null,
        },
        error.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('create-card-token')
  async createCardToken(@Body() dto: CreateCardDto): Promise<ResponseToken> {
    try {
      const token = await this.transactionService.createCardToken(dto);
      return { token };
    } catch (error) {
      console.error('Error creating card token:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data || null,
      });

      if (error.response?.status === 400) {
        const cardError = error.response.data?.error || {};
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Error en los datos de la tarjeta',
            details: this.parseCardError(cardError),
          },
          HttpStatus.BAD_REQUEST
        );
      }

      throw new HttpException(
        {
          statusCode: error.status || HttpStatus.BAD_REQUEST,
          message: error.message || 'Error creando token de tarjeta',
          details: error.details || null,
        },
        error.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  private parseWompiError(wompiError: any): any {
    if (!wompiError) return null;
    
    return {
      type: wompiError.type || 'unknown',
      messages: Array.isArray(wompiError.messages) 
        ? wompiError.messages 
        : [wompiError.message || 'Error desconocido'],
      fields: wompiError.fields || null,
    };
  }

  private parseCardError(cardError: any): any {
    if (!cardError) return null;
    
    return {
      reason: cardError.reason || 'invalid_card',
      messages: cardError.messages || ['Datos de tarjeta inválidos'],
      field: cardError.field || null,
    };
  }

}
