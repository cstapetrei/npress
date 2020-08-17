import { Request, Response } from "express";
import { APIExceptionResponse } from "../library/middlewares/APIExceptionResponse";
import { CountHeadersResponse } from "../library/middlewares/CountHeadersResponse";
import { PageService } from "../library/services/PageService";
import { Base } from "../entity/Base";
import Container from "typedi";
import { CommentService } from "../library/services/CommentService";
import { ArrayHelper } from "../library/helpers/ArrayHelper";
import { ITree } from "../library/Interfaces";

export class AdminPageApiController{
    public static async getAll(req: Request, res: Response) {
        try{
            let perPage = parseInt(req.query.pp as string) || 10;
            let result: [Base[], number] = await (Container.get("PageService") as PageService).getPaged(parseInt(req.query.page as string)-1, perPage, (req.query.q as string) || '', req.query.order as string || 'id,asc');
            return CountHeadersResponse(result[0], result[1], res);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }

    public static async getComments(req: Request, res: Response) {
        try{
            let result: [ITree[], number] = await (Container.get("CommentService") as CommentService).getAllForPage(parseInt(req.params.id))
            result[0] = ArrayHelper.treeify(result[0]);
            return CountHeadersResponse(result[0], result[1], res);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }

    public static async post(req: Request, res: Response) {
        try{
            res.json(await (Container.get("PageService") as PageService).saveNew(req.body) || []);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }

    public static async delete(req: Request, res: Response) {
        try{
            res.json(await (Container.get("PageService") as PageService).delete(parseInt(req.params.id)) || []);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }

    public static async put(req: Request, res: Response) {
        try{
            res.json(await (Container.get("PageService") as PageService).update(parseInt(req.params.id), req.body) || []);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }

    public static async changeStatus(req: Request, res: Response) {
        try{
            res.json(await (Container.get("PageService") as PageService).changeStatus(parseInt(req.params.id), req.body.status) || []);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }

    public static async setAsHomepage(req: Request, res: Response) {
        try{
            res.json(await (Container.get("PageService") as PageService).setAsHomepage(parseInt(req.params.id)) || []);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }
}