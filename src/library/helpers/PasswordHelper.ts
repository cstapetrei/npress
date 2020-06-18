import crypto from "crypto";

export class PasswordHelper{
    public static hashString(str:string, salt:string){
        let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
        hash.update(str);
        return hash.digest('hex');
    }
}