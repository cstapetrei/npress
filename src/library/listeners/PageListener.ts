import Container from "typedi";
import { Repository, getRepository, getManager, EntityManager } from "typeorm";
import { BaseListener } from "./BaseListener";
import { PageService } from "../services/PageService";
import { BaseService } from "../services/BaseService";
import { Page } from "../../entity/Page";
import { Base } from "../../entity/Base";

export class PageListener extends BaseListener{

    private service: PageService;

    constructor(){
        super();
        this.service = Container.get("PageService") as PageService;

        this.attachEvents();
    }

    private attachEvents(){
        this.eventEmitter.addListener(this.service.getEventString(BaseService.UPDATED_EVENT_KEY), this.onPageUpdated.bind(this));
    }

    async onPageUpdated(event:Event){
        // console.log('Page updated', event);
    }
}