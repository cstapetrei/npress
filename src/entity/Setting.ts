import { Entity, Column, BeforeInsert, BeforeUpdate, AfterLoad } from "typeorm";
import { Base } from "./Base";
import { IsNotEmpty } from "class-validator";
import { StringHelper } from "../library/helpers/StringHelper";
import { IsUnique } from "../library/decorators/validation/IsUnique";

@Entity()
export class Setting extends Base{

    @Column('varchar')
    @IsNotEmpty({ message: 'Key must not be empty' })
    @IsUnique()
    key: string;

    @Column('text')
    value: string;

    @Column('text')
    options: any;

    @Column('varchar')
    name: string;

    @Column('text')
    description: string;

    @Column('varchar')
    input_type: string;

    assign(requestBody: Partial<Setting>): Setting {
        super.assign(requestBody);

        this.key = StringHelper.slugify(requestBody.key || '', '_');
        this.value = requestBody.value || '';
        this.name = requestBody.name || requestBody.key || '';
        this.description = requestBody.description || '';
        this.input_type = requestBody.input_type || 'text';
        this.options = requestBody.options || '{}';
        return this;
    }

    @BeforeInsert()
    setData(){
        this.status = Base.STATUS_ACTIVE;
    }

    @BeforeUpdate()
    stringifyData() {
        this.options = JSON.stringify(this.options);
    }

    @AfterLoad()
    parseData() {
        let parsedOptions = {};
        try{
            parsedOptions = JSON.parse(this.options);
        }catch(e){}
        this.options = parsedOptions;
    }
}