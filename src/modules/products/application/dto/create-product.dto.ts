import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
 
  @IsString()
  @ApiProperty({description:"Nombre del producto",example:"Producto 1"})  
  name: string;

  @IsString()
  @ApiProperty({description:"Descripción del producto",example:"Descripción del producto"})
  description: string;

  @IsNumber()
  @Min(0)
  @ApiProperty({description:"Precio del producto",example:"123"})
  price: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({description:"Stock del producto",example:"123"})
  stock: number;
}
