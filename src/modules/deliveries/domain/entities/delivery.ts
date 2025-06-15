import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("deliveries")
export class Delivery {
    @PrimaryGeneratedColumn()
    id: string;
    @Column()
    transactionId: string;
    @Column()
    address: string;
    @Column()
    city: string;
    @Column()
    postalCode: string;
    @Column()
    delivered: boolean;
    createdAt: Date;
    updatedAt: Date;
}