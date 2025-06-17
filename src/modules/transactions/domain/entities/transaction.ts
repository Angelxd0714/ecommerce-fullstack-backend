import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('transactions')
export class Transaction {
    @PrimaryColumn('uuid')
    id?: string; 
    @Column({type: 'enum', enum: ['VOIDED', 'APPROVED', 'DECLINED', 'ERROR','PENDING']})
    status?: 'VOIDED' | 'APPROVED' | 'DECLINED'|'ERROR'|'PENDING';
    @Column({ type: 'decimal', precision: 10, scale: 2 }) // Stores numbers like 19.99

    amount?: number;
    @Column()
    currency?: string;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;
    
    @Column({nullable: true})
    customerId?: string;
    @Column({nullable: true})
    wompiTransactionId?: string; 
    @Column({nullable: true})
    reference?: string;
}   