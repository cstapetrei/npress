import { BaseService } from "./BaseService";
import { Repository, getRepository, FindManyOptions, FindConditions, In } from "typeorm";
import { Comment } from "../../entity/Comment";
import { ArrayHelper } from "../helpers/ArrayHelper";
import { IStringToString } from "../Interfaces";

export class CommentService extends BaseService{

    constructor(){
        super(Comment);
        this.eventMap = {
            [BaseService.CREATED_EVENT_KEY]: 'comment-service-created-entity',
            [BaseService.DELETED_EVENT_KEY]: 'comment-service-deleted-entity',
            [BaseService.UPDATED_EVENT_KEY]: 'comment-service-updated-entity'
        };
    }

    async getPaged(page: number, itemsPerPage: number = 10, query: string = '', order: string = '', otherOptions: IStringToString = {}) {
        let repo: Repository<Comment> = getRepository(this.entityType);
        let sqlObject = repo.createQueryBuilder('t'); // general alias t = table
        let count = await sqlObject.getCount();
        let maxPageCount = Math.ceil(count / itemsPerPage);
        if (maxPageCount <= page){
            page = maxPageCount-1;
        }
        this.injectPagingParams(page, itemsPerPage, sqlObject);
        this.injectOrderParams(order, sqlObject);
        this.injectSearchParams(query, sqlObject);

        if (+(otherOptions.get_source_page as string)){
            sqlObject.innerJoinAndMapOne("t.source_page", "t.source_page", "sp");
        }
        let fetchedRows:Comment[] = await sqlObject.getMany();
        let result: [Comment[], number] = [fetchedRows, count];
        return result;
    }

    async getAllForPage(pageId: number, statusArray:string|Array<string> = [], getRelation:boolean = false) {
        let repo: Repository<Comment> = getRepository(Comment);
        let findOptions:FindManyOptions<Comment> = {
            order: { created_at: 'DESC' }
        };
        let findConditions: FindConditions<Comment> = {
            page_id: pageId
        }
        if (typeof statusArray === 'string'){
            statusArray = [statusArray];
        }
        if (statusArray.length){
            findConditions.status = In(statusArray);
        }
        if (getRelation){
            findOptions.relations = ['source_page'];
        }
        findOptions.where = findConditions;
        let result:[Comment[], number] = await repo.findAndCount(findOptions).then().catch( (e: any) => {
            throw e;
        });
        return result;
    }

    getCommentArrayAsTree(linearCommentData: Comment[]){
        return ArrayHelper.treeify(linearCommentData);
    }
}