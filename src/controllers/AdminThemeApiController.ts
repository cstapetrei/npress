import { Request, Response } from "express";
import { APIExceptionResponse } from "../library/middlewares/APIExceptionResponse";
import { CountHeadersResponse } from "../library/middlewares/CountHeadersResponse";
import Container from "typedi";
import express from "express";
import path from "path";
import fs from "fs";
import { promisify } from 'util';

export class AdminThemeApiController{
    public static async getAll(req: Request, res: Response) {
        try{
            let result:string[] = [];
            let viewsDir:string = (Container.get("App") as express.Application).get('views');
            try{
                result = await promisify(fs.readdir)(path.join(viewsDir + path.sep + 'themes'));
            } catch(e){
                console.log(e);
            }
            return CountHeadersResponse(result, result.length, res);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }
}