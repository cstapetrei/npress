import { ValidationOptions, ValidationArguments, registerDecorator } from "class-validator";

export function IdenticalFields(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                async validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    return  value === relatedValue
                },
                defaultMessage(args: ValidationArguments) { // here you can provide default error message if validation failed
                    return `Fields are not identical`;
                }
            }
        });
    };
}