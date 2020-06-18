import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";
import { getManager, Not, Equal } from "typeorm";
import { Base } from "../../../entity/Base";

export function IsUnique(validationOptions?: ValidationOptions) {
   return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "IsUnique",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                async validate(value: any, args: ValidationArguments) {
                    let findParams = {where: {[args.property] : value} },
                        o:Base = args.object as Base;
                    if (o.id){
                        findParams.where.id = Not(Equal(o.id));
                    }
                    return await getManager().findOne(args.targetName, findParams) instanceof Base ? false : true;
                },
                defaultMessage(args: ValidationArguments) { // here you can provide default error message if validation failed
                    return `${args.value} is already used. Please try something else.`;
                }
            }
        });
   };
}