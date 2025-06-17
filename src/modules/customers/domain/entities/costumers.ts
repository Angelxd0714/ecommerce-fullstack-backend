import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
 
 @Entity("costumers")
 export class Costumer {
    @PrimaryGeneratedColumn("uuid")
    id?: string;
    @Column()
    name: string;
    @Column({unique: true, type: 'bigint'})
    identity?: number;
    @Column()
    email: string;  
    @Column()
    phone: string;
    @Column({default: () => 'CURRENT_TIMESTAMP'})
    createdAt?: Date;
    @Column({default: () => 'CURRENT_TIMESTAMP'})
    updatedAt?: Date;       
 }
 