import { BaseService } from "./BaseService";
import { Repository, getRepository, getManager, EntityManager, FindManyOptions, Like } from "typeorm";
import { EntityNotFoundException } from "../exceptions/EntityNotFoundException";
import Container from "typedi";
import { EventEmitter } from "events";
import { Page } from "../../entity/Page";

export class PageService extends BaseService{

    static readonly PAGE_CHANGED_STATUS_EVENT_KEY:string = 'changed-status';

    constructor(){
        super(Page);
        this.eventMap = {
            [BaseService.CREATED_EVENT_KEY]: 'page-service-created-entity',
            [BaseService.DELETED_EVENT_KEY]: 'page-service-deleted-entity',
            [BaseService.UPDATED_EVENT_KEY]: 'page-service-updated-entity',
            [PageService.PAGE_CHANGED_STATUS_EVENT_KEY]: 'page-service-changed-status',
        };
    }

    async changeStatus(pageId: number, newStatus: string){
        const pageRepo: Repository<Page> = getRepository(Page);
        let p:Page|undefined = await pageRepo.findOne(pageId);
        if (p){
            p.status = newStatus;
            let result = await pageRepo.save(p).then().catch( (e) => { throw e; });
            (Container.get("EventEmitter") as EventEmitter).emit(this.eventMap[PageService.PAGE_CHANGED_STATUS_EVENT_KEY], p);
            return result;
        }
        throw new EntityNotFoundException();
    }

    async getAll(){
        const pageRepo: Repository<Page> = getRepository(Page);
        let result:Page[] = await pageRepo.find().then().catch( (e: any) => {
            throw e;
        });
        return result;
    }

    getFindManyOptions(page: number, itemsPerPage: number = 10, query: string = '') : FindManyOptions{
        let fo:FindManyOptions = super.getFindManyOptions(page, itemsPerPage, query);
        fo.where = { title: Like(`%${query}%`) };
        return fo;
    }

    async setAsHomepage(pageId: number){
        const pageRepo: Repository<Page> = getRepository(Page);
        let pages:Page[] = await pageRepo.find({ where: [
            { id: pageId },
            { is_homepage: 1 }]
        });
        let newHomepage:Page|undefined;
        await getManager().transaction(async (transactionalEntityManager: EntityManager) => {
            for (let page of pages){
                page.is_homepage = !page.is_homepage;
                if (page.is_homepage){
                    newHomepage = page;
                }
                await transactionalEntityManager.save(page);
            }
        });
        if (newHomepage){
            return [];
        }
        throw new EntityNotFoundException();
    }
}