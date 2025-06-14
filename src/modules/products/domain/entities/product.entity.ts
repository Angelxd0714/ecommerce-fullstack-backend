import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('products')
export class Product {
    
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar", { length: 255 })
    name: string;

    @Column("numeric", { precision: 10, scale: 2 })
    price: number;

    @Column("integer")
    stock: number;

    @Column("text")
    description: string;

    @Column("varchar", { length: 255 })
    image: string;

    @Column("varchar", { length: 255 })
    category: string;

  

    @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date;
}
