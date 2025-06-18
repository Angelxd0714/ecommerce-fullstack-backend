import { IsUUID, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStockDto {
  @IsUUID()
  @ApiProperty({description:"Id del producto",example:"123"})
  productId: string;

  @IsNumber()
  @Min(1)
  @ApiProperty({description:"Cantidad",example:"123"})
  quantity: number;
}
