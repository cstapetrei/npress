export class EntityNotFoundException extends Error{
    constructor (){
        super();
        this.message = "Not found";
    }
}