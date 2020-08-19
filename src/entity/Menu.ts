import { Entity, Column, BeforeInsert, OneToMany } from "typeorm";
import { Base } from "./Base";
import { StringHelper } from "../library/helpers/StringHelper";
import { IsNotEmpty } from "class-validator";
import { MenuItem } from "./MenuItem";
import { ITree } from "../library/Interfaces";

@Entity()
export class Menu extends Base{

    @Column('varchar', { length: 255 })
    @IsNotEmpty({
        message: 'Name must not be empty'
    })
    name: string;

    @Column('varchar', { length: 255 })
    slug: string;

    @OneToMany(type => MenuItem, item => item.menu)
    items: ITree[];

    @Column('int')
    is_default: boolean;

    assign(requestBody: Partial<Menu>): Menu {
        super.assign(requestBody);

        this.name = requestBody.name || '';
        this.slug = StringHelper.slugify(this.name);
        this.is_default = requestBody.is_default || (this.is_default || false);
        return this;
    }

    @BeforeInsert()
    setData(){
        this.status = Base.STATUS_ACTIVE;
        this.is_default = false;
    }
}