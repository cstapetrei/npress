import path from "path";
import fs from "fs";

export default class Logger{
    private outputPath: string;
    private outputStream: fs.WriteStream;
    constructor(outputPath: string = ''){
        this.outputPath = outputPath || path.join(__dirname,'..','logs','error.log');
        fs.open(this.outputPath, 'wx', (err, fd) => {
            if (err) {
                if (err.code === 'EEXIST') {
                    this.outputStream = fs.createWriteStream(this.outputPath, {flags:'a'});
                    return;
                }
                throw err;
            }
            this.outputStream = fs.createWriteStream(this.outputPath, {flags:'a'});
            this.outputStream.on('error', function (err) {
                console.log(err);
            });
        });
    }
    info(message:string){
        this.outputStream.write('[INFO]: ' + message + '\n');
        this.outputStream.end();
    }
    error(message:string){
        this.outputStream.write('[ERROR]: ' + message + '\n');
        this.outputStream.end();
    }
}