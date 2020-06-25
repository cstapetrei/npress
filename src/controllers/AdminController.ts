import express from "express";
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Page } from "../entity/Page";
import { NotFoundResponse } from "../library/middlewares/NotFoundResponse";
import Container from "typedi";
import { UserService } from "../library/services/UserService";
import { PasswordHelper } from "../library/helpers/PasswordHelper";
import { User } from "../entity/User";

export class AdminController{
    public static async index(req: Request, res: Response) {
        req.app;
        res.render('admin/index');
    }
    public static async login(req: Request, res: Response) {
        let errors:Array<string> = [];
        if (req.method === 'POST' && req.session){
            const { email, password } = req.body;
            let existingUser = await (Container.get("UserService") as UserService).getByEmail(email);
            if (existingUser){
                if (existingUser.password === PasswordHelper.hashString(password, existingUser.salt)){
                    req.session = Object.assign(req.session, (Container.get("UserService") as UserService).getSessionDataForLogin(existingUser));
                    (Container.get("App") as express.Application).set('is_logged_in', 1);
                    return res.redirect('/admin');
                }
            }
            errors.push("Invalid user or password.");
        }
        res.render('admin/login', { errors: errors });
    }
    public static async logout(req: Request, res: Response) {
        if (req.session){
            req.session.destroy( (err) => {} );
            (Container.get("App") as express.Application).set('is_logged_in', 0);
            return res.redirect('/admin/login');
        }
        return res.redirect('/admin');
    }
    public static async users(req: Request, res: Response) {
        res.render('admin/users', { nav_title: 'Users' });
    }

    public static async pages(req: Request, res: Response) {
        res.render('admin/pages', { nav_title: 'Pages' });
    }

    public static async files(req: Request, res: Response) {
        res.render('admin/files', { nav_title: 'Files' });
    }

    public static async menus(req: Request, res: Response) {
        res.render('admin/menus', { show_search: false, nav_title: 'Menus' });
    }

    public static async comments(req: Request, res: Response) {
        res.render('admin/comments', { show_search: false, nav_title: 'Comments' } );
    }

    public static async codeblocks(req: Request, res: Response) {
        res.render('admin/codeblocks', { nav_title: 'Codeblocks' } );
    }

    public static async settings(req: Request, res: Response) {
        res.render('admin/settings', { nav_title: 'Settings' });
    }

    public static async newPage(req: Request, res: Response) {
        res.render('admin/new-edit-page', { body_class: 'add-new-page' });
    }

    public static async editPage(req: Request, res: Response) {
        getRepository(Page).findOne(req.params.id).then( value => {
            res.render('admin/new-edit-page', { data: value, edit: 1, body_class: 'edit-page' });
        }).catch( (e) => {
            NotFoundResponse(res, req);
        });
    }
}