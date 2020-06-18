import { Entity, Column, BeforeInsert, OneToOne, JoinColumn } from "typeorm";
import { Base } from "./Base";
import { IsNotEmpty, IsEmail } from "class-validator";
import { Page } from "./Page";
import { ITree } from "../library/Interfaces";

@Entity()
export class Comment extends Base implements ITree{

    static readonly STATUS_PENDING = 'pending';

    @Column('int')
    @IsNotEmpty({
        message: 'Page must not be empty'
    })
    page_id: number;

    @Column('int')
    parent_id: number;

    @Column('varchar', { length: 255 })
    @IsNotEmpty({ message: 'Author name must not be empty' })
    author_name: string;

    @Column('varchar', { length: 255 })
    @IsEmail({}, { message: 'Invalid email for author' })
    author_email: string;

    @Column('text')
    @IsNotEmpty({ message: 'Content must not be empty' })
    content: string;

    // @OneToOne(type => Page, { eager: true })
    @OneToOne(type => Page)
    @JoinColumn({ name: "page_id", referencedColumnName: 'id' })
    source_page: Page; // can't name it just "page" since typeORM generates a Duplicate column name error

    children: Comment[] = [];

    assign(requestBody: any): Comment {
        super.assign(requestBody);

        this.page_id = requestBody.page_id;
        this.author_name = requestBody.author_name;
        this.author_email = requestBody.author_email;
        this.content = requestBody.content || '';
        this.parent_id = requestBody.parent_id || 0;
        this.status = requestBody.status || false;
        return this;
    }

    @BeforeInsert()
    setData(){
        this.status = this.status || Comment.STATUS_PENDING;
    }
}