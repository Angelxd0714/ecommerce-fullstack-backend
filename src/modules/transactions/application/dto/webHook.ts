import { ApiProperty } from "@nestjs/swagger";

export class WebHookDto {
    @ApiProperty({description:"Id de la transacción",example:"123"})
    wompiTransactionId: string;
    @ApiProperty({description:"Estado de la transacción",example:"paid"})
    status: string;
    
}
