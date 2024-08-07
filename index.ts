import { Client, ClientOptions, InteractionType, Routes, REST, GatewayIntentBits} from "discord.js";
import * as config from "./config.json";
import { commands } from "./commands/init";
import { sendMessage } from "./commands/tools/cumples/tools"
const clientOptions: ClientOptions = {
	intents: [ GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences]
}

const client = new Client(clientOptions);

client.on("interactionCreate", async (interact)=>{
	if(!interact.isChatInputCommand()) return;

	const command = commands.filter(v => v.data.name === interact.commandName);

	if(command.length <= 0) return;

	await command[0].execute(interact);
});

client.once("ready", ()=> {
	console.log(`${client.user?.username} is ready!`.cyan)
	sendMessage(client)
	setInterval(() => {sendMessage(client)}, 2147483647)
})

client.login(config.token);