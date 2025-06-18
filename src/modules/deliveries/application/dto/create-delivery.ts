import { IsBoolean, IsOptional, IsString } from "class-validator";
import { IsDate } from "class-validator";

export class CreateDelivery {
  @IsOptional()
  @IsString()
  transactionId?: string;
  @IsString()
  address: string;
  @IsString()
  city: string;
  @IsString()
  postalCode: string;
  @IsOptional()
  @IsBoolean()
  delivered?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
