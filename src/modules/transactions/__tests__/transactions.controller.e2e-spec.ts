import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TransactionService } from '../application/transaction.service';
import { TransactionsModule } from '../transactions.module';

describe('TransactionController (e2e)', () => {
    let app: INestApplication;
    let transactionService: TransactionService;

    const mockTransaction = {
        id: '1',
        amount: 100,
        currency: 'COP',
        status: 'APPROVED' as const,
        customerId: 'cust-123',
        wompiTransactionId: 'wompi-123',
        reference: 'order-123',
        createdAt: new Date(),
        updatedAt: new Date(),
        
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [TransactionsModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        transactionService = moduleFixture.get<TransactionService>(TransactionService);
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GET /transactions/:id', () => {
        it('should return a transaction by ID', async () => {
            jest.spyOn(transactionService, 'findById').mockResolvedValue(mockTransaction);

            const response = await request(app.getHttpServer())
                .get('/transactions/1')
                .expect(200);

            expect(response.body).toEqual({
                ...mockTransaction,
                createdAt: mockTransaction.createdAt.toISOString(),
                updatedAt: mockTransaction.updatedAt.toISOString(),
            });
        });

        it('should return 404 if transaction not found', async () => {
            jest.spyOn(transactionService, 'findById').mockResolvedValue(null);

            await request(app.getHttpServer())
                .get('/transactions/999')
                .expect(404);
        });
    });

    describe('POST /transactions', () => {
        it('should create a new transaction', async () => {
            const createDto = {
                amount: 100,
                currency: 'COP',
                customerId: 'cust-123',
                reference: 'order-123'
            };

            jest.spyOn(transactionService, 'create').mockResolvedValue(mockTransaction);

            const response = await request(app.getHttpServer())
                .post('/transactions')
                .send(createDto)
                .expect(201);

            expect(response.body).toEqual({
                ...mockTransaction,
                createdAt: mockTransaction.createdAt.toISOString(),
                updatedAt: mockTransaction.updatedAt.toISOString(),
            });
        });

        it('should return 400 for invalid input', async () => {
            const invalidDto = {
                amount: -100,  // Invalid amount
                currency: 'COP',
            };

            await request(app.getHttpServer())
                .post('/transactions')
                .send(invalidDto)
                .expect(400);
        });
    });

    describe('PATCH /transactions/:id/status', () => {
        it('should update transaction status', async () => {
            const updatedTransaction = {
                ...mockTransaction,
                status: 'DECLINED' as const
            };

            jest.spyOn(transactionService, 'update').mockResolvedValue(updatedTransaction);

            const response = await request(app.getHttpServer())
                .patch('/transactions/1/status')
                .send({ status: 'DECLINED' })
                .expect(200);

            expect(response.body.status).toBe('DECLINED');
        });
    });
});