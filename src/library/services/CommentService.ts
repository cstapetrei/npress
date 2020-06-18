import { BaseService } from "./BaseService";
import { Repository, getRepository, FindManyOptions, FindConditions, In } from "typeorm";
import { Comment } from "../../entity/Comment";
import { ArrayHelper } from "../helpers/ArrayHelper";

export class CommentService extends BaseService{

    constructor(){
        super(Comment);
        this.eventMap = {
            [BaseService.CREATED_EVENT_KEY]: 'comment-service-created-entity',
            [BaseService.DELETED_EVENT_KEY]: 'comment-service-deleted-entity',
            [BaseService.UPDATED_EVENT_KEY]: 'comment-service-updated-entity'
        };
    }

    async getPaged(page: number, itemsPerPage: number = 10, query:string = '', getRelation:boolean = false) {
        let repo: Repository<Comment> = getRepository(Comment);
        let fo:FindManyOptions = super.getFindManyOptions(page, itemsPerPage, query);
        if (getRelation){
            fo.relations = ['source_page'];
        }
        let result:[Comment[], number] = await repo.findAndCount(fo).then().catch( (e: any) => {
            throw e;
        });
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