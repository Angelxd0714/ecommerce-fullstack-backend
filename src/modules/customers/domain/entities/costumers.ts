import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
 
 @Entity("costumers")
 export class Costumer {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    name: string;
    @Column()
    email: string;  
    @Column()
    phone: string;
    @Column()
    createdAt: Date;
    @Column()
    updatedAt: Date;       
 }
 