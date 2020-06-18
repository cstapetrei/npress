import { BadRequestException } from "../exceptions/BadRequestException";
import { Response } from "express";
import Container from "typedi";
import { InvalidRecaptchaScoreException } from "../exceptions/InvalidRecaptchaScoreException";

export const APIExceptionResponse = ( error: any, res: Response ) => {
    if (error instanceof InvalidRecaptchaScoreException){
        res.status(401).json({
            field: 'invalid-recaptcha-score'
        });
        return;
    }
    let validationErrorArray: Array<Object> = [];
    if (error instanceof BadRequestException){
        validationErrorArray = error.getErrors();
    }
    if (validationErrorArray.length){
        res.status(400).json(validationErrorArray);
        return;
    }
    const cfg:any = Container.get('config');
    console.log(error);
    res.status(500).json(cfg.environment === 'development' ? error : []);
};