import { ApiProperty } from "@nestjs/swagger";

export class CreateCardDto {
    @ApiProperty({description:"Número de la tarjeta",example:"4111111111111111"})
    number: string;
    @ApiProperty({description:"Mes de expiración",example:"12"})
    exp_month: string;
    @ApiProperty({description:"Año de expiración",example:"2025"})
    exp_year: string;
    @ApiProperty({description:"Código de seguridad",example:"123"})
    cvc: string;
    @ApiProperty({description:"Nombre del titular",example:"John Doe"})
    card_holder: string;
}