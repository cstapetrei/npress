import { Entity, Column, BeforeInsert, BeforeUpdate } from "typeorm";
import { Base } from "./Base";
import { IsUnique } from "../library/decorators/validation/IsUnique";
import { IsNotEmpty } from "class-validator";
import { StringHelper } from "../library/helpers/StringHelper";

@Entity()
export class Codeblock extends Base{

    @Column('varchar', { length: 255 })
    @IsNotEmpty({
        message: 'Name must not be empty'
    })
    name: string;

    @Column('varchar', { length: 255, unique: true })
    @IsUnique()
    slug: string;

    @Column('text')
    content: string;

    @BeforeInsert()
    setDataBeforeInsert(){
        this.status = Base.STATUS_ACTIVE;
    }

    assign(requestBody: Partial<Codeblock>): Codeblock {
        super.assign(requestBody);

        this.name = requestBody.name as string;
        this.slug = StringHelper.slugify(this.name);
        this.content = requestBody.content || '';
        return this;
    }
}