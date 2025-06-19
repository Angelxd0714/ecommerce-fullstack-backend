import { CreateCostumerDto } from "../../../customers/application/dto/create-costumer";
import { CreateDelivery } from "../../../deliveries/application/dto/create-delivery";
import { ApiProperty } from "@nestjs/swagger";

export class PayWithCardDto {
  @ApiProperty({description:"Lista de productos",example:"[{productId: '123', quantity: 1}]"})
  products: Array<{
    productId: string;
    quantity: number;
  }>;
    @ApiProperty({description:"Datos del cliente",example:"{identity: '123', name: 'John Doe', email: 'john.doe@example.com', phone: '1234567890'}"})
    customerIdentity: CreateCostumerDto ;
    installments?: number;
    @ApiProperty({description:"Token de la tarjeta",example:"123"})
    cardToken: string;
    @ApiProperty({description:"Token de aceptación",example:"123"})
    acceptanceToken: string;
    @ApiProperty({description:"Datos de entrega",example:"{address: '123 Main St', city: 'Anytown', state: 'CA', zip: '12345'}"})
    delivery: CreateDelivery;
    
   
    
  }
  