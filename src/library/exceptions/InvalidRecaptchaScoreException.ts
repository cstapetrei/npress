export class InvalidRecaptchaScoreException extends Error{
    constructor (){
        super();
        this.message = "Invalid recaptcha score";
    }
}