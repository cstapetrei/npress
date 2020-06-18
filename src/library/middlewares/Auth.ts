import { NextFunction, Request, Response } from "express";
import Container from "typedi";
import { UserService } from "../services/UserService";
import { User } from "../../entity/User";

export const Auth = (req: Request, res: Response, next: NextFunction) => {
    if (req.session && process.env.NODE_ENV === 'development' && +(process.env.disableLogin || 0)){
        req.session = Object.assign(req.session, (Container.get("UserService") as UserService).getSessionDataForLogin(new User));
    }
    const currentRoute = req.originalUrl;
    if (['/admin/login'].indexOf(currentRoute) !== -1 || (req.session && req.session.auth)){
        return next();
    }
    res.redirect('/admin/login');
};