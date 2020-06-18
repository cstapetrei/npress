import Container from "typedi";
import { BaseListener } from "./BaseListener";
import { CodeblockService } from "../services/CodeblockService";

export class CodeblockListener extends BaseListener{

    private service: CodeblockService;

    constructor(){
        super();
        this.service = Container.get("CodeblockService") as CodeblockService;

        this.attachEvents();
    }

    private attachEvents(){
    }

    onUpdatedCodeblock(event:Event){
    }
}