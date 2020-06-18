import { Response, NextFunction, ErrorRequestHandler } from "express";

export const InternalErrorResponse:any = (error: any, req: Request, res: Response, next: NextFunction ) => {
    return res.status(500).render('error/not-found');
};