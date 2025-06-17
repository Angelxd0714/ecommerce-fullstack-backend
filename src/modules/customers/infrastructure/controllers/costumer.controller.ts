import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpCode,
  BadRequestException,
  Patch,
} from '@nestjs/common';
import { CostumerService } from '../../application/costumer.service';
import { CreateCostumerDto } from '../../application/dto/create-costumer';
import { ResponseCostumerDto } from '../../application/dto/reponse-costumer';
import { Costumer } from '../../domain/entities/costumers';

@Controller('customers')
export class InfrastructureController {
  constructor(private readonly costumerService: CostumerService) {}
  @Post('')
  @UsePipes(new ValidationPipe({ transform: true }))
  
  @HttpCode(201)
  async createCostumer(
    @Body() costumer: CreateCostumerDto,
  ): Promise<ResponseCostumerDto> {
    try {
      const costumerCreated = new Costumer();
      costumerCreated.name = costumer.name;
      costumerCreated.identity = costumer.identity;
      costumerCreated.email = costumer.email;
      costumerCreated.phone = costumer.phone;
      const createdCostumer = await this.costumerService.create(
        costumerCreated,
      );
      return {
        id: createdCostumer.id,
        identity: createdCostumer.identity,
        name: createdCostumer.name,
        email: createdCostumer.email,
        phone: createdCostumer.phone,
        createdAt: createdCostumer.createdAt,
        updatedAt: createdCostumer.updatedAt,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
     
  }
  @Get('')
  @HttpCode(200)
  async findAllCostumers(): Promise<ResponseCostumerDto[]> {
    const costumers = await this.costumerService.findAll();
    if (!costumers) {
      throw new BadRequestException('No costumers found');
    }
    return costumers.map((costumer) => ({
      id: costumer.id,
      identity: costumer.identity,
      name: costumer.name,
      email: costumer.email,
      phone: costumer.phone,
      createdAt: costumer.createdAt,
      updatedAt: costumer.updatedAt,
    }));
  }
  @Get('/:identity')
  @HttpCode(200)
  async findCostumerByIdentity(
    @Param('identity') identity: number,
  ): Promise<ResponseCostumerDto> {
    const costumer = await this.costumerService.findByIdentity(identity);
    if (!costumer) {
      throw new BadRequestException('No costumer found');
    }
    return {
      id: costumer.id,
      identity: costumer.identity,
      name: costumer.name,
      email: costumer.email,
        phone: costumer.phone,
        createdAt: costumer.createdAt,
        updatedAt: costumer.updatedAt,
      };
  }
  @Patch('')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(200)
  async updateCostumer(
    @Param('identity') identity: number,
    @Body() costumer: CreateCostumerDto,
  ): Promise<ResponseCostumerDto> {
    const costumerUpdated = new Costumer();
    costumerUpdated.name = costumer.name;
    costumerUpdated.email = costumer.email;
    costumerUpdated.phone = costumer.phone;
    const updatedCostumer = await this.costumerService.update(identity, costumerUpdated);
    if (!updatedCostumer) {
      throw new BadRequestException('No costumer found');
    }
    return {
      id: updatedCostumer.id,
      identity: updatedCostumer.identity,
      name: updatedCostumer.name,
      email: updatedCostumer.email,
        phone: costumer.phone,
        createdAt: updatedCostumer.createdAt,
        updatedAt: updatedCostumer.updatedAt,
      };

    
  }
  @Delete('/:identity')
  @HttpCode(204)
  
  async deleteCostumer(@Param('identity') identity: number): Promise<{ message: string }> {
    try {
      await this.costumerService.delete(identity);
      return { message: 'Costumer deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
