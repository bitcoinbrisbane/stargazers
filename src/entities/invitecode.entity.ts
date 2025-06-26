import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";

@Entity("invitecodes")
export class InviteCode {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: "varchar",
        unique: true
    })
    code: string;

    @Column({
        type: "boolean",
        default: false
    })
    used: boolean;

    @Column({
        type: "varchar",
        length: 42,
        unique: true,
        nullable: true
    })
    claimedBy: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
