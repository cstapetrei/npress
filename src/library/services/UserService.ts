import { User } from "../../entity/User";
import { BaseService } from "./BaseService";
import { getRepository, Repository, FindManyOptions, Like } from "typeorm";
import Container from "typedi";
import { EventEmitter } from "events";
import { EntityNotFoundException } from "../exceptions/EntityNotFoundException";
import { Base } from "../../entity/Base";
import { AdminMenu } from "../Interfaces";

export class UserService extends BaseService{
    constructor(){
        super(User);
        this.eventMap = {
            [BaseService.CREATED_EVENT_KEY]: 'user-service-created-entity',
            [BaseService.DELETED_EVENT_KEY]: 'user-service-deleted-entity',
            [BaseService.UPDATED_EVENT_KEY]: 'user-service-updated-entity',
        };
    }

    getFindManyOptions(page: number, itemsPerPage: number = 10, query: string = '') : FindManyOptions{
        let fo:FindManyOptions = super.getFindManyOptions(page, itemsPerPage, query);
        fo.where = { email: Like(`%${query}%`) };
        return fo;
    }

    async saveNew(data: any) {
        let newEntity:User = new this.entityType();
        newEntity.password_changed = true;
        newEntity.assign(data);
        await getRepository(this.entityType).save(newEntity).then().catch( (e) => {
            throw e;
        });
        if (this.eventMap[BaseService.CREATED_EVENT_KEY]){
            (Container.get("EventEmitter") as EventEmitter).emit(this.eventMap[BaseService.CREATED_EVENT_KEY], newEntity);
        }
        return newEntity;
    }

    async update(id: number, data: any){
        const repo: Repository<User> = getRepository(User);
        let existingEntity:User|undefined = await repo.findOne(id);
        if (existingEntity){
            existingEntity.password_confirm = existingEntity.password;
            if (data.password){
                existingEntity.password_changed = true;
            }
            let result = await repo.save(existingEntity.assign(data)).then().catch( (e) => { throw e; });
            if (this.eventMap[BaseService.UPDATED_EVENT_KEY]){
                (Container.get("EventEmitter") as EventEmitter).emit(this.eventMap[BaseService.UPDATED_EVENT_KEY], existingEntity);
            }
            return result;
        }
        throw new EntityNotFoundException();
    }

    async getByEmail(email: string, status: string = Base.STATUS_ACTIVE){
        const repo: Repository<User> = getRepository(User);
        return await repo.findOne({ where: { email: email, status: status } });
    }

    getSessionDataForLogin(u: User){
        return {
            auth: 1,
            email: u.email || '',
            role: u.role
        }
    }

    refreshAdminRoutesForUser(u: User){
        if (u.role === User.ROLE_ADMIN){
            return
        }
        let adminRoutesMap: Map<string, AdminMenu> = Container.get("AdminRoutes") as Map<string, AdminMenu>;
        let newAdminRoutesMap: Map<string, AdminMenu> = new Map<string, AdminMenu>();
        let adminRoutesKeys:Array<string> = [...adminRoutesMap.keys()];
        let acl: any = Container.get("Acl");
        let allowedAclArray:Array<string> = [];
        for (let rule of acl){
            if (rule.group === u.role){
                allowedAclArray = rule.permissions.map((o:any) => o .action === 'allow' ? o.resource : null)
                for (let a of allowedAclArray){
                    if (!a || a === '/admin'){ continue; }
                    const re = RegExp(a);
                    for (let adminRoute of adminRoutesKeys){
                        if (re.test(adminRoute)){
                            newAdminRoutesMap.set(adminRoute, adminRoutesMap.get(adminRoute) as AdminMenu);
                        }
                    }
                }
                break;
            }
        }
        Container.set("AdminRoutes", newAdminRoutesMap);
        Container.set("AdminRoutesArray", [...newAdminRoutesMap.values()]);
    }
}