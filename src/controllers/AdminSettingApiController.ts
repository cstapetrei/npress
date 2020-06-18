import { Request, Response } from "express";
import { APIExceptionResponse } from "../library/middlewares/APIExceptionResponse";
import { CountHeadersResponse } from "../library/middlewares/CountHeadersResponse";
import { SettingService } from "../library/services/SettingService";
import { Base } from "../entity/Base";
import Container from "typedi";

export class AdminSettingApiController{
    public static async getAll(req: Request, res: Response) {
        try{
            let result: [Base[], number] = await (Container.get("SettingService") as SettingService).getPaged(0,0, (req.query.q as string) || '');
            return CountHeadersResponse(result[0], result[1], res);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }

    public static async post(req: Request, res: Response) {
        try{
            res.json(await (Container.get("SettingService") as SettingService).saveNew(req.body) || []);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }

    public static async delete(req: Request, res: Response) {
        try{
            res.json(await (Container.get("SettingService") as SettingService).delete(parseInt(req.params.id)) || []);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }

    public static async put(req: Request, res: Response) {
        try{
            res.json(await (Container.get("SettingService") as SettingService).update(parseInt(req.params.id), req.body) || []);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }

    public static async updateAll(req: Request, res: Response) {
        try{
            res.json(await (Container.get("SettingService") as SettingService).updateAll(req.body) || []);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }

}