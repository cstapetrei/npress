import { Entity, Column, BeforeInsert, JoinColumn, ManyToOne } from "typeorm";
import { Base } from "./Base";
import { StringHelper } from "../library/helpers/StringHelper";
import { IsNotEmpty } from "class-validator";
import { Menu } from "./Menu";
import { IsRelativeOrAbsoluteUrl } from "../library/decorators/validation/IsRelativeOrAbsoluteUrl";
import { ITree } from "../library/Interfaces";

@Entity({name: "menu_item"})
export class MenuItem extends Base implements ITree{

    @Column('int')
    menu_id: number;

    @Column('int')
    parent_id: number;

    @Column('int')
    order: number;

    @Column('varchar', { length: 255 })
    @IsNotEmpty({
        message: 'Label must not be empty'
    })
    label: string;

    @Column('varchar', { length: 255 })
    @IsRelativeOrAbsoluteUrl()
    url: string;

    @Column('varchar', { length: 255 })
    slug: string;

    @ManyToOne(type => Menu, menu => menu.items)
    @JoinColumn({ name: "menu_id", referencedColumnName: 'id' })
    menu: Menu;

    children: MenuItem[] = [];

    temporary_uuid: string;

    assign(requestBody: any): MenuItem {
        super.assign(requestBody);

        this.label = requestBody.label;
        this.slug = StringHelper.slugify(this.label);
        this.url = requestBody.url;
        this.parent_id = requestBody.parent_id || 0;
        this.order = requestBody.order || 0;
        return this;
    }

    @BeforeInsert()
    setData(){
        this.status = Base.STATUS_ACTIVE;
    }
}