import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../application/product.service';
import { Product } from '../domain/entities/product.entity';

describe('ProductService', () => {
  let service: ProductService;
  const mockRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    reduceStock: jest.fn(),
  };

  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 100,
    stock: 10,
    description: 'Test Product',
    image: 'test.jpg',
    category: 'electronics',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  };

  beforeAll(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-01-01'));
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: 'ProductRepositoryPort',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('reduceStock', () => {
    it('should reduce stock for valid products', async () => {
      mockRepository.findById.mockResolvedValue({ ...mockProduct });
      mockRepository.reduceStock.mockResolvedValue(undefined);

      await service.reduceStock(['1', '2'], 2);

      expect(mockRepository.findById).toHaveBeenCalledTimes(2);
      expect(mockRepository.reduceStock).toHaveBeenCalledTimes(2);
    });
  });

  // Resto de tus pruebas...
});