import { NextFunction, Request, Response } from "express";
import { AdminMenu } from "../Interfaces";
import Container from "typedi";
import { User } from "../../entity/User";

export const InjectDataInAdminPage = (req: Request, res: Response, next: NextFunction) => {
    let adminRoutes: Map<string,AdminMenu> = Container.get("AdminRoutes");
    if (adminRoutes.has(req.originalUrl)){
        let item:AdminMenu = adminRoutes.get(req.originalUrl) as AdminMenu;
        item.active = true;
        adminRoutes.set(req.originalUrl, item);
    }
    res.locals.menu = [...adminRoutes.values()];
    next();
};