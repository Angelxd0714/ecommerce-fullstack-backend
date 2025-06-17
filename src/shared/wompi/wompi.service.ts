import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { CreateCardDto } from 'src/modules/transactions/application/dto/create-card';
import { generateWompiIntegrityHash } from 'src/utils/cripto.utils';

@Injectable()
export class WompiService {
  
  
  async createCardToken(card: CreateCardDto): Promise<string> {
    console.log(card);
    const url = `${process.env.WOMPI_API_URL}/tokens/cards`;

    const payload = {
      number: card.number,
      exp_month: card.exp_month,
      exp_year: card.exp_year,
      cvc: card.cvc,
      card_holder: card.card_holder,
    };

    const headers = {
      Authorization: `Bearer ${process.env.WOMPI_PUBLIC_KEY}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await firstValueFrom(
        this.http.post(url, payload, { headers }),
      );

      return response.data.data.id;
    } catch (error) {
      console.error('Error creating card token', error);
      throw error;
    }
  }

  constructor(private readonly http: HttpService) {}
  
  async createTransaction({
    amountInCents,
    currency,
    reference,
    cardToken,
    customerEmail,
    customerName,
    installments,
    acceptanceToken,
  }: {
    amountInCents: number;
    currency: string;
    reference: string;
    cardToken: string;
    customerEmail: string;
    customerName: string;
    installments?: number;
    acceptanceToken: any;
  }): Promise<any> {
    const url = `${process.env.WOMPI_API_URL}/transactions`;

    const payload = {
      amount_in_cents: amountInCents,
      currency,
      customer_email: customerEmail,
      customer_name: customerName,
      reference,
      acceptance_token: String(acceptanceToken),
      signature:generateWompiIntegrityHash(reference, amountInCents, currency, process.env.WOMPI_INTEGRATION_SECRET),
      payment_method: {
        type: 'CARD',
        token: cardToken,
        installments,
      },
    };
    console.log(payload);
    try {
      const response = await firstValueFrom(
        this.http.post(url, payload, {
          headers: {
            Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}`,
          },
        }),
      );

      return response.data.data;
    } catch (error) {
      const errorDetails = error.response?.data?.error?.messages;
      console.error(
        'Error detallado de Wompi:',
        JSON.stringify(errorDetails, null, 2),
      );

      throw new Error(
        `Error en payment_method: ${JSON.stringify(errorDetails?.payment_method?.messages)}`,
      );
    }
  }
}
