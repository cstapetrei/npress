import { Request, Response } from "express";
import { APIExceptionResponse } from "../library/middlewares/APIExceptionResponse";
import { CountHeadersResponse } from "../library/middlewares/CountHeadersResponse";
import Container from "typedi";
import { Base } from "../entity/Base";
import { MenuService } from "../library/services/MenuService";
import { Menu } from "../entity/Menu";

export class AdminMenuApiController{
    public static async getAll(req: Request, res: Response) {
        try{
            let result: [Base[], number] = await (Container.get("MenuService") as MenuService).getPaged(0, 0);
            result[0] = (Container.get("MenuService") as MenuService).getMenuArrayAsTree(result[0] as Menu[]);
            return CountHeadersResponse(result[0], result[1], res);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }

    public static async post(req: Request, res: Response) {
        try{
            res.json(await (Container.get("MenuService") as MenuService).saveNew(req.body) || []);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }

    public static async delete(req: Request, res: Response) {
        try{
            res.json(await (Container.get("MenuService") as MenuService).delete(parseInt(req.params.id)) || []);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }

    public static async put(req: Request, res: Response) {
        try{
            res.json(await (Container.get("MenuService") as MenuService).update(parseInt(req.params.id), req.body) || []);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }

    public static async putItems(req: Request, res: Response) {
        try{
            res.json(await (Container.get("MenuService") as MenuService).updateItems(parseInt(req.params.id), req.body) || []);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }

    public static async setAsDefault(req: Request, res: Response) {
        try{
            res.json(await (Container.get("MenuService") as MenuService).setAsDefault(parseInt(req.params.id)) || []);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }
}