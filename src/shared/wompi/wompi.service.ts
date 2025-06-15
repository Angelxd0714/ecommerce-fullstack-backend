import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WompiService {
  constructor(private readonly http: HttpService) {}

  async createTransaction({
    amountInCents,
    currency,
    reference,
    cardToken,
    customerEmail,
  }: {
    amountInCents: number;
    currency: string;
    reference: string;
    cardToken: string;
    customerEmail: string;
  }): Promise<any> {
    const url = `${process.env.WOMPI_API_URL}/transactions`;

    const payload = {
      amount_in_cents: amountInCents,
      currency,
      customer_email: customerEmail,
      payment_method: {
        type: 'CARD',
        token: cardToken,
      },
      reference,
    };

   

    const response = await firstValueFrom(
        this.http.post(
          url,
          payload,
          {
            headers: {
              Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}`
            }
          }
        )
      );

    return response.data;
  }
}
