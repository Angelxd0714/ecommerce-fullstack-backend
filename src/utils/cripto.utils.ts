import { createHash } from 'crypto';

export function generateWompiIntegrityHash(
  reference: string,
  amountInCents: number,
  currency: string,
  integritySecret: string
): string {
  const dataToHash = `${reference}${amountInCents}${currency}${integritySecret}`;
  
  return createHash('sha256')
    .update(dataToHash)
    .digest('hex');
}