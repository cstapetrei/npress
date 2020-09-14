import express from "express";
import { NextFunction, Request, Response } from "express";
import Container from "typedi";
import { User } from "../../entity/User";
import { UserService } from "../services/UserService";

export const Auth = (req: Request, res: Response, next: NextFunction) => {
    if (req.session){
        res.locals.currentUrl = req.originalUrl;
        res.locals.menu = Container.get("AdminRoutesArray");
        res.locals.logged_in_email = req.session.email;
        if (process.env.NODE_ENV === 'development' && +(process.env.disableLogin || 0)){
            let fakeUser = (new User()).assign({ role: 'admin', email: 'admin@npress.com', status: 'active' });
            fakeUser.id = 1;
            req.session = Object.assign(req.session, (Container.get("UserService") as UserService).getSessionDataForLogin(fakeUser));
            res.locals.logged_in_email = req.session.email;
            (Container.get("App") as express.Application).set('userData', req.session);
            return next();
        }

        if (req.originalUrl === '/login' || req.session.auth){
            if (req.originalUrl === '/' && req.session.role !== 'admin'){
                if (!res.locals.menu.length){
                    res.redirect('/logout');
                    return;
                }
                res.redirect(res.locals.menu[0].url);
                return;
            }
            return next();
        }
    }

    res.redirect('/login');
};
