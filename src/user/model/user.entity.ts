import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, BeforeInsert, Tree, TreeChildren } from 'typeorm';

//Unique Id Creation
import * as uniqid from "uniqid";

@Entity()
class Avatar {
    @Column({ type: "text", nullable: true })
    public_key: string;
    @Column({ type: "text", nullable: true })
    url: string;
}

@Entity()
@Tree("closure-table")
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: "text", nullable: false })
    userName: string;
    @Column({ type: "text", nullable: false })
    email: string;
    @Column({ type: "text", nullable: false })
    firstName: string;
    @Column({ type: "text", nullable: false })
    lastName: string;
    @Column({ type: "text", nullable: false, select: false })
    password: string;
    @Column({ type: "text", nullable: true })
    socket_id: string;
    @Column({ type: "text", nullable: true, select: false })
    otp: string;
    @TreeChildren()
    avatar: Avatar;
    @Column({ type: "boolean", default: false, nullable: false })
    is_verify: boolean;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;

    //Before Insert Injection
    @BeforeInsert()
    createUserName() {
        this.userName = uniqid.time()
    }
}

