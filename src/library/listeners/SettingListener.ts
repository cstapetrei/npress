import Container from "typedi";
import { SettingService } from "../services/SettingService";
import { BaseListener } from "./BaseListener";

export class SettingListener extends BaseListener{

    private service: SettingService;

    constructor(){
        super();
        this.service = Container.get("SettingService") as SettingService;

        this.attachEvents();
    }

    private attachEvents(){
        this.eventEmitter.addListener(this.service.getEventString(SettingService.UPDATED_EVENT_KEY), this.onUpdatedSetting.bind(this));
        this.eventEmitter.addListener(this.service.getEventString(SettingService.UPDATED_ALL_EVENT_KEY), this.onUpdatedSetting.bind(this));
    }

    onUpdatedSetting(event:Event){
        this.service.loadSettingsIntoContainer();
    }
}