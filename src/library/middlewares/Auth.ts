import { NextFunction, Request, Response } from "express";
import Container from "typedi";

export const Auth = (req: Request, res: Response, next: NextFunction) => {
    if (req.session){
        res.locals.currentUrl = req.originalUrl;
        res.locals.menu = Container.get("AdminRoutesArray");
        if (process.env.NODE_ENV === 'development' && +(process.env.disableLogin || 0)){
            req.session.auth = 1;
            req.session.role = 'admin';
            return next();
        }

        if (['/admin/login'].indexOf(req.originalUrl) !== -1 || req.session.auth){
            return next();
        }
    }

    res.redirect('/admin/login');
};
