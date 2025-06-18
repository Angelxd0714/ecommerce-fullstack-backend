import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.AWS_DB_HOST,
  port: Number(process.env.AWS_DB_PORT),
  username: process.env.AWS_DB_USERNAME,
  password: process.env.AWS_DB_PASSWORD,
  database: process.env.AWS_DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false, 
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
};
