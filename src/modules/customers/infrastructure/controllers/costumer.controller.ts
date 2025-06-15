import { Controller, Post, Body, Get, Param, Put, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { CostumerService } from '../../application/costumer.service';
import { CreateCostumerDto } from '../../application/dto/create-costumer';
import { ResponseCostumerDto } from '../../application/dto/reponse-costumer';
import { Costumer } from '../../domain/entities/costumers';

@Controller('customers/')
export class InfrastructureController {
    constructor(
        private readonly costumerService: CostumerService,
    ) { }
    @Post('')
    @UsePipes(new ValidationPipe({ transform: true }))
    async createCostumer(@Body() costumer: CreateCostumerDto): Promise<ResponseCostumerDto> {
        const costumerCreated = new Costumer();
        costumerCreated.name = costumer.name;
        costumerCreated.email = costumer.email;
        costumerCreated.phone = costumer.phone;
        const createdCostumer = await this.costumerService.create(costumerCreated);
        return createdCostumer;
    }
    @Get('')
    async findAllCostumers(): Promise<ResponseCostumerDto[]> {
        return this.costumerService.findAll();
    }
    @Get('/:id')
    async findCostumerById(@Param('id') id: string): Promise<ResponseCostumerDto> {
        return this.costumerService.findById(id);
    }
    @Put('/:id')
    @UsePipes(new ValidationPipe({ transform: true }))
    async updateCostumer(@Param('id') id: string, @Body() costumer: CreateCostumerDto): Promise<ResponseCostumerDto> {
        const costumerUpdated = new Costumer();
        costumerUpdated.name = costumer.name;
        costumerUpdated.email = costumer.email;
        costumerUpdated.phone = costumer.phone;
        return this.costumerService.update(id, costumerUpdated);
    }
    @Delete('/:id')
    async deleteCostumer(@Param('id') id: string): Promise<void> {
        return this.costumerService.delete(id);
    }
}