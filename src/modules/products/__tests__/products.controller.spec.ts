import { Test, TestingModule } from '@nestjs/testing';
import { InfrastructureController } from '../infrastructure/controllers/product.controller';
import { ProductService } from '../application/product.service';
import { ProductResponseDto } from '../application/dto/product-response.dto';

describe('productController', () => {
  let controller: InfrastructureController;
  let mockProductService: jest.Mocked<ProductService>;

  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 100,
    stock: 10,
    category: 'electronics',
    createdAt: new Date(),
    updatedAt: new Date(),
    description: 'Test Product',
    image: 'test.jpg',
  };

  const mockProductDto = new ProductResponseDto(mockProduct);

  beforeEach(async () => {
    mockProductService = {
      findAll: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<ProductService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfrastructureController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<InfrastructureController>(InfrastructureController);
  });

  describe('GET /products', () => {
    it('should return an array of products', async () => {
      mockProductService.findAll.mockResolvedValue([mockProduct]);

      const result = await controller.findAll();

      expect(result).toEqual([mockProductDto]);
      expect(mockProductService.findAll).toHaveBeenCalled();
    });

    it('should throw error when service fails', async () => {
      mockProductService.findAll.mockRejectedValue(new Error('Service error'));

      await expect(controller.findAll()).rejects.toThrow('Service error');
    });
  });

  describe('GET /products/:id', () => {
    it('should return a single product', async () => {
      mockProductService.findById.mockResolvedValue(mockProduct);

      const result = await controller.findById('1');

      expect(result).toEqual(mockProductDto);
      expect(mockProductService.findById).toHaveBeenCalledWith('1');
    });

    it('should throw error when product not found', async () => {
      mockProductService.findById.mockResolvedValue(null);

      await expect(controller.findById('999')).rejects.toThrow();
    });
  });
});