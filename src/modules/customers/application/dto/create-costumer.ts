import { IsEmail, IsString } from "class-validator";
import { IsNotEmpty } from "class-validator";

export class CreateCostumerDto {
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
