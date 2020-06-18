import { ValidationOptions, ValidationArguments, registerDecorator } from "class-validator";

export function IsRelativeOrAbsoluteUrl(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "IsRelativeOrAbsoluteUrl",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                async validate(value: any, args: ValidationArguments) {
                    let relativeUrlResult = value.match(/^\/[\w\-_~:/?#[\]@!\$&'\(\)\*\+,;=]+$/);
                    let absoluteUrlResult = value.match(/^(?:http(s)?:)?(\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/);
                    return !(!relativeUrlResult && !absoluteUrlResult)
                },
                defaultMessage(args: ValidationArguments) {
                    return `Invalid url`;
                }
            }
        });
    };
}

