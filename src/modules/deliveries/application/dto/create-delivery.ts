import { IsBoolean, IsString } from "class-validator";

export class CreateDelivery {
  @IsString()
  transactionId: string;
  @IsString()
  address: string;
  @IsString()
  city: string;
  @IsString()
  postalCode: string;
  @IsBoolean()
  delivered: boolean;
  createdAt: Date;
  updatedAt: Date;
}
