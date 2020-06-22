import { Repository, getRepository, DeleteResult, Like, FindManyOptions } from "typeorm";
import { File } from "../../entity/File";
import { EntityNotFoundException } from "../exceptions/EntityNotFoundException";
import path from "path";
import fs from "fs";
import { BaseService } from "./BaseService";
import Container from "typedi";
import { EventEmitter } from "events";
import { EntityNotCreatedException } from "../exceptions/EntityNotCreatedException";

export class FileService extends BaseService{
    static uploadPath = path.join(__dirname, '..','..','static','uploads');

    constructor(){
        super(File);
        this.eventMap = {
            [BaseService.CREATED_EVENT_KEY]: 'file-service-created-entity',
            [BaseService.DELETED_EVENT_KEY]: 'file-service-deleted-entity',
            [BaseService.UPDATED_EVENT_KEY]: 'file-service-updated-entity',
        };
    }

    getFindManyOptions(page: number, itemsPerPage: number = 10, query: string = '') : FindManyOptions{
        let fo:FindManyOptions = super.getFindManyOptions(page, itemsPerPage, query);
        fo.where = { name: Like(`%${query}%`) };
        return fo;
    }

    async saveNew(file: any) {
        const fileRepo: Repository<File> = getRepository(File);
        let f:File|undefined = await fileRepo.findOne({ where: { name : file.name } });
        if (!f){
            f = await fileRepo.save((new File()).assign({ name: file.name, type: file.type }));
            if (!f){
                throw new EntityNotCreatedException();
            }
            (Container.get("EventEmitter") as EventEmitter).emit(this.eventMap[BaseService.CREATED_EVENT_KEY], f);
        }
        return f;
    }

    async delete(id: number):Promise<any>{
        const fileRepo: Repository<File> = getRepository(File);
        let f:File|undefined = await fileRepo.findOne(id);
        if (f){
            fs.unlink(path.join(FileService.uploadPath, f.name), async (err: any) => {
                if (f || err.code === 'ENOENT'){
                    let result:DeleteResult = await fileRepo.delete(f.id).then().catch( (e:Error) => { throw e; });
                    (Container.get("EventEmitter") as EventEmitter).emit(this.eventMap[BaseService.DELETED_EVENT_KEY], f);
                    return result;
                }
                throw new EntityNotFoundException();
            });
        } else {
            throw new EntityNotFoundException();
        }
    }
}