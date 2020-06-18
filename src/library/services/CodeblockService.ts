import { BaseService } from "./BaseService";
import { Repository, getRepository, FindManyOptions, Like, In } from "typeorm";
import { Codeblock } from "../../entity/Codeblock";
import { StringHelper } from "../helpers/StringHelper";
import { IStringToString } from "../Interfaces";

export class CodeblockService extends BaseService{

    constructor(){
        super(Codeblock);
        this.eventMap = {
            [BaseService.CREATED_EVENT_KEY]: 'codeblock-service-created-entity',
            [BaseService.DELETED_EVENT_KEY]: 'codeblock-service-deleted-entity',
            [BaseService.UPDATED_EVENT_KEY]: 'codeblock-service-updated-entity',
        };
    }

    getFindManyOptions(page: number, itemsPerPage: number = 10, query: string = '') : FindManyOptions{
        let fo:FindManyOptions = super.getFindManyOptions(page, itemsPerPage, query);
        fo.where = [
            { name: Like(`%${query}%`) }
        ];
        return fo;
    }

    async getBySlugs(slugArray:(string | undefined)[]){
        if (!slugArray || !slugArray.length){
            return [];
        }
        if (typeof slugArray === 'string'){
            slugArray = [slugArray];
        }
        let repo: Repository<Codeblock> = getRepository(Codeblock);
        let result:Codeblock[] = await repo.find({
            slug: In(slugArray)
        }).then().catch( (e: any) => {
            throw e;
        });
        return result;
    }

    async getStringParsedCodeblocks(strArray: string|Array<string>){
        if (typeof strArray === 'string'){
            strArray = [strArray];
        }
        let parsedCodeblocks:Array<IStringToString> = [];
        for (let s of strArray){
            parsedCodeblocks = parsedCodeblocks.concat(StringHelper.parseForCodeblocks(s));
        }

        let codeblocks:Array<Codeblock> = await this.getBySlugs(parsedCodeblocks.map( (item) => item.code ));
        let codeblockMap: Map<string, string> = new Map();
        for (let s of codeblocks){
            codeblockMap.set(s.slug, s.content);
        }
        for (let p of parsedCodeblocks){
            p.html = codeblockMap.get(p.code || '');
        }
        return parsedCodeblocks;
    }
}