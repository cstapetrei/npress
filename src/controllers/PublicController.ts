import { Request, Response } from "express";
import { NotFoundResponse } from "../library/middlewares/NotFoundResponse";
import { Page } from "../entity/Page";
import { getRepository, FindManyOptions, FindOneOptions, FindConditions } from "typeorm";
import Container from "typedi";
import { Menu } from "../entity/Menu";
import { MenuService } from "../library/services/MenuService";
import { EntityNotFoundException } from "../library/exceptions/EntityNotFoundException";
import { IStringToString } from "../library/Interfaces";
import { CodeblockService } from "../library/services/CodeblockService";
import { StringHelper } from "../library/helpers/StringHelper";
import path from "path";
import fs from "fs";
import { promisify } from 'util';
import express from "express";

export class PublicController{
    public static async index(req: Request, res: Response) {
        let findOptions:FindOneOptions<Page> = {};
        findOptions.where = { is_homepage: true };
        if (req.baseUrl){
            findOptions.where = { uri: req.baseUrl };
        }
        let currentPage:Page|undefined = await getRepository(Page).findOne(findOptions);
        if (currentPage){
            if (req.session && !req.session.auth && currentPage.status !== Page.STATUS_ACTIVE){
                return NotFoundResponse(res,req);
            }
            let app: express.Application = Container.get("App");
            let codeblockService: CodeblockService = Container.get("CodeblockService") as CodeblockService;
            let parsedCodeblocks = await codeblockService.getStringParsedCodeblocks([currentPage.content, currentPage.sidebar_content]);
            currentPage.content = StringHelper.replaceCodeblocks(currentPage.content, parsedCodeblocks);
            currentPage.sidebar_content = StringHelper.replaceCodeblocks(currentPage.sidebar_content, parsedCodeblocks);
            let menuService: MenuService = Container.get("MenuService") as MenuService;
            let pageMenu: Menu|undefined;
            let settingsMap: IStringToString = Container.get('settingsMap');
            let viewPath:string;
            try{
                pageMenu = await menuService.getDefault();
                pageMenu = menuService.getSingleMenuAsTree(pageMenu);
            } catch(e){
                if (!(e instanceof EntityNotFoundException)){
                    throw e;
                }
            }
            try{
                viewPath = path.join(app.get('views') + path.sep + 'themes' + path.sep + settingsMap.active_theme + path.sep + 'index');
                await promisify(fs.stat)(viewPath+'.twig');
            } catch(e){
                viewPath = 'index/page';
            }

            return res.render(viewPath, {
                settingsMap: settingsMap,
                menu: pageMenu,
                page: currentPage
            });
        }
        return NotFoundResponse(res,req);
    }
}