import { IsUUID, IsNumber, Min } from 'class-validator';

export class UpdateStockDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}
