import dbConfig from "./src/config/database";
import generalConfig from "./src/config/general";
import envConfig from "./env";
import { User } from "./src/entity/User";
import { Page } from "./src/entity/Page";
import { Menu } from "./src/entity/Menu";
import { File } from "./src/entity/File";
import { Comment } from "./src/entity/Comment";
import { MenuItem } from "./src/entity/MenuItem";
import { Setting } from "./src/entity/Setting";

const migrationsCfg = {
    entities: [ User, Page, File, Menu, Comment, MenuItem, Setting ],
    migrations: ['src/migrations/*.ts'],
    cli: {
        migrationsDir: 'src/migrations',
        entitiesDir: "src/entity",
    }
};

export = Object.assign({}, dbConfig, generalConfig, envConfig, migrationsCfg);