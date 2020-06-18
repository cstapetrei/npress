import { ITree, NumberToITree } from "../Interfaces";

export class ArrayHelper{
    public static treeify(list: ITree[]){
        if (!list.length){
            return [];
        }
        let tree:ITree[] = [],
            lookup:NumberToITree = {};
        list.forEach((obj:ITree) => {
            lookup[obj.id] = obj;
            obj.children = [];
        });
        list.forEach((obj:ITree) =>{
            if (obj.parent_id) {
                lookup[obj.parent_id].children.push(obj);
            } else {
                tree.push(obj);
            }
        });
        return tree;
    }
}