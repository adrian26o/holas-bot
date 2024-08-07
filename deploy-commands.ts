import {REST, Routes} from "discord.js"
import * as config from "./config.json"
import { commands } from "./commands/init";

const rest = new REST().setToken(config.token);


/*
commands.forEach(v => {
	try {
		console.log(v.data.toJSON())
	}
	catch (no) {
		console.log(no)
	}
}
)
*/

const commandDataList = commands.map(v => v.data.toJSON());


const args = process.argv.slice(2);
if(args.some(v => v === "--test")) {
	rest.put(Routes.applicationGuildCommands(config.user.id, config.testGuild.id), {
		body: commandDataList
	});
} else {
	rest.put(Routes.applicationCommands(config.user.id), {
		body: commandDataList
	})
}
