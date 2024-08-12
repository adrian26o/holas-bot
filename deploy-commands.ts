import { REST, Routes } from "discord.js"
import { commands } from "./commands/init";
import { RESTGetCurrentApplicationResult } from "discord-api-types/v10";

if(process.env.BOT_TOKEN == null) throw new TypeError("BOT_TOKEN cannot be null");

const serializedCommands = commands.map(v => v.data.toJSON());
const rest = new REST().setToken(process.env.BOT_TOKEN);

rest.get(Routes.currentApplication()).then((value: unknown) => {
	const application = value as RESTGetCurrentApplicationResult;
	
	const index = process.argv.findIndex(argument => argument === "--guild") + 1;
	const argument = index != 0 ? process.argv.at(index) : null;
	
	if(argument != null) {
		rest.put(Routes.applicationGuildCommands(application.id, argument), {
			body: serializedCommands
		});
		return;
	}
	else if(index != 0) {
		throw new Error("--guild must be followed by the guild ID.");
	}

	rest.put(Routes.applicationCommands(application.id), {
		body: serializedCommands
	});
}).catch( reason => {
	throw new Error("BOT_TOKEN must be a valid token");
});
