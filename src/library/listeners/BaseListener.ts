import Container from "typedi";
import { EventEmitter } from "events";

export class BaseListener{

    protected eventEmitter: EventEmitter;

    constructor(){
        this.eventEmitter =  Container.get("EventEmitter") as EventEmitter;
    }
}