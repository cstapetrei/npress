import { NextFunction, Request, Response } from "express";
import { AdminMenuMap } from "../Interfaces";
import Container from "typedi";

export const InjectDataInAdminPage = (req: Request, res: Response, next: NextFunction) => {
    let adminRoutes: AdminMenuMap = {
        "/admin/settings": { label: "Settings", active: false, icon: "fas fa-cogs", tooltip: "Settings" },
        "/admin/users": { label: "Users", active: false, icon: "fas fa-users", tooltip: "Users" },
        "/admin/pages": { label: "Pages", active: false, icon: "fas fa-copy", tooltip: "Pages" },
        "/admin/files": { label: "Files", active: false, icon: "fas fa-folder-open", tooltip: "Files" },
        "/admin/comments": { label: "Comments", active: false, icon: "fas fa-comments", tooltip: "Comments" },
        "/admin/menus": { label: "Menus", active: false, icon: "fas fa-ellipsis-h", tooltip: "Menus" },
        "/admin/codeblocks": { label: "Codeblocks", active: false, icon: "fas fa-boxes", tooltip: "Codeblocks" },
        "/admin/themes": { label: "Themes", active: false, icon: "fas fa-paint-brush", tooltip: "Themes" }
    };
    if (adminRoutes[req.originalUrl]){
        adminRoutes[req.originalUrl].active = true;
    }
    res.locals.menu = adminRoutes;
    res.locals.settingsMap = Container.get('settingsMap');
    next();
};