import {REST, Routes} from "discord.js"
// import * as config from "./config.json"
import { commands } from "./commands/init";

const rest = new REST().setToken(process.env.BOT_TOKEN || "");


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
const guildID = "796962500373250069" // Server ID of tests
const userID = "796797535208341544" // Bot  ID

const args = process.argv.slice(2);
if(args.some(v => v === "--test")) {
	rest.put(Routes.applicationGuildCommands("", ""), {
		body: commandDataList
	});
} else {
	rest.put(Routes.applicationCommands(""), {
		body: commandDataList
	})
}
