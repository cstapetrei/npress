import { Response } from "express";
import { Base } from "../../entity/Base";
import { ITree, IStringToString } from "../Interfaces";

export const CountHeadersResponse = ( items: Base[]|ITree[]|IStringToString[], count: number, res: Response ) => {
    res.set('X-Item-Total-Count', count.toString());
    res.set('X-Item-Count', items.length.toString());
    res.json(items || []);
};