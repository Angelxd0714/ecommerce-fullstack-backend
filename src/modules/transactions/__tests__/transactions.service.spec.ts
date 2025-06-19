import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from '../application/transaction.service';
import { TransactionRepositoryPort } from '../domain/ports/transaction.repository';
import { DeliveryService } from '../../deliveries/application/delivery.service';
import { DataSource } from 'typeorm';
import { Transaction } from '../domain/entities/transaction';
import { Product } from '../../products/domain/entities/product.entity';
import { Costumer } from '../../customers/domain/entities/costumers';
import { Delivery } from '../../deliveries/domain/entities/delivery';
import { PayWithCardDto } from '../application/dto/pay-with-card.dto';
import { BadRequestException } from '@nestjs/common';
import { WompiService } from '../../../shared/wompi/wompi.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let mockTransactionRepository: jest.Mocked<TransactionRepositoryPort>;
  let mockWompiService: jest.Mocked<WompiService>;
  let mockDeliveryService: jest.Mocked<DeliveryService>;
  let mockDataSource: jest.Mocked<DataSource>;
 
  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 100,
    stock: 10,
    category: 'electronics',
    description: 'Test description',
    image: 'test-image.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCustomer: Costumer = {
    id: '1',
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '1234567890',
    identity: 123456789,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTransaction: Transaction = {
    id: 'txn-123',
    status: 'APPROVED',
    amount: 100,
    currency: 'COP',
    reference: 'order-123',
    customerId: '1',
    wompiTransactionId: 'wompi-123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockDelivery: Delivery = {
    id: 'del-123',
    transactionId: 'txn-123',
    address: '123 Main St',
    city: 'Test City',
    postalCode: '12345',
    delivered: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const payWithCardDto: PayWithCardDto = {
    products: [
      { productId: '1', quantity: 2 }
    ],
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

  beforeEach(async () => {
    mockTransactionRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findOneBy: jest.fn(),
    } as unknown as jest.Mocked<TransactionRepositoryPort>;

    mockWompiService = {
      createTransaction: jest.fn(),
      getTransactionById: jest.fn(),
    } as unknown as jest.Mocked<WompiService>;

    mockDeliveryService = {
    } as unknown as jest.Mocked<DeliveryService>;

    mockDataSource = {
      transaction: jest.fn().mockImplementation((callback) => {
        return callback({
          findOne: jest.fn().mockImplementation((entity, options) => {
            if (entity === Product) {
              return Promise.resolve(mockProduct);
            }
            return Promise.resolve(null);
          }),
          save: jest.fn().mockImplementation((entity) => {
            if (entity instanceof Transaction) {
              return Promise.resolve(mockTransaction);
            }
            if (entity instanceof Costumer) {
              return Promise.resolve(mockCustomer);
            }
            if (entity instanceof Delivery) {
              return Promise.resolve(mockDelivery);
            }
            if (Array.isArray(entity)) {
              return Promise.resolve(entity.map(e => ({ ...e })));
            }
            return Promise.resolve({ ...entity });
          }),
          create: jest.fn().mockImplementation((entity, data) => {
            if (entity === Transaction) {
              return { ...mockTransaction, ...data };
            }
            if (entity === Delivery) {
              return { ...mockDelivery, ...data };
            }
            if (entity === Costumer) {
              return { ...mockCustomer, ...data };
            }
            return { ...data };
          }),
        });
      }),
    } as unknown as jest.Mocked<DataSource>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: 'TransactionRepositoryPort',
          useValue: mockTransactionRepository,
        },
        {
          provide: 'WompiService',
          useValue: mockWompiService,
        },
        {
          provide: DeliveryService,
          useValue: mockDeliveryService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  describe('processPayment', () => {
    it('should process payment successfully', async () => {
      mockWompiService.createTransaction.mockResolvedValue({
        id: 'wompi-123',
        status: 'PENDING',
      });

      const result = await service.processPayment(payWithCardDto);

      expect(result).toEqual(expect.objectContaining({
        status: 'APPROVED',
        wompiTransactionId: 'wompi-123',
      }));
      expect(mockWompiService.createTransaction).toHaveBeenCalled();
    });

    it('should throw BadRequestException when stock is insufficient', async () => {
      const dtoWithLargeQuantity = {
        ...payWithCardDto,
        products: [{ productId: '1', quantity: 100 }]
      };

      await expect(service.processPayment(dtoWithLargeQuantity))
        .rejects.toThrow(BadRequestException);
    });

    it('should mark transaction as DECLINED when Wompi fails', async () => {
      mockWompiService.createTransaction.mockResolvedValue({
        id: 'wompi-123',
        status: 'DECLINED',
      });

      const result = await service.processPayment(payWithCardDto);

      expect(result.status).toBe('DECLINED');
    });
  });

  describe('webHook', () => {
    it('should update transaction status from webhook', async () => {
      const webHookDto = {
        wompiTransactionId: 'wompi-123',
        status: 'APPROVED',
      };

      mockWompiService.getTransactionById.mockResolvedValue({
        id: 'wompi-123',
        status: 'APPROVED',
      });

      mockTransactionRepository.findOneBy.mockResolvedValue(mockTransaction);
      mockTransactionRepository.update.mockResolvedValue({
        ...mockTransaction,
        status: 'APPROVED',
      });

      await service.webHook(webHookDto);

      expect(mockTransactionRepository.update).toHaveBeenCalledWith(
        'txn-123',
        expect.objectContaining({
          status: 'APPROVED',
        })
      );
    });

    it('should throw error when transaction not found', async () => {
      const webHookDto = {
        wompiTransactionId: 'wompi-999',
        status: 'APPROVED',
      };

      mockWompiService.getTransactionById.mockResolvedValue(null);

      await expect(service.webHook(webHookDto))
        .rejects.toThrow('Transaction from Wompi not found');
    });
  });

  // Pruebas para los métodos básicos
  describe('basic CRUD operations', () => {
    it('should find all transactions', async () => {
      mockTransactionRepository.findAll.mockResolvedValue([mockTransaction]);

      const result = await service.findAll();

      expect(result).toEqual([mockTransaction]);
    });

    it('should find transaction by id', async () => {
      mockTransactionRepository.findById.mockResolvedValue(mockTransaction);

      const result = await service.findById('txn-123');

      expect(result).toEqual(mockTransaction);
    });

    it('should create a transaction', async () => {
      mockTransactionRepository.create.mockResolvedValue(mockTransaction);

      const result = await service.create(mockTransaction);

      expect(result).toEqual(mockTransaction);
    });

    it('should update a transaction', async () => {
      mockTransactionRepository.update.mockResolvedValue(mockTransaction);

      const result = await service.update('txn-123', mockTransaction);

      expect(result).toEqual(mockTransaction);
    });

    it('should delete a transaction', async () => {
      mockTransactionRepository.findById.mockResolvedValue(mockTransaction);
      mockTransactionRepository.delete.mockResolvedValue(undefined);

      await expect(service.delete('txn-123')).resolves.not.toThrow();
    });
  });
});