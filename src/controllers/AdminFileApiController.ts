import { Request, Response } from "express";
import { APIExceptionResponse } from "../library/middlewares/APIExceptionResponse";
import { IncomingForm } from 'formidable';
import path from "path";
import fs from "fs";
import { CountHeadersResponse } from "../library/middlewares/CountHeadersResponse";
import { FileService } from "../library/services/FileService";
import Container from "typedi";
import { Base } from "../entity/Base";

export class AdminFileApiController{

    public static async getAll(req: Request, res: Response) {
        try{
            let result: [Base[], number] = await (Container.get("FileService") as FileService).getPaged(parseInt(req.query.page as string)-1, 10, (req.query.q as string) || '')
            return CountHeadersResponse(result[0], result[1], res);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }

    public static async post(req: Request, res: Response) {
        let form = new IncomingForm();
        form.uploadDir = FileService.uploadPath;
        form.keepExtensions = true;
        form.multiples = true;
        form.on('file', (name, file) => {
            let uploadPath = path.join(form.uploadDir, file.name),
                uploadedFile = file;
            fs.rename(file.path, uploadPath, async (err) => {
                if (err) {
                    return APIExceptionResponse(err, res);
                }
                try{
                    let saved = await (Container.get("FileService") as FileService).saveNew(uploadedFile);
                    res.json(saved || []);
                } catch (e){
                    APIExceptionResponse(e,res);
                }
            });
        });
        form.on('error', function(err) {
            APIExceptionResponse(err, res);
        });
        form.parse(req);
    }

    public static async delete(req: Request, res: Response) {
        try{
            await (Container.get("FileService") as FileService).delete(parseInt(req.params.id));
            res.json([]);
        } catch (e){
            APIExceptionResponse(e,res);
        }
    }

    public static async put(req: Request, res: Response) {
        try{
            res.json(await (Container.get("FileService") as FileService).update(parseInt(req.params.id), req.body) || []);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }
}