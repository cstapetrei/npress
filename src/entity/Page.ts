import { Entity, Column, BeforeInsert } from "typeorm";
import { Base } from "./Base";
import { StringHelper } from "../library/helpers/StringHelper";
import { IsNotEmpty } from "class-validator";
import { IsUnique } from "../library/decorators/validation/IsUnique";
import { IsRelativeOrAbsoluteUrl } from "../library/decorators/validation/IsRelativeOrAbsoluteUrl";

@Entity()
export class Page extends Base{

    static readonly STATUS_DRAFT = 'draft';

    @Column('varchar', { length: 255 })
    @IsNotEmpty({
        message: 'Title must not be empty'
    })
    title: string;

    @Column('varchar', { length: 255, unique: true })
    @IsRelativeOrAbsoluteUrl()
    @IsUnique()
    uri: string;

    @Column('text')
    content: string;

    @Column('text')
    seo_title: string;

    @Column('text')
    seo_description: string;

    @Column('text')
    seo_keywords: string;

    @Column('text')
    seo_robots: string;

    @Column('text')
    custom_css: string;

    @Column('text')
    custom_js: string;

    @Column('int')
    show_comment_section: boolean;

    @Column('int')
    show_comment_form: boolean;

    @Column('int')
    show_sidebar: boolean;

    @Column('text')
    sidebar_content: string;

    @Column('int')
    is_homepage: boolean;

    @Column('int')
    header_full_width: boolean;

    @Column('text')
    header_content: string;

    assign(requestBody: Partial<Page>): Page {
        super.assign(requestBody);

        this.title = requestBody.title || '';
        this.uri = requestBody.uri ? requestBody.uri : StringHelper.slugify(this.title);
        this.content = requestBody.content || '';
        this.custom_css = requestBody.custom_css || '';
        this.custom_js = requestBody.custom_js || '';
        this.seo_title = requestBody.seo_title || '';
        this.seo_description = requestBody.seo_description || '';
        this.seo_keywords = requestBody.seo_keywords || '';
        this.seo_robots = requestBody.seo_robots || '';
        this.show_comment_section = requestBody.show_comment_section || false;
        this.show_comment_form = requestBody.show_comment_form || false;
        this.show_sidebar = requestBody.show_sidebar || false;
        this.sidebar_content = requestBody.sidebar_content || '';
        this.header_full_width = requestBody.header_full_width || false;
        this.header_content = requestBody.header_content || '';

        this.uri = this.uri[0] !== '/' ? '/'+this.uri : this.uri;
        return this;
    }

    @BeforeInsert()
    setData(){
        this.status = Page.STATUS_DRAFT;
        this.is_homepage = false;
    }
}