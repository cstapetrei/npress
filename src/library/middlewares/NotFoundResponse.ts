import { Response, NextFunction } from "express";

export const NotFoundResponse:any = ( res: Response, req: Request, next: NextFunction ) => {
    return res.status(404).render('error/not-found');
};