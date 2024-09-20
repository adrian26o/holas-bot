import {readdirSync, existsSync, statSync, lstatSync} from "fs"
import {SlashCommandBuilder, SlashCommandSubcommandBuilder} from "discord.js"
import * as path from "path"
import {Color} from "colors"
var color = require("colors");

const rootPath = __dirname

const files: {"filename": string, "path": string}[] = []

function readDirsRec(dirname: string) {
	const dirContent = readdirSync(dirname);

	const ext = path.extname(__filename);

	const dirFiles = dirContent.filter(v => v.endsWith(ext)).map(v => {return {"filename": v, "path": dirname}});
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