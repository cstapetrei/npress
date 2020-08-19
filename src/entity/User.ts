import { Entity, Column, BeforeInsert, BeforeUpdate } from "typeorm";
import { IsEmail, MinLength } from "class-validator";
import { Base } from "./Base";
import crypto from "crypto";
import { IsUnique } from "../library/decorators/validation/IsUnique";
import { IdenticalFields } from "../library/decorators/validation/IdenticalFields";
import { PasswordHelper } from "../library/helpers/PasswordHelper";

@Entity()
export class User extends Base{

    static readonly ROLE_ADMIN:string = 'admin';
    static readonly ROLE_USER:string = 'user';
    static readonly ROLE_GUEST:string = 'guest';

    @Column('varchar', { length: 255, unique: true })
    @IsEmail({}, {
        message: "Invalid email."
    })
    @IsUnique()
    email: string;

    @Column('varchar', { length: 255 })
    @MinLength(6, { message: "Password must have at least 6 characters" })
    password: string;

    @IdenticalFields("password", { message: "Passwords don't match" })
    password_confirm: string;

    @Column('varchar', { length: 255 })
    salt: string;

    @Column('varchar', { length: 255 })
    role: string;

    password_changed: boolean = false;

    @BeforeInsert()
    setDataBeforeInsert(){
        this.salt = crypto.randomBytes(16).toString('hex');
        this.password = PasswordHelper.hashString(this.password, this.salt);
        this.status = Base.STATUS_ACTIVE;
        this.role = User.ROLE_GUEST;
    }

    @BeforeUpdate()
    setDataBeforeUpdate(){
        if (this.password_changed){
            this.password = PasswordHelper.hashString(this.password, this.salt);
        }
    }

    assign(requestBody: Partial<User>): User {
        super.assign(requestBody);

        this.email = requestBody.email || '';
        this.role = requestBody.role || User.ROLE_GUEST;

        if (this.password_changed){
            this.password = requestBody.password || '';
            this.password_confirm = requestBody.password_confirm || '';
        }
        return this;
    }
}