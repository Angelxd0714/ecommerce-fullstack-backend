import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("deliveries")
export class Delivery {
    @PrimaryGeneratedColumn('uuid')
    id?: string;
    @Column()
    transactionId?: string;
    @Column()
    address?: string;
    @Column()
    city?: string;
    @Column()
    postalCode?: string;
    @Column({ default: false })
    delivered?: boolean;
    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;
    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;
}