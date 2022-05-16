import * as fs from "fs";
import * as path from "path";
import {Command} from "./class"

let commands:Array<Command> = [];

fs.readdir(__dirname,undefined,(err,files)=>{
	if(err) {
		console.error(err);
		return;
	}
    files.forEach((file)=>{
		const filePath = __dirname+path.posix.sep+file;
		const fileName = path.basename(filePath).split(".")[0];
        if(filePath==__filename) return;
        if(fileName=="class") return;
        if(fileName=="tools") return;

        const command = require(filePath);
		commands.push(command.command);
    })
})


export {commands}
