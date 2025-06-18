
import { ApiProperty } from "@nestjs/swagger";

export class CreateTransaction {
    @ApiProperty({description:"Id de la transacción",example:"123"})
    transactionId?: string;
    @ApiProperty({description:"Monto de la transacción",example:"123"})
    amount?: number;
    @ApiProperty({description:"Moneda de la transacción",example:"COP"})
    currency?: string;
    @ApiProperty({description:"Fecha de creación de la transacción",example:"2025-06-18T00:00:00.000Z"})
    createdAt?: Date;
    @ApiProperty({description:"Fecha de actualización de la transacción",example:"2025-06-18T00:00:00.000Z"})
    updatedAt?: Date;
    @ApiProperty({description:"Id del producto",example:"123"})
    productId?: string;
    @ApiProperty({description:"Id del cliente",example:"123"})
    customerId?: string;
    @ApiProperty({description:"Id de la transacción de Wompi",example:"123"})
    wompiTransactionId?: string;
    @ApiProperty({description:"Referencia de la transacción",example:"123"})
    reference?: string;
}
