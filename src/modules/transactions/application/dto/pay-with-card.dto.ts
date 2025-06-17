import { CreateCostumerDto } from "src/modules/customers/application/dto/create-costumer";
import { CreateDelivery } from "src/modules/deliveries/application/dto/create-delivery";
import { IsNumber, IsNotEmpty } from "class-validator";
import { CreateCardDto } from "./create-card";

export class PayWithCardDto {
  products: Array<{
    productId: string;
    quantity: number;
  }>;
    @IsNotEmpty()
    customerIdentity: CreateCostumerDto ;
    installments?: number;
    @IsNotEmpty()
    cardToken: string;
    @IsNotEmpty()
    acceptanceToken: string;
    
   
    
  }
  