export interface AdminMenu {
    url: string,
    label: string,
    active: boolean,
    icon?: string,
    tooltip?: string
}

export interface IStringToNumber {
    [str:string] : number
}

export interface IStringToAny {
    [str:string] : any
}

export interface IStringToString {
    [str:string] : string | undefined
}

export interface INumberToNumber {
    [num:number] : number
}

export interface INumberToObject {
    [id:number] : Object
}

export interface ITree{
    id: number;
    parent_id: number;
    children: ITree[];
}

export interface NumberToITree{
    [num:number] : ITree
}