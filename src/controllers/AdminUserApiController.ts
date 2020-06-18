import { Request, Response } from "express";
import { APIExceptionResponse } from "../library/middlewares/APIExceptionResponse";
import { UserService } from "../library/services/UserService";
import { CountHeadersResponse } from "../library/middlewares/CountHeadersResponse";
import Container from "typedi";
import { Base } from "../entity/Base";

export class AdminUserApiController{
    public static async getAll(req: Request, res: Response) {
        try{
            let result: [Base[], number] = await (Container.get("UserService") as UserService).getPaged(parseInt(req.query.page as string)-1, 10, (req.query.q as string) || '');
            return CountHeadersResponse(result[0], result[1], res);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }

    public static async post(req: Request, res: Response) {
        try{
            res.json(await (Container.get("UserService") as UserService).saveNew(req.body) || []);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }

    public static async delete(req: Request, res: Response) {
        try{
            res.json(await (Container.get("UserService") as UserService).delete(parseInt(req.params.id)) || []);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }

    public static async put(req: Request, res: Response) {
        try{
            res.json(await (Container.get("UserService") as UserService).update(parseInt(req.params.id), req.body) || []);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }
}