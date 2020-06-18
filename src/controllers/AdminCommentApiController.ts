import { Request, Response } from "express";
import { APIExceptionResponse } from "../library/middlewares/APIExceptionResponse";
import { CommentService } from "../library/services/CommentService";
import { CountHeadersResponse } from "../library/middlewares/CountHeadersResponse";
import Container from "typedi";
import { Comment } from "../entity/Comment";

export class AdminCommentApiController{
    public static async getAll(req: Request, res: Response) {
        try{
            let result: [Comment[], number] = await (Container.get("CommentService") as CommentService).getPaged(parseInt(req.query.page as string)-1, 10, (req.query.q as string) || '', true)
            return CountHeadersResponse(result[0], result[1], res);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }

    public static async post(req: Request, res: Response) {
        try{
            res.json(await (Container.get("CommentService") as CommentService).saveNew(req.body) || []);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }

    public static async delete(req: Request, res: Response) {
        try{
            res.json(await (Container.get("CommentService") as CommentService).delete(parseInt(req.params.id)) || []);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }

    public static async put(req: Request, res: Response) {
        try{
            res.json(await (Container.get("CommentService") as CommentService).update(parseInt(req.params.id), req.body) || []);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }
}