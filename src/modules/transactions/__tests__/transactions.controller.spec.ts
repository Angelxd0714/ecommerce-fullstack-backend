import { Test, TestingModule } from '@nestjs/testing';
import { InfrastructureController } from '../infrastructure/controllers/transaction.controller';
import { TransactionService } from '../application/transaction.service';
import { CreateTransaction } from '../application/dto/create-transaction';
import { ResponseTransaction } from '../application/dto/response-transaction';
import { PayWithCardDto } from '../application/dto/pay-with-card.dto';
import { WebHookDto } from '../application/dto/webHook';
import { Transaction } from '../domain/entities/transaction';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('TransactionController', () => {
  let controller: InfrastructureController;
  let mockTransactionService: jest.Mocked<TransactionService>;

  const mockTransaction: Transaction = {
    id: 'txn-123',
    amount: 100,
    currency: 'COP',
    status: 'APPROVED',
    customerId: 'cust-123',
    wompiTransactionId: 'wompi-123',
    reference: 'order-123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockResponseTransaction: ResponseTransaction = {
    transactionId: 'txn-123',
    amount: 100,
    currency: 'COP',
    createdAt: mockTransaction.createdAt,
    updatedAt: mockTransaction.updatedAt,
    customerId: 'cust-123',
    wompiTransactionId: 'wompi-123',
    reference: 'order-123',
  };

  beforeEach(async () => {
    mockTransactionService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      processPayment: jest.fn(),
      webHook: jest.fn(),
    } as unknown as jest.Mocked<TransactionService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfrastructureController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    controller = module.get<InfrastructureController>(InfrastructureController);
  });

  describe('POST /transactions', () => {
    it('should create a transaction', async () => {
      const createDto: CreateTransaction = {
        amount: 100,
        currency: 'COP',
        customerId: 'cust-123',
        wompiTransactionId: 'wompi-123',
        reference: 'order-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTransactionService.create.mockResolvedValue(mockTransaction);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockTransaction);
      expect(mockTransactionService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: createDto.amount,
          currency: createDto.currency,
          customerId: createDto.customerId,
        })
      );
    });
  });

  describe('GET /transactions', () => {
    it('should return an array of transactions', async () => {
      mockTransactionService.findAll.mockResolvedValue([mockTransaction]);

      const result = await controller.findAll();

      expect(result).toEqual([mockResponseTransaction]);
      expect(mockTransactionService.findAll).toHaveBeenCalled();
    });

    it('should throw error when no transactions found', async () => {
      mockTransactionService.findAll.mockResolvedValue([]);

      await expect(controller.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('GET /transactions/:id', () => {
    it('should return a transaction by id', async () => {
      mockTransactionService.findById.mockResolvedValue(mockTransaction);

      const result = await controller.findById('txn-123');

      expect(result).toEqual(mockResponseTransaction);
      expect(mockTransactionService.findById).toHaveBeenCalledWith('txn-123');
    });

    it('should throw error when transaction not found', async () => {
      mockTransactionService.findById.mockResolvedValue(null);

      await expect(controller.findById('txn-999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('PUT /transactions/:id', () => {
    it('should update a transaction', async () => {
      const updateData = { ...mockTransaction, amount: 200 };
      mockTransactionService.update.mockResolvedValue(updateData);

      const result = await controller.update('txn-123', updateData);

      expect(result).toEqual({
        ...mockResponseTransaction,
        amount: 200,
      });
      expect(mockTransactionService.update).toHaveBeenCalledWith('txn-123', updateData);
    });
  });

  describe('DELETE /transactions/:id', () => {
    it('should delete a transaction', async () => {
      mockTransactionService.delete.mockResolvedValue(undefined);

      await expect(controller.delete('txn-123')).resolves.not.toThrow();
      expect(mockTransactionService.delete).toHaveBeenCalledWith('txn-123');
    });
  });

  describe('POST /transactions/process-payment', () => {
    it('should process payment successfully', async () => {
      const payWithCardDto: PayWithCardDto = {
        products: [{ productId: '1', quantity: 2 }],
        customerIdentity: {
          name: 'Test Customer',
          email: 'test@example.com',
          phone: '1234567890',
          identity: 123456789,
        },
        cardToken: 'token-123',
        installments: 1,
        acceptanceToken: 'accept-123',
        delivery: {
          address: '123 Main St',
          city: 'Test City',
          postalCode: '12345',
        },
      };

      mockTransactionService.processPayment.mockResolvedValue(mockTransaction);

      const result = await controller.processPayment(payWithCardDto);

      expect(result).toEqual(mockTransaction);
      expect(mockTransactionService.processPayment).toHaveBeenCalledWith(payWithCardDto);
    });

    it('should throw error for invalid payment data', async () => {
      const invalidDto = {} as PayWithCardDto;
      mockTransactionService.processPayment.mockRejectedValue(new BadRequestException());

      await expect(controller.processPayment(invalidDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('POST /transactions/webhook', () => {
    it('should process webhook successfully', async () => {
      const webHookDto: WebHookDto = {
        wompiTransactionId: 'wompi-123',
        status: 'APPROVED',
      };

      mockTransactionService.webHook.mockResolvedValue(undefined);

      const result = await controller.webhook(webHookDto);

      expect(result).toEqual(webHookDto);
      expect(mockTransactionService.webHook).toHaveBeenCalledWith(webHookDto);
    });
  });
});