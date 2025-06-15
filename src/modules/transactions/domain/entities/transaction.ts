import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('transactions')
export class Transaction {
    @PrimaryColumn()
    id: string; 
    @Column({type: 'enum', enum: ['VOIDED', 'APPROVED', 'DECLINED', 'ERROR']})
    status: 'VOIDED' | 'APPROVED' | 'DECLINED'|'ERROR';
    @Column()
    amount: number;
    @Column()
    currency: string;
    @Column()
    createdAt: Date;
    @Column()
    updatedAt: Date;
    productId: string;
    customerId: string;
    wompiTransactionId: string; 
}   