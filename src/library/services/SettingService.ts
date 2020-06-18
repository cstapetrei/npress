import { BaseService } from "./BaseService";
import { Repository, getRepository, getManager, EntityManager, FindManyOptions, Like } from "typeorm";
import Container from "typedi";
import { Setting } from "../../entity/Setting";
import { IStringToString } from "../Interfaces";
import { EventEmitter } from "typeorm/platform/PlatformTools";
import path from "path";
import fs from "fs";
import { promisify } from 'util';
import { Base } from "../../entity/Base";
import express from "express";

export class SettingService extends BaseService{

    static readonly UPDATED_ALL_EVENT_KEY:string = 'updated-all';

    constructor(){
        super(Setting);
        this.eventMap = {
            [BaseService.CREATED_EVENT_KEY]: 'setting-service-created-entity',
            [BaseService.DELETED_EVENT_KEY]: 'setting-service-deleted-entity',
            [BaseService.UPDATED_EVENT_KEY]: 'setting-service-updated-entity',
            [SettingService.UPDATED_ALL_EVENT_KEY]: 'setting-service-updated-all-entities',
        };
    }

    async loadSettingsIntoContainer(){
        let settings: Setting[] = await getRepository(Setting).find();
        let settingsMap: IStringToString = {};
        for (let s of settings){
            settingsMap[s.key] = s.value;
        }
        Container.set('settingsMap', settingsMap);
        Container.set('settingObjects', settings);
    }

    getFindManyOptions(page: number, itemsPerPage: number = 10, query: string = '') : FindManyOptions{
        let fo:FindManyOptions = super.getFindManyOptions(page, itemsPerPage, query);
        fo.where = [
            { key: Like(`%${query}%`) },
            { name: Like(`%${query}%`) }
        ];
        return fo;
    }

    async updateAll(data: any){
        let settings: Setting[] = Container.get('settingObjects');
        await getManager().transaction(async (transactionalEntityManager: EntityManager) => {
            for (let s of settings){
                if (data[s.key] !== undefined && data[s.key] !== null){
                    s.value = data[s.key];
                    await transactionalEntityManager.save(s);
                }
            }
        });
        (Container.get("EventEmitter") as EventEmitter).emit(this.eventMap[SettingService.UPDATED_ALL_EVENT_KEY]);
        return [];
    }
    async getPaged(page: number, itemsPerPage: number = 10, query: string = '') {
        let repo: Repository<Setting> = getRepository(Setting);
        let result:[Setting[], number] = await repo.findAndCount(this.getFindManyOptions(page, itemsPerPage, query)).then().catch( (e: any) => {
            throw e;
        });
        for (let s of result[0]){
            if (s.key === 'active_theme'){
                let themeList:Array<string> = await this.getThemeList();
                s.options = themeList.map( (item:string) => ({ label: item, value: item }) );
                s.options.unshift({ label: 'None', value: '' })
                break;
            }
        }
        return result;
    }

    async getThemeList(){
        let result:string[] = [];
        let viewsDir:string = (Container.get("App") as express.Application).get('views');
        try{
            result = await promisify(fs.readdir)(path.join(viewsDir + path.sep + 'themes'));
        } catch(e){
            console.log(e);
        }
        return result;
    }

}