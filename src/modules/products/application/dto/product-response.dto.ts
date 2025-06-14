export class ProductResponseDto {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
  
    constructor(partial: Partial<ProductResponseDto>) {
      Object.assign(this, partial);
    }
  }
  