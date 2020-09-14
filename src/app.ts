import path from "path";
import fs from "fs";
import events from "events";
import Twig from "twig";
import express from "express";
import { useContainer, createConnection, Connection } from "typeorm";
import adminRoutes from "./routes/Admin";
import publicRoutes from "./routes/Public";
import { Container } from "typedi";
import { User } from "./entity/User";
import { Auth } from "./library/middlewares/Auth";
import session  from "express-session";
import { Page } from "./entity/Page";
import { PublicController } from "./controllers/PublicController";
import { File } from "./entity/File";
import { Comment } from "./entity/Comment";
import Logger from "./library/Logger";
import { FileService } from "./library/services/FileService";
import { PageService } from "./library/services/PageService";
import { UserService } from "./library/services/UserService";
import { MenuService } from "./library/services/MenuService";
import { Menu } from "./entity/Menu";
import { CommentService } from "./library/services/CommentService";
import { MenuItem } from "./entity/MenuItem";
import { SettingListener } from "./library/listeners/SettingListener";
import { SettingService } from "./library/services/SettingService";
import { Setting } from "./entity/Setting";
import { CodeblockService } from "./library/services/CodeblockService";
import { PageListener } from "./library/listeners/PageListener";
import { CodeblockListener } from "./library/listeners/CodeblockListener";
import { Codeblock } from "./entity/Codeblock";
import { IStringToString, AdminMenu } from "./library/Interfaces";

export default class App {

    public app: express.Application;
    public acl: any;
    private adminMenu: Map<string, AdminMenu>;

    constructor(config: any) {
        let self = this;
        this.app = express();
        this.acl = require('express-acl');

        Container.set('config', config);
        useContainer(Container);

        createConnection({
            name: config['name'],
            type: config['type'],
            host: config['host'],
            port: parseInt(config['port']),
            username: config['username'],
            password: config['password'],
            database: config['database'],
            entities: [ User, Page, File, Menu, Comment, MenuItem, Setting, Codeblock ],
        })
        .then((connection: Connection) => {
            console.log("ORM connection success");
            self.extendTwig();
            self.initViews();
            self.initStaticAssets();
            self.initMainMiddlewares();
            self.initSessions(config.session_secret);
            self.initGlobals(config);
            self.initAcl();
            self.initAdminMenu();
            self.initRoutes();
            self.initDI();
            self.startApp(config.server_port, config.server_ip);
        })
        .catch(error => console.log(error));
    }

    private initRoutes(): void{
        this.app.use('/admin', [Auth, this.acl.authorize.unless({ path: ['/admin/login'] })], adminRoutes);
        this.app.use('/public', publicRoutes);
        this.app.use('*', PublicController.index);
    }

    private initAcl():void{
        let aclJson = [];
        try{
            let rawdata:any = fs.readFileSync('nacl.json');
            aclJson = JSON.parse(rawdata);
        } catch(e){
            aclJson = [];
        }

        Container.set("Acl", aclJson);
        Container.set("AvailableAclRoles", aclJson.map( (o:any) => o.group ));
        this.acl.config({ rules: aclJson, defaultRole: 'guest', decodedObjectName: 'session' });
    }

    private initAdminMenu():void{
        this.adminMenu = new Map<string, AdminMenu>();
        this.adminMenu.set("/admin/settings", { url: "/admin/settings", label: "Settings", icon: "fas fa-cogs", tooltip: "Settings" });
        this.adminMenu.set("/admin/users", { url: "/admin/users", label: "Users", icon: "fas fa-users", tooltip: "Users" });
        this.adminMenu.set("/admin/pages", { url: "/admin/pages", label: "Pages", icon: "fas fa-copy", tooltip: "Pages" });
        this.adminMenu.set("/admin/files", { url: "/admin/files", label: "Files", icon: "fas fa-folder-open", tooltip: "Files" });
        this.adminMenu.set("/admin/comments", { url: "/admin/comments", label: "Comments", icon: "fas fa-comments", tooltip: "Comments" });
        this.adminMenu.set("/admin/menus", { url: "/admin/menus", label: "Menus", icon: "fas fa-ellipsis-h", tooltip: "Menus" });
        this.adminMenu.set("/admin/codeblocks", { url: "/admin/codeblocks", label: "Codeblocks", icon: "fas fa-boxes", tooltip: "Codeblocks" });
        this.adminMenu.set("/admin/themes", { url: "/admin/themes", label: "Themes", icon: "fas fa-paint-brush", tooltip: "Themes" });
    }

    private initSessions(secret: string): void{
        this.app.set('trust proxy', 1) // trust first proxy
        this.app.use(session({
            secret: secret,
            resave: false,
            saveUninitialized: true,
        }));
    }

    private initGlobals(config: any): void{
        if (config.env === 'development' && parseInt(config.disableLogin)){
            this.app.set('is_logged_in', 1);
        }
    }

    private startApp(port:number, ip:string = '127.0.0.1'): void{
        this.app.listen(port, ip, () => {
            console.log('Express server listening on port ' + port);
        });
    }

    private extendTwig(): void{
        let self = this;

        Twig.extendFilter('theme_asset', (value, args) => {
                let settingsMap: IStringToString = Container.get('settingsMap');
                let path = "/themes/"+settingsMap.active_theme;
                if (value[0] !== '/'){
                    path += '/';
                }
                return path + value;
            }
        );
        Twig.extendFunction("settings", function(value) {
            return (Container.get('settingsMap') as IStringToString)[value] || '';
        });

        Twig.extendFunction("is_logged_in", function(value) {
            return self.app.get('is_logged_in');
        });
    }
    private initViews(): void{
        let viewsPath = path.join(__dirname,'views');
        this.app.set('view engine', 'twig');
        this.app.set('views', viewsPath);
    }

    private initStaticAssets(): void{
        this.app.use(express.static(path.join(__dirname,'static')));
    }

    private initMainMiddlewares(){
        // support application/json type post data
        this.app.use(express.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(express.urlencoded({ extended: false }));
    }

    private initDI(): void{
        Container.set("FileService", new FileService());
        Container.set("PageService", new PageService());
        Container.set("UserService", new UserService());
        Container.set("MenuService", new MenuService());
        Container.set("CommentService", new CommentService());
        Container.set("SettingService", new SettingService());
        Container.set("CodeblockService", new CodeblockService());
        Container.set("EventEmitter", new events.EventEmitter());
        Container.set("App", this.app);
        Container.set("Logger", new Logger());
        Container.set("AllAdminRoutesMap", this.adminMenu);
        Container.set("AdminRoutesArray", [...this.adminMenu.values()]);

        this.initListeners();

        (Container.get('SettingService') as SettingService).loadSettingsIntoContainer();
    }

    private initListeners(): void{
        Container.set("SettingListener", new SettingListener());
        Container.set("PageListener", new PageListener());
        Container.set("CodeblockListener", new CodeblockListener());
    }
}