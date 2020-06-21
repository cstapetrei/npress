import path from "path";
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
import { InjectDataInAdminPage } from "./library/middlewares/InjectDataInAdminPage";
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
import { IStringToString } from "./library/Interfaces";

export default class App {

    public app: express.Application;

    constructor(config: any) {
        let self = this;
        this.app = express();

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
            self.initRoutes();
            self.initDI();
            self.startApp(config.server_port, config.server_ip);
        })
        .catch(error => console.log(error));
    }

    private initRoutes(): void{
        this.app.use('/admin', [Auth, InjectDataInAdminPage], adminRoutes);
        this.app.use('/public', publicRoutes);
        this.app.use('*', PublicController.index);
    }

    private initSessions(secret: string): void{
        this.app.set('trust proxy', 1) // trust first proxy
        this.app.use(session({
            secret: secret,
            resave: false,
            saveUninitialized: true,
        }));
    }

    private startApp(port:number, ip:string = '127.0.0.1'): void{
        this.app.listen(port, ip, () => {
            console.log('Express server listening on port ' + port);
        });
    }

    private extendTwig(): void{
        Twig.extendFilter('theme_asset', (value, args) => {
                let settingsMap: IStringToString = Container.get('settingsMap');
                let path = "/themes/"+settingsMap.active_theme;
                if (value[0] !== '/'){
                    path += '/';
                }
                return path + value;
            }
        );
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

        this.initListeners();

        (Container.get('SettingService') as SettingService).loadSettingsIntoContainer();
    }

    private initListeners(): void{
        Container.set("SettingListener", new SettingListener());
        Container.set("PageListener", new PageListener());
        Container.set("CodeblockListener", new CodeblockListener());
    }
}