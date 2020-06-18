import { Request, Response } from "express";
import { APIExceptionResponse } from "../library/middlewares/APIExceptionResponse";
import { CommentService } from "../library/services/CommentService";
import { CountHeadersResponse } from "../library/middlewares/CountHeadersResponse";
import Container from "typedi";
import { Comment } from "../entity/Comment";
import { IStringToString } from "../library/Interfaces";
import { BadRequestException } from "../library/exceptions/BadRequestException";

export class PublicCommentApiController{
    public static async getAll(req: Request, res: Response) {
        try{
            let result: [Comment[], number] = await (Container.get("CommentService") as CommentService).getPaged(parseInt(req.query.page as string)-1, 10, '', true)
            return CountHeadersResponse(result[0], result[1], res);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }

    public static async post(req: Request, res: Response) {
        try{
            let settingsMap: IStringToString = Container.get('settingsMap');
            if (parseInt(settingsMap.recaptcha_enabled as string) && settingsMap.recaptcha_site_key && settingsMap.recaptcha_secret_key){
                if (!req.body['g-recaptcha-response']){
                    APIExceptionResponse(new BadRequestException([ { 'recaptcha_response': 'Invalid recaptcha response' } ]),res);
                    return;
                }
                const https = require('https');
                let recaptchaReq = https.request({
                    hostname: 'www.google.com',
                    port: 443,
                    path: `/recaptcha/api/siteverify?secret=${settingsMap.recaptcha_secret_key}&response=${req.body['g-recaptcha-response']}`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }, (response:any) => {
                    let data = '';
                    response.on('data', (chunk:any) => data += chunk);
                    response.on('end', async () => {
                        let recaptchaResponse = JSON.parse(data);
                        if (!recaptchaResponse.success){
                            APIExceptionResponse(new BadRequestException(recaptchaResponse['error-codes']),res);
                            return;
                        }
                        if (recaptchaResponse.score < 0.5){
                            APIExceptionResponse(new BadRequestException(['invalid-recaptcha-score']),res);
                            return;
                        }
                        res.json(await (Container.get("CommentService") as CommentService).saveNew(req.body) || []);
                    });
                });
                recaptchaReq.on('error', (e:any) => APIExceptionResponse(e,res));
                recaptchaReq.write('');
                recaptchaReq.end();
            } else{
                res.json(await (Container.get("CommentService") as CommentService).saveNew(req.body) || []);
            }
            //
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }
}