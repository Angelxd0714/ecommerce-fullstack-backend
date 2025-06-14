import { AwsS3Service } from 'src/shared/aws/s3/aws-s3.service';
import { Product } from '../modules/products/domain/entities/product.entity';
import { DataSource } from 'typeorm';

export const seedProducts = async (
  dataSource: DataSource,
  s3Service: AwsS3Service,
) => {
  const repo = dataSource.getRepository(Product);
  const count = await repo.count();
  if (count > 0) {
    console.log('📦 Ya existen productos, semilla omitida.');
    return;
  }

  const imageKeys = await s3Service.getAllFiles(); // nombres como camisa.jpg, zapatos.jpg...

  const products: Product[] = imageKeys.slice(0, 15).map((key, index) => {
    const names = ['celular', 'zapatillas', 'vans', 'bolso', 'lentes', 'bolso de mano', 'celular de gama baja', 'reloj de mano', 'zapatos deportivos', 'laptop', 'camara canon', 'camara canon 5D', 'audifonos', 'lentes light', 'macbook laptop'];
    const capitalizedName = names[index].charAt(0).toUpperCase() + names[index].slice(1);
    const categories = ['electronica', 'ropa', 'ropa', 'ropa', 'accesorios', 'accesorios', 'electronica', 'accesorios', 'ropa', 'electronica', 'electronica', 'electronica', 'electronica', 'electronica', 'electronica'];
    const price = 19.99 + index * 5;
    const stock = 10 + index;
    const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    const description = `${capitalizedName} de alta calidad`;
    const product = new Product()
    product.name = capitalizedName;
    product.price = price;
    product.stock = stock;
    product.image = imageUrl;
    product.description = description;
    product.category = categories[index];
    return product;
  });

  await repo.save(products);
 
};
