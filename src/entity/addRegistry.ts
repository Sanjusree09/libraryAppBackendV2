import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class AddRegistry{
    @PrimaryColumn()
    id:string;

    @Column()
    borrowerName:string;

    @Column()
    registryTitle:string;

    @Column()
    registryAuthor:string;

    @Column()
    registryQuantity:number;

    @Column()
    registryEdition:string;

    @Column()
    registryBorrowedDate:string;

    @Column()
    registryReturnDate:string;

}