import { BeforeInsert, BeforeUpdate, InsertEvent, UpdateEvent, Column, PrimaryGeneratedColumn } from "typeorm";
import { validate } from "class-validator";
import { BadRequestException } from "../library/exceptions/BadRequestException";

export abstract class Base{

    static readonly STATUS_ACTIVE:string = 'active';
    static readonly STATUS_DELETED:string = 'deleted';

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: 255 })
    status:string;

    @Column('datetime')
    created_at:Date;

    @Column('datetime')
    updated_at:Date;

    assign(requestBody: Partial<Base>): Base{
        this.status = requestBody.status || (this.status || Base.STATUS_ACTIVE);
        this.created_at = requestBody.created_at || (this.created_at || new Date());
        this.updated_at = requestBody.updated_at || (this.updated_at || new Date());
        return this;
    }

    @BeforeInsert()
    @BeforeUpdate()
    async validate(event: InsertEvent<Base>|UpdateEvent<Base>){
        let errors = await validate(this);
        if (errors.length){
            throw new BadRequestException(errors);
        }
    }
}
