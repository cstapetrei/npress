import Twig from "twig";
import { IStringToAny } from "../Interfaces";

export class StringHelper {

    static readonly CODEBLOCKS_REGEX:RegExp = /\[\[(?<code>[\s\w\=\"\"\'\'-]+)\]\]/ig;

    public static slugify(string: string, spacePlaceholder: string = '-'): string {
        if (!string) {
            return '';
        }
        const a = 'àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;'
        const b = 'aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------'
        const p = new RegExp(a.split('').join('|'), 'g')

        string = string.toString().toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
            .replace(/&/g, '-and-') // Replace & with 'and'
            .replace(/[^\w\-]+/g, '') // Remove all non-word characters
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, ''); // Trim - from end of text
        return string.replace(/-+/g, spacePlaceholder);
    }

    public static parseForCodeblocks(str: string, filter: string = '*'): Array<IStringToAny>{
        let result: Array<IStringToAny> = [];
        if (!str){
            return result;
        }
        let matchedCodeblocks:Array<string>|null = str.match(this.CODEBLOCKS_REGEX);
        if (matchedCodeblocks){
            for(let ms of matchedCodeblocks) {
                let resultObj:IStringToAny = {
                    code: "",
                    match: ms,
                    properties: {}
                };
                let props:Array<string> = ms.replace('[[','').replace(']]','').trim().split(' ');
                for (let p of props){
                    let [attribute, value]:any = p.split('=');
                    if (!resultObj.code && !value){
                        resultObj.code = p;
                        continue;
                    }
                    resultObj.properties[attribute] = value ? value.replace(/["']+/g, '') : '';
                }
                if (filter === '*' || resultObj.code === filter){
                    result.push(resultObj);
                }
            }
        }
        return result;
    }

    public static replaceCodeblocks(str: string, codeblockArray: Array<IStringToAny>): string{
        if (!str){
            return '';
        }
        for (let s of codeblockArray.values()){
            if (!(s as IStringToAny).html){
                continue;
            }
            let html = Twig.twig({ data: (s as IStringToAny).html }).render(s.properties)
            str = str.replace((s as IStringToAny)['match'], html);
        }
        let matchedCodeblocks:Array<string>|null = str.match(this.CODEBLOCKS_REGEX);
        if (matchedCodeblocks){
            for(let ms of matchedCodeblocks) {
                str = str.replace(ms, '');
            }
        }
        return str;
    }
}