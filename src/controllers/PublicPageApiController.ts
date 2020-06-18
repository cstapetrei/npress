import { Request, Response } from "express";
import { APIExceptionResponse } from "../library/middlewares/APIExceptionResponse";
import { CommentService } from "../library/services/CommentService";
import { CountHeadersResponse } from "../library/middlewares/CountHeadersResponse";
import Container from "typedi";
import { ITree } from "../library/Interfaces";
import { ArrayHelper } from "../library/helpers/ArrayHelper";
import { Base } from "../entity/Base";

export class PublicPageApiController{
    public static async getComments(req: Request, res: Response) {
        try{
            let result: [ITree[], number] = await (Container.get("CommentService") as CommentService).getAllForPage(parseInt(req.params.id), Base.STATUS_ACTIVE)
            result[0] = ArrayHelper.treeify(result[0]);
            return CountHeadersResponse(result[0], result[1], res);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }
}