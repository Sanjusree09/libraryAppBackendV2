import { Entity, Column, PrimaryColumn } from "typeorm"


@Entity()
export class AddBook {

    @PrimaryColumn()
    id: string

    @Column()
    title: string

    @Column()
    author: string

    @Column()
    quantity: number

    @Column()
    edition:string

    @Column()
    description:string

}
