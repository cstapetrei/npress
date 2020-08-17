import { Repository, getRepository, FindManyOptions, SelectQueryBuilder } from "typeorm";
import { EntityNotFoundException } from "../exceptions/EntityNotFoundException";
import Container from "typedi";
import { EventEmitter } from "events";
import { Base } from "../../entity/Base";
import { IStringToString } from "../Interfaces";

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

    injectOrderParams(order:string, queryObject: SelectQueryBuilder<any>){
        if (order){
            let orderSplit = order.split(',');
            orderSplit[0] = orderSplit[0].trim();
            orderSplit[1] = orderSplit[1].trim().toUpperCase();
            if (orderSplit[1] === 'ASC' || orderSplit[1] === 'DESC'){
                queryObject.orderBy(orderSplit[0], (orderSplit[1] as 'ASC'|'DESC'));
            }
        }
        return queryObject;
    }

    injectSearchParams(query:string, queryObject: SelectQueryBuilder<any>){
        return queryObject;
    }

    injectPagingParams(page: number, itemsPerPage: number = 10, queryObject: SelectQueryBuilder<any>){
        if (itemsPerPage && page >= 0){
            queryObject.offset(itemsPerPage*page);
            queryObject.limit(itemsPerPage);
        }
        return queryObject;
    }

    async getPaged(page: number, itemsPerPage: number = 10, query: string = '', order: string = 'id,asc', otherOptions: IStringToString = {}) {
        let repo: Repository<any> = getRepository(this.entityType);
        let sqlObject = repo.createQueryBuilder('t'); // general alias t = table
        let count = await sqlObject.getCount();
        let maxPageCount = Math.ceil(count / itemsPerPage);
        if (maxPageCount <= page){
            page = maxPageCount-1;
        }
        this.injectPagingParams(page, itemsPerPage, sqlObject);
        this.injectOrderParams(order, sqlObject);
        this.injectSearchParams(query, sqlObject);
        let fetchedRows:Base[] = await sqlObject.getMany();
        let result: [Base[], number] = [fetchedRows, count];
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
            let result = await repo.update(existingEntity.id, existingEntity.assign(data)).then().catch( (e) => { throw e; });
            if (this.eventMap[BaseService.UPDATED_EVENT_KEY]){
                (Container.get("EventEmitter") as EventEmitter).emit(this.eventMap[BaseService.UPDATED_EVENT_KEY], existingEntity);
            }
            return result;
        }
        throw new EntityNotFoundException();
    }
}