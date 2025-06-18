import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { CreateCardDto } from 'src/modules/transactions/application/dto/create-card';
import { generateWompiIntegrityHash } from 'src/utils/cripto.utils';

@Injectable()
export class WompiService {
  private readonly logger = new Logger(WompiService.name);
  private readonly baseUrl = process.env.WOMPI_API_URL;
  private readonly publicKey = process.env.WOMPI_PUBLIC_KEY;
  private readonly privateKey = process.env.WOMPI_PRIVATE_KEY;
  private readonly integrationSecret = process.env.WOMPI_INTEGRATION_SECRET;

  constructor(private readonly http: HttpService) {}

  private validateEnvironment() {
    if (!this.baseUrl || !this.publicKey || !this.privateKey || !this.integrationSecret) {
      throw new Error('Faltan variables de entorno requeridas para Wompi');
    }
  }

  private getAuthHeaders(usePrivateKey: boolean = false) {
    return {
      'Authorization': `Bearer ${usePrivateKey ? this.privateKey : this.publicKey}`,
      'Content-Type': 'application/json',
    };
  }

  

  async createTransaction({
    amountInCents,
    currency,
    reference,
    cardToken,
    customerEmail,
    customerName,
    installments = 1,
    acceptanceToken,
  }: {
    amountInCents: number;
    currency: string;
    reference: string;
    cardToken: string;
    customerEmail: string;
    customerName: string;
    installments?: number;
    acceptanceToken: string;
  }): Promise<any> {
    this.validateEnvironment();
    const url = `${this.baseUrl}/transactions`;

    this.logger.log(`Creando transacción para ${customerEmail}, referencia: ${reference}`);

    const payload = {
      amount_in_cents: amountInCents,
      currency,
      customer_email: customerEmail,
      customer_name: customerName,
      reference,
      acceptance_token: acceptanceToken,
      signature: generateWompiIntegrityHash(
        reference, 
        amountInCents, 
        currency, 
        this.integrationSecret
      ),
      payment_method: {
        type: 'CARD',
        token: cardToken,
        installments,
      },
    };

    try {
      const response = await firstValueFrom(
        this.http.post(url, payload, {
          headers: {
            'Authorization': `Bearer ${this.privateKey}`,
            'Content-Type': 'application/json',
          },
        })
      );

      if (!response.data.data) {
        throw new Error('Respuesta de Wompi no contiene datos de transacción');
      }

      return response.data.data;
    } catch (error) {
      this.logger.error('Error creando transacción', error.response?.data || error.message);
      throw this.parseWompiError(error);
    }
  }

  async getTransactionById(wompiTransactionId: string): Promise<any> {
    this.validateEnvironment();
    const url = `${this.baseUrl}/transactions/${wompiTransactionId}`;

    this.logger.log(`Consultando transacción: ${wompiTransactionId}`);

    try {
      const response = await firstValueFrom(
        this.http.get(url, {
          headers: this.getAuthHeaders(true),
        })
      );

      if (!response.data.data) {
        throw new Error('Respuesta de Wompi no contiene datos de transacción');
      }

      return response.data.data;
    } catch (error) {
      this.logger.error('Error consultando transacción', error.response?.data || error.message);
      throw this.parseWompiError(error);
    }
  }

  private parseWompiError(error: any): Error {
    const wompiError = error.response?.data?.error;
    
    if (wompiError) {
      let message = `Wompi Error [${wompiError.type}]: ${wompiError.reason}`;
      
      if (wompiError.messages) {
        message += ` - Detalles: ${JSON.stringify(wompiError.messages)}`;
      }
      
      return new Error(message);
    }

    return new Error(error.message || 'Error desconocido al comunicarse con Wompi');
  }
}