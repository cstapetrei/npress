export class EntityNotCreatedException extends Error{
    constructor (){
        super();
        this.message = "Not created";
    }
}