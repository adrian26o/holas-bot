import {readdirSync, existsSync, statSync, lstatSync} from "fs"
import {SlashCommandBuilder, SlashCommandSubcommandBuilder} from "discord.js"
import * as path from "path"
import {Color} from "colors"
var color = require("colors");

const rootPath = __dirname
// const rootDir = readdirSync(rootPath);


const files: {"filename": string, "path": string}[] = []
/*
const files = rootDir.filter(v => v.endsWith(".ts")).map(v => {return {"filename": v, "path": rootPath}});
const dirs = root.filter(v => statSync(path.join(rootPath, v)).isDirectory());
*/

// console.log(root)
// console.log(files)
// console.log(dirs)

// let wao = require("./say");
// console.log(wao.c)

/*
function readDirs(root: string, dirs: string[]) {
	console.log(root)
	dirs.forEach(file => {
		console.log(file)
		const actualFolder = readdirSync(path.join(root, file))

		console.log(actualFolder)

		console.log(path.join(root, file))

		actualFolder.filter(v => v.endsWith(".ts")).forEach(
			_file => files.push({"filename": _file, "path": _file})
		)
		actualFolder.filter(v => statSync(path.join(root, file, v)).isDirectory()).forEach(
			folder => {
				console.log(path.join(root, file, folder))
				readDirs(
					path.join(root, file, folder),
					readdirSync(path.join(root, file, folder)).filter(v => statSync(path.join(root, file, folder, v)).isDirectory())
				)
			}
		)
	})
}
*/

function readDirsRec(dirname: string) {
	const dirContent = readdirSync(dirname);
	const dirFiles = dirContent.filter(v => v.endsWith(".ts")).map(v => {return {"filename": v, "path": dirname}});
	const dirs = dirContent.filter(v => statSync(path.join(dirname, v)).isDirectory());

	dirFiles.forEach(v => files.push(v))
	dirs.forEach(v => readDirsRec(path.join(dirname,v)))
}

readDirsRec(rootPath)

type commandModule =  {
	c: {
		data:SlashCommandBuilder | SlashCommandSubcommandBuilder,
		execute: Function,
		subcommand: boolean | null
	}
}

const commandList: Array<commandModule["c"]> = [];

files.forEach(v => {
	try {
		if(v.filename.split(".")[0] === "init") return;

		let command: commandModule = require(
			path.join(v.path, v.filename.split(".")[0])
		);

		if(!command.c || ! command.c.data || ! command.c.execute) {
			console.warn("[WARNING] ".red + `${v.filename} not loaded, isn't a command module`.red);
			return;
		}

		if(command.c.subcommand) return;

		commandList.push(command.c);
	}
	catch (err) {
		console.error(`Fail loading "${v.filename.split(".")[0]}" command`)
		console.error(err)
	}
})

export let commands = commandList;