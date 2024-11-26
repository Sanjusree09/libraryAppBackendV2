import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class AddMember{
    @PrimaryColumn()
    id:string;

    @Column()
    memberName:string;

    @Column()
    memberEmail:string;

    @Column()
    memberContactNumber:string;

    @Column()
    memberAddress:string;

    @Column()
    memberOccupation:string;
}