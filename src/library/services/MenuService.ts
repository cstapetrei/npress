import { BaseService } from "./BaseService";
import { Repository, getRepository, getManager, EntityManager } from "typeorm";
import { EntityNotFoundException } from "../exceptions/EntityNotFoundException";
import Container from "typedi";
import { EventEmitter } from "events";
import { Menu } from "../../entity/Menu";
import { MenuItem } from "../../entity/MenuItem";
import { BadRequestException } from "../exceptions/BadRequestException";
import { IStringToNumber } from "../Interfaces";
import { ArrayHelper } from "../helpers/ArrayHelper";
import { Base } from "../../entity/Base";

export class MenuService extends BaseService{

    static readonly UPDATED_ITEMS_EVENT_KEY:string = 'updated-items';

    constructor(){
        super(Menu);
        this.eventMap = {
            [BaseService.CREATED_EVENT_KEY]: 'menu-service-created-entity',
            [BaseService.DELETED_EVENT_KEY]: 'menu-service-deleted-entity',
            [BaseService.UPDATED_EVENT_KEY]: 'menu-service-updated-entity',
            [MenuService.UPDATED_ITEMS_EVENT_KEY]: 'menu-service-updated-items'
        };
    }

    async getPaged(page: number, itemsPerPage: number = 10): Promise<[Menu[], number]> {
        let repo: Repository<Menu> = getRepository(Menu);
        page = page >= 0 ? page : 0;
        let offset = itemsPerPage*page;
        let result:Menu[] = await repo.createQueryBuilder('menu')
            .leftJoinAndSelect(
                "menu.items",
                "menu_item",
                "menu_item.status = :st",{ st: Base.STATUS_ACTIVE }
            )
            .orderBy("menu_item.order", "ASC")
            .skip(offset)
            .take(itemsPerPage)
            .getMany().then().catch( (e: any) => {
                throw e;
            });
        return new Promise((resolve, reject) => resolve([result, result.length]));
    }

    async getDefault() {
        let result:Menu|undefined = await getRepository(Menu).createQueryBuilder('menu')
            .where("menu.is_default = :def", { def: 1 })
            .innerJoinAndSelect(
                "menu.items",
                "menu_item",
                "menu_item.status = :st",{ st: Base.STATUS_ACTIVE }
            )
            .orderBy("menu_item.order", "ASC")
            .getOne().then().catch( (e: any) => {
                throw e;
            });
        if (!result){
            throw new EntityNotFoundException();
        }
        return result;
    }

    async updateItems(id: number, data: any){
        interface INumberToMenuItemRequestData {
            [id:number] : {
                id?: number,
                parent: string,
                url: string,
                label: string
            }
        }
        const menuRepo: Repository<Menu> = getRepository(Menu);
        let existingMenu:Menu|undefined = await menuRepo.findOne(id);
        if (existingMenu){
            if (!data.items){
                throw new BadRequestException(["No menu items specified"]);
            }
            let fetchedExistingMenuItems:MenuItem[] = await getRepository(MenuItem).find({ where: { menu_id : id }});
            let savedItemUuids:IStringToNumber = {};
            await getManager().transaction(async (transactionalEntityManager) => {
                let itemKeys = Object.keys(data.items);
                let existingItems: INumberToMenuItemRequestData = {};
                while (Object.keys(savedItemUuids).length !== itemKeys.length){
                    for (let d in data.items){
                        if (savedItemUuids[d]){
                            continue;
                        }
                        if (data.items[d].id){
                            existingItems[data.items[d].id] = data.items[d];
                            savedItemUuids[d] = data.items[d].id;
                            continue;
                        }
                        let currentParent = data.items[d].parent;
                        let item = (new MenuItem()).assign(data.items[d]);
                        item.menu_id = existingMenu ? existingMenu.id : 0;
                        item.temporary_uuid = d;
                        if (!currentParent){
                            await transactionalEntityManager.save(item);
                        } else {
                            if (!savedItemUuids[currentParent]){
                                continue;
                            }
                            item.parent_id = savedItemUuids[currentParent];
                            await transactionalEntityManager.save(item);
                        }
                        savedItemUuids[d] = item.id;
                    }
                }
                let existingItemIds = Object.keys(existingItems);
                fetchedExistingMenuItems.forEach( async (mi:MenuItem) => {
                    if (existingItemIds.indexOf(mi.id.toString())<0){
                        await transactionalEntityManager.remove(mi);
                        return;
                    }
                    mi.assign(existingItems[mi.id]);
                    mi.parent_id = savedItemUuids[existingItems[mi.id].parent] || 0;
                    await transactionalEntityManager.save(mi);
                });
            });
            if (this.eventMap[MenuService.UPDATED_ITEMS_EVENT_KEY]){
                (Container.get("EventEmitter") as EventEmitter).emit(this.eventMap[MenuService.UPDATED_ITEMS_EVENT_KEY], existingMenu);
            }
            return savedItemUuids;
        }
        throw new EntityNotFoundException();
    }

    async setAsDefault(menuId: number){
        let menus:Menu[] = await getRepository(Menu).find({ where: [
            { id: menuId },
            { is_default: 1 }]
        });
        let newMainMenuId:number|undefined;
        await getManager().transaction(async (transactionalEntityManager: EntityManager) => {
            for (let menu of menus){
                menu.is_default = !menu.is_default;
                if (menu.is_default){
                    newMainMenuId = menu.id;
                }
                await transactionalEntityManager.save(menu);
            }
        });
        if (newMainMenuId){
            return [];
        }
        throw new EntityNotFoundException();
    }

    getSingleMenuAsTree(menuData: Menu){
        let result: Menu = (new Menu()).assign({
            name: menuData.name,
            slug: menuData.slug,
            is_default: menuData.is_default,
            status: menuData.status,
            created_at: menuData.created_at
        });
        result.id = menuData.id;
        result.items = ArrayHelper.treeify(menuData.items);
        return result;
    }

    getMenuArrayAsTree(linearMenuData: Menu[]){
        let result: Menu[] = [];
        linearMenuData.forEach( (m:Menu) => {
            result.push(this.getSingleMenuAsTree(m));
        });
        return result;
    }
}