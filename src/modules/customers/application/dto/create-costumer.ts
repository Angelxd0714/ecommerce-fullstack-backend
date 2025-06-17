import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCostumerDto {
    @IsNumber()
    @IsOptional()
    identity?: number;
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsString()
    @IsNotEmpty()
    phone: string;
}
