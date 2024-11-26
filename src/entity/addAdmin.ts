import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class AddAdmin{
    @PrimaryColumn()
    id:string

    @Column()
    name: string

    @Column()
    email:string
    
    @Column()
    role:string


}