import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";
import { Base } from "../entity/Base";
import { Page } from "../entity/Page";

export class Tables1564669039537 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await this.createTables(queryRunner);
        await this.createForeignKeys(queryRunner);
        await this.mandatorySeeds(queryRunner);
        await this.runSeeds(queryRunner);
    }

    private async createTables(queryRunner: QueryRunner){
        await queryRunner.createTable(new Table({
            name: 'user',
            columns: [
                {
                    name: 'id',
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'email',
                    type: "varchar",
                    length: '255',
                    isUnique: true
                },
                {
                    name: 'password',
                    type: "varchar",
                    length: '255',
                },
                {
                    name: 'salt',
                    type: "varchar",
                    length: '255',
                },
                {
                    name: 'status',
                    type: "varchar",
                    length: '16',
                },
                {
                    name: 'created_at',
                    type: "datetime",
                    default: 'CURRENT_TIMESTAMP'
                },
                {
                    name: 'updated_at',
                    type: "datetime",
                    default: 'CURRENT_TIMESTAMP'
                }
            ]
        }), true);

        await queryRunner.createTable(new Table({
            name: 'page',
            columns: [
                {
                    name: 'id',
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'title',
                    type: "varchar",
                    length: '255',
                },
                {
                    name: 'uri',
                    type: "varchar",
                    length: '255',
                    isUnique: true
                },
                {
                    name: 'content',
                    type: "text",
                    isNullable: true
                },
                {
                    name: 'custom_css',
                    type: "text",
                    isNullable: true
                },
                {
                    name: 'custom_js',
                    type: "text",
                    isNullable: true
                },
                {
                    name: 'seo_title',
                    type: "varchar",
                    length: '255',
                    isNullable: true
                },
                {
                    name: 'seo_keywords',
                    type: "text",
                    isNullable: true
                },
                {
                    name: 'seo_description',
                    type: "text",
                    isNullable: true
                },
                {
                    name: 'seo_robots',
                    type: "varchar",
                    length: '255',
                    isNullable: true
                },
                {
                    name: 'show_comment_section',
                    type: "int",
                    length: '1',
                    default: '1'
                },
                {
                    name: 'show_comment_form',
                    type: "int",
                    length: '1',
                    default: '1'
                },
                {
                    name: 'show_sidebar',
                    type: "int",
                    length: '1',
                    default: '1'
                },
                {
                    name: 'sidebar_content',
                    type: "text",
                    isNullable: true
                },
                {
                    name: 'is_homepage',
                    type: "int",
                    length: '1',
                    default: '0'
                },
                {
                    name: 'status',
                    type: "varchar",
                    length: '16',
                },
                {
                    name: 'created_at',
                    type: "datetime",
                    default: 'CURRENT_TIMESTAMP'
                },
                {
                    name: 'updated_at',
                    type: "datetime",
                    default: 'CURRENT_TIMESTAMP'
                }
            ]
        }), true);

        await queryRunner.createTable(new Table({
            name: 'file',
            columns: [
                {
                    name: 'id',
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'name',
                    type: "varchar",
                    length: '255',
                },
                {
                    name: 'uri',
                    type: "varchar",
                    length: '255',
                    isUnique: true
                },
                {
                    name: 'type',
                    type: "varchar",
                    length: '128'
                },
                {
                    name: 'status',
                    type: "varchar",
                    length: '16',
                },
                {
                    name: 'created_at',
                    type: "datetime",
                    default: 'CURRENT_TIMESTAMP'
                },
                {
                    name: 'updated_at',
                    type: "datetime",
                    default: 'CURRENT_TIMESTAMP'
                }
            ]
        }), true);

        await queryRunner.createTable(new Table({
            name: 'menu_item',
            columns: [
                {
                    name: 'id',
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'menu_id',
                    type: "int",
                },
                {
                    name: 'parent_id',
                    type: "int",
                    default: 0
                },
                {
                    name: 'order',
                    type: "int",
                    default: 0
                },
                {
                    name: 'label',
                    type: "varchar",
                    length: '255',
                },
                {
                    name: 'slug',
                    type: "varchar",
                    length: '255',
                },
                {
                    name: 'url',
                    type: "varchar",
                    length: '255',
                },
                {
                    name: 'status',
                    type: "varchar",
                    length: '16',
                },
                {
                    name: 'created_at',
                    type: "datetime",
                    default: 'CURRENT_TIMESTAMP'
                },
                {
                    name: 'updated_at',
                    type: "datetime",
                    default: 'CURRENT_TIMESTAMP'
                }
            ]
        }), true);

        await queryRunner.createTable(new Table({
            name: 'menu',
            columns: [
                {
                    name: 'id',
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'name',
                    type: "varchar",
                    length: '255',
                },
                {
                    name: 'slug',
                    type: "varchar",
                    length: '255',
                },
                {
                    name: 'is_default',
                    type: "int",
                    length: '1',
                    default: '0'
                },
                {
                    name: 'status',
                    type: "varchar",
                    length: '16',
                },
                {
                    name: 'created_at',
                    type: "datetime",
                    default: 'CURRENT_TIMESTAMP'
                },
                {
                    name: 'updated_at',
                    type: "datetime",
                    default: 'CURRENT_TIMESTAMP'
                }
            ]
        }), true);

        await queryRunner.createTable(new Table({
            name: 'comment',
            columns: [
                {
                    name: 'id',
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'page_id',
                    type: "int",
                },
                {
                    name: 'parent_id',
                    type: "int",
                    default: 0
                },
                {
                    name: 'author_name',
                    type: "varchar",
                    length: '255',
                },
                {
                    name: 'author_email',
                    type: "varchar",
                    length: '255',
                },
                {
                    name: 'content',
                    type: "text",
                    isNullable: true
                },
                {
                    name: 'status',
                    type: "varchar",
                    length: '16',
                },
                {
                    name: 'created_at',
                    type: "datetime",
                    default: 'CURRENT_TIMESTAMP'
                },
                {
                    name: 'updated_at',
                    type: "datetime",
                    default: 'CURRENT_TIMESTAMP'
                }
            ]
        }), true);

        await queryRunner.createTable(new Table({
            name: 'setting',
            columns: [
                {
                    name: 'id',
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'key',
                    type: "varchar",
                    length: '128',
                    isUnique: true
                },
                {
                    name: 'value',
                    type: "text",
                },
                {
                    name: 'options',
                    type: "text",
                    isNullable: true
                },
                {
                    name: 'name',
                    type: "varchar",
                    length: '128',
                    isNullable: true
                },
                {
                    name: 'description',
                    type: "text",
                    isNullable: true
                },
                {
                    name: 'status',
                    type: "varchar",
                    length: '16',
                },
                {
                    name: 'input_type',
                    type: "varchar",
                    length: '64',
                    isNullable: true
                },
                {
                    name: 'created_at',
                    type: "datetime",
                    default: 'CURRENT_TIMESTAMP'
                },
                {
                    name: 'updated_at',
                    type: "datetime",
                    default: 'CURRENT_TIMESTAMP'
                }
            ]
        }), true);

        await queryRunner.createTable(new Table({
            name: 'codeblock',
            columns: [
                {
                    name: 'id',
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'name',
                    type: "varchar",
                    length: '255',
                    isUnique: true
                },
                {
                    name: 'slug',
                    type: "varchar",
                    length: '255',
                },
                {
                    name: 'content',
                    type: "text",
                    isNullable: true
                },
                {
                    name: 'status',
                    type: "varchar",
                    length: '16',
                },
                {
                    name: 'created_at',
                    type: "datetime",
                    default: 'CURRENT_TIMESTAMP'
                },
                {
                    name: 'updated_at',
                    type: "datetime",
                    default: 'CURRENT_TIMESTAMP'
                }
            ]
        }), true);
    }

    private async createForeignKeys(queryRunner: QueryRunner){
        await queryRunner.createForeignKey("comment", new TableForeignKey({
            columnNames: ["page_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "page",
            onDelete: "CASCADE"
        }));
    }

    private async mandatorySeeds(queryRunner: QueryRunner){
        await queryRunner.query("INSERT INTO `setting` (`key`, `value`, `name`, `description`, `status`, `input_type`) VALUES ('admin_email', 'admin@npress.com', 'Admin Email', 'Where to send notification emails', 'active', 'text')");
        await queryRunner.query("INSERT INTO `setting` (`key`, `value`, `name`, `description`, `status`, `input_type`) VALUES ('site_name', 'NPress', 'Site Name', 'Will be displayed in case a logo is not set', 'active', 'text')");
        await queryRunner.query("INSERT INTO `setting` (`key`, `value`, `name`, `description`, `status`, `input_type`) VALUES ('site_logo', '', 'Site Logo', 'Site Logo', 'active', 'image')");
        await queryRunner.query("INSERT INTO `setting` (`key`, `value`, `options`, `name`, `description`, `status`, `input_type`) VALUES ('active_theme', 'default', '[]', 'Active Theme', 'Active Theme', 'active', 'select')");
        await queryRunner.query("INSERT INTO `setting` (`key`, `value`, `name`, `description`, `status`, `input_type`) VALUES ('recaptcha_enabled', '', 'Recaptcha Enabled', 'Recaptcha Enabled', 'active', 'checkbox')");
        await queryRunner.query("INSERT INTO `setting` (`key`, `value`, `name`, `description`, `status`, `input_type`) VALUES ('recaptcha_site_key', '', 'Recaptcha Site Key', 'Recaptcha Site Key', 'active', 'text')");
        await queryRunner.query("INSERT INTO `setting` (`key`, `value`, `name`, `description`, `status`, `input_type`) VALUES ('google_analytics_script', '', 'Google Analytics Script', 'Paste the code snippet here', 'active', 'textarea')");
        await queryRunner.query("INSERT INTO `setting` (`key`, `value`, `name`, `description`, `status`, `input_type`) VALUES ('recaptcha_secret_key', '', 'Recaptcha Secret Key', 'Recaptcha Secret Key', 'active', 'text')");
        await queryRunner.query("INSERT INTO `setting` (`key`, `value`, `options`, `name`, `description`, `status`, `input_type`) VALUES ('navbar_layout', 'logo-left-menu-right',  '[{\"label\": \"Logo left, menu right\", \"value\": \"logo-left-menu-right\"},{\"label\": \"Logo right, menu left\", \"value\": \"logo-right-menu-left\"}]', 'Navbar layout', 'Navbar layout', 'active', 'select')");
        await queryRunner.query("INSERT INTO `setting` (`key`, `value`, `options`, `name`, `description`, `status`, `input_type`) VALUES ('site_width', 'container', '[{\"label\": \"Full width\", \"value\": \"container-fluid\"},{\"label\": \"Boxed\", \"value\": \"container\"}]', 'Site width', 'Full width or boxed', 'active', 'select')");
    }

    private async runSeeds(queryRunner: QueryRunner){
        //password for admin@npress.com = 123123
        await queryRunner.query("INSERT INTO user (email,password,salt,status) VALUES('admin@npress.com', 'd21a3ebbd9dcd4af4003b2121615b056d2e1adcbd163a61284dff7fc1b0850d68b81e1ed2f897d61d4f74e9a7b481993b6449386d7ca9f46606e49e55a472877', '90136f0e500493e216fc27b097c79055', '"+Base.STATUS_ACTIVE+"')");
        await queryRunner.query("INSERT INTO page (title,uri,content,status,is_homepage) VALUES('Sample page', '/sample-page', '<h2>Sample page h2</h2><h3>Sample page h3</h3><p>Sample page first paragraph</p>[[my-first-code-block]]', '"+Page.STATUS_ACTIVE+"',1)");
        await queryRunner.query("INSERT INTO page (title,uri,content,status) VALUES('Another sample page', '/another-sample-page', '<h2>Another sample page h2</h2><h3>Another sample page h3</h3><p>Another sample page first paragraph</p>', '"+Page.STATUS_ACTIVE+"')");
        await queryRunner.query("INSERT INTO comment (page_id,parent_id,author_name,author_email,content,status) VALUES(1, 0,'Comment title','comment_author@npress.com','My first comment', '"+Base.STATUS_ACTIVE+"')");
        await queryRunner.query("INSERT INTO menu (name,slug,is_default,status) VALUES('My First Menu', 'first-menu',1,'"+Base.STATUS_ACTIVE+"')");
        await queryRunner.query("INSERT INTO menu_item (`menu_id`, `parent_id`, `order`, `label`, `slug`, `url`, `status`) VALUES (1, 0, 0, 'Sample page', 'sample-page', '/sample-page', '"+Base.STATUS_ACTIVE+"')");
        await queryRunner.query("INSERT INTO menu_item (`menu_id`, `parent_id`, `order`, `label`, `slug`, `url`, `status`) VALUES (1, 1, 0, 'Another sample page', 'another-sample-page', '/another-sample-page', '"+Base.STATUS_ACTIVE+"')");
        await queryRunner.query("INSERT INTO codeblock (`name`, `slug`, `content`, `status`) VALUES ('My first code block', 'my-first-code-block', '<p>My first code block content</p>', 'active')");

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("user");
        await queryRunner.dropTable("page");
        await queryRunner.dropTable("file");
        await queryRunner.dropTable("comment");
        await queryRunner.dropTable("menu");
        await queryRunner.dropTable("menu_item");
        await queryRunner.dropTable("setting");
        await queryRunner.dropTable("codeblock");
    }
}
