import App from "./src/app";
import dbConfig from "./src/config/database";
import generalConfig from "./src/config/general";
import envConfig from "./env";
import Container from "typedi";
import Logger from "./src/library/Logger";

let args:any = {};
process.argv.forEach((val, index) => {
    if (index <= 1){
        return;
    }
    let currentArg = val.split('=');
    if (currentArg.length == 2){
        args[currentArg[0]] = currentArg[1];
    }
});

process.env = Object.assign(process.env, dbConfig, generalConfig, envConfig);
process.env.NODE_ENV = process.env.NODE_ENV || args.NODE_ENV || envConfig.env || generalConfig.env || 'development';

process.on('unhandledRejection', (err: {} | null | undefined, promise) => {
    console.log('Unhandled Rejection at:', err, promise)
    if (process.env.NODE_ENV === 'production'){
        (Container.get("Logger") as Logger).error(""+err);
    }
});

process.on('uncaughtException', (err:Error) => {
    console.error('Uncaught exception', err);
    if (process.env.NODE_ENV === 'production'){
        (Container.get("Logger") as Logger).error(""+err);
    }
});

if (process.env.NODE_ENV === 'development'){
    const gulp = require('gulp');
    require("./gulp_tasks/copy-templates")();
    require("./gulp_tasks/copy-theme-assets")();
    gulp.task('copy-js-templates')();
    gulp.task('copy-theme-assets')();
}
new App(process.env);