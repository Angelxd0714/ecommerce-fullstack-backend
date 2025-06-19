import { Test, TestingModule } from '@nestjs/testing';
import { InfrastructureController } from '../infrastructure/controllers/costumer.controller';
import { CostumerService } from '../application/costumer.service';
import { CreateCostumerDto } from '../application/dto/create-costumer';
import { ResponseCostumerDto } from '../application/dto/reponse-costumer';
import { BadRequestException } from '@nestjs/common';

describe('InfrastructureController', () => {
  let controller: InfrastructureController;
  let mockCostumerService: jest.Mocked<CostumerService>;

  const mockCostumer: ResponseCostumerDto = {
    id: '1',
    identity: 123456789,
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '1234567890',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockCostumerService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByIdentity: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<CostumerService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfrastructureController],
      providers: [
        {
          provide: CostumerService,
          useValue: mockCostumerService,
        },
      ],
    }).compile();

    controller = module.get<InfrastructureController>(InfrastructureController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCostumer', () => {
    it('should create a new customer', async () => {
      const createDto: CreateCostumerDto = {
        name: 'Test Customer',
        identity: 123456789,
        email: 'test@example.com',
        phone: '1234567890',
      };
  
      mockCostumerService.create.mockResolvedValue({
        ...mockCostumer,
        ...createDto,
      });
  
      const result = await controller.createCostumer(createDto);
  
      expect(result).toEqual(mockCostumer);
      expect(mockCostumerService.create).toHaveBeenCalledWith(expect.objectContaining(createDto));
    });
  
    it('should throw BadRequestException when creation fails', async () => {
      const createDto: CreateCostumerDto = {
        name: 'Test Customer',
        identity: 123456789,
        email: 'test@example.com',
        phone: '1234567890',
      };
  
      mockCostumerService.create.mockRejectedValue(new Error('Creation failed'));
  
      await expect(controller.createCostumer(createDto)).rejects.toThrow(BadRequestException);
    });
  });
  describe('findAllCostumers', () => {
    it('should return all customers', async () => {
      const mockCostumers: ResponseCostumerDto[] = [
        mockCostumer,
        mockCostumer,
      ];
  
      mockCostumerService.findAll.mockResolvedValue(mockCostumers);
  
      const result = await controller.findAllCostumers();
  
      expect(result).toEqual(mockCostumers);
      expect(mockCostumerService.findAll).toHaveBeenCalled();
    });
  });
  describe('findCostumerByIdentity', () => {
    it('should return a customer by identity', async () => {
      const identity = 123456789;
  
      mockCostumerService.findByIdentity.mockResolvedValue(mockCostumer);
  
      const result = await controller.findCostumerByIdentity(identity);
  
      expect(result).toEqual(mockCostumer);
      expect(mockCostumerService.findByIdentity).toHaveBeenCalledWith(identity);
    });
  });
  describe('updateCostumer', () => {
    it('should update a customer', async () => {
      const identity = 123456789;
      const updateDto: CreateCostumerDto = {
        name: 'Updated Customer',
        identity: 123456789,
        email: 'updated@example.com',
        phone: '1234567890',
      };
  
      mockCostumerService.update.mockResolvedValue({
        ...mockCostumer,
        ...updateDto,
      });
  
      const result = await controller.updateCostumer(identity, updateDto);
      expect(result).toEqual({
        ...mockCostumer,
        ...updateDto,
      });
      expect(mockCostumerService.update).toHaveBeenCalledWith(identity, expect.objectContaining(updateDto));
    });
  });
  describe('deleteCostumer', () => {
    it('should delete a customer', async () => {
      const identity = 123456789;
  
      mockCostumerService.delete.mockResolvedValue(undefined);
  
      await controller.deleteCostumer(identity);
  
      expect(mockCostumerService.delete).toHaveBeenCalledWith(identity);
    });
  });

});