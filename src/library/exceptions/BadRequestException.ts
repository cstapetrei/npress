export class BadRequestException extends Error{

    private readonly errors: Array<Object>;

    constructor (errorArray : Array<Object>){
        super();
        this.errors = errorArray;
    }

    public getErrors():Array<Object>{
        return this.errors;
    }
}