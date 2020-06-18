import { Repository, getRepository, FindManyOptions } from "typeorm";
import { EntityNotFoundException } from "../exceptions/EntityNotFoundException";
import Container from "typedi";
import { EventEmitter } from "events";
import { Base } from "../../entity/Base";

export class BaseService{

    static readonly CREATED_EVENT_KEY:string = 'created';
    static readonly DELETED_EVENT_KEY:string = 'deleted';
    static readonly UPDATED_EVENT_KEY:string = 'updated';

    protected entityType:any;
    protected eventMap:{[key: string]: string};

    constructor(type: any){
        this.entityType = type;
    }

    getEventString(key:string):string{
        return this.eventMap[key] || '';
    }

    getFindManyOptions(page: number, itemsPerPage: number = 10, query: string = '') : FindManyOptions{
        page = page >= 0 ? page : 0;
        let offset = itemsPerPage*page
        return {
            order: { id: 'ASC' },
            skip: offset,
            take: itemsPerPage
        };
    }

    public async preProcessData(data: any){
        return data;
    };

    async getPaged(page: number, itemsPerPage: number = 10, query: string = '') {
        let repo: Repository<any> = getRepository(this.entityType);
        let result:[Base[], number] = await repo.findAndCount(this.getFindManyOptions(page, itemsPerPage, query)).then().catch( (e: any) => {
            throw e;
        });
        return result;
    }

    async saveNew(data: any) {
        data = await this.preProcessData(data);
        let newEntity:Base = (new this.entityType()).assign(data);
        await getRepository(this.entityType).save(newEntity).then().catch( (e) => {
            throw e;
        });
        if (this.eventMap[BaseService.CREATED_EVENT_KEY]){
            (Container.get("EventEmitter") as EventEmitter).emit(this.eventMap[BaseService.CREATED_EVENT_KEY], newEntity);
        }
        return newEntity;
    }

    async delete(id: number) {
        const repo: Repository<any> = getRepository(this.entityType);
        let existingEntity:Base|undefined = await repo.findOne(id);
        if (existingEntity){
            let result = await repo.delete(existingEntity.id).then().catch( (e) => { throw e; });
            if (this.eventMap[BaseService.DELETED_EVENT_KEY]){
                (Container.get("EventEmitter") as EventEmitter).emit(this.eventMap[BaseService.DELETED_EVENT_KEY], existingEntity);
            }
            return result;
        }
        throw new EntityNotFoundException();
    }

    async update(id: number, data: any){
        data = await this.preProcessData(data);
        const repo: Repository<Base> = getRepository(this.entityType);
        let existingEntity:Base|undefined = await repo.findOne(id);
        if (existingEntity){
            let result = await repo.save(existingEntity.assign(data)).then().catch( (e) => { throw e; });
            if (this.eventMap[BaseService.UPDATED_EVENT_KEY]){
                (Container.get("EventEmitter") as EventEmitter).emit(this.eventMap[BaseService.UPDATED_EVENT_KEY], existingEntity);
            }
            return result;
        }
        throw new EntityNotFoundException();
    }
}