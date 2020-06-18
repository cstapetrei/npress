import { Response } from "express";
import { Base } from "../../entity/Base";
import { ITree } from "../Interfaces";

export const CountHeadersResponse = ( items: Base[]|ITree[], count: number, res: Response ) => {
    res.set('X-Item-Total-Count', count.toString());
    res.set('X-Item-Count', items.length.toString());
    res.json(items || []);
};