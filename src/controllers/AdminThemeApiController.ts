import { Request, Response } from "express";
import { APIExceptionResponse } from "../library/middlewares/APIExceptionResponse";
import { CountHeadersResponse } from "../library/middlewares/CountHeadersResponse";
import Container from "typedi";
import express from "express";
import path from "path";
import fs from "fs";
import { SettingService } from "./library/services/SettingService";
import { promisify } from 'util';
import { IStringToString } from "../library/Interfaces";
import { Base } from "../entity/Base";
import { Setting } from "../entity/Setting";

export class AdminThemeApiController{
    public static async getAll(req: Request, res: Response) {
        try{
            let settingsMap: IStringToString = Container.get('settingsMap');
            let responseObject:Array<IStringToString> = [{
                id: 'No theme',
                name: 'No theme',
                status: Base.STATUS_ACTIVE
            }];
            let viewsDir:string = (Container.get("App") as express.Application).get('views');
            try{
                let result:string[] = await promisify(fs.readdir)(path.join(viewsDir + path.sep + 'themes'));
                for (let i of result){
                    let files:string[] = await promisify(fs.readdir)(path.join(viewsDir + path.sep + 'themes' + path.sep + i));
                    let screenshot:string = files.find( value => value.toLowerCase() === 'screenshot.jpg' ) as string;
                    let currentObjStatus:string = Base.STATUS_DELETED
                    if (settingsMap.active_theme === i){
                        currentObjStatus = Base.STATUS_ACTIVE;
                        responseObject[0].status = Base.STATUS_DELETED;
                    }
                    responseObject.push({
                        id: i,
                        name: i,
                        status: currentObjStatus,
                        img: screenshot ? `/themes/${i}/${screenshot}` : ''
                    });
                }
            } catch(e){
                console.log(e);
            }
            return CountHeadersResponse(responseObject, responseObject.length, res);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }

    public static async put(req: Request, res: Response) {
        try{
            let viewsDir:string = (Container.get("App") as express.Application).get('views');
            let themeName:string = req.body.id;
            try{
                await promisify(fs.stat)(path.join(viewsDir + path.sep + 'themes' + path.sep + themeName + path.sep + 'index.twig'));
            } catch(e){
                themeName = '';
            }
            let activeTheme: Setting = (Container.get('settingObjects') as Setting[]).find( item => item.key === 'active_theme');
            if (activeTheme){
                activeTheme.value = themeName;
                await (Container.get('SettingService') as SettingService).update(activeTheme.id, activeTheme);
            }
            res.json([]);
        } catch(e){
            APIExceptionResponse(e,res);
        }
    }
}