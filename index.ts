import { Client, ClientOptions, InteractionType, Routes, REST, GatewayIntentBits} from "discord.js";
// import * as config from "./config.json";
import { commands } from "./commands/init";
import { sendMessage } from "./commands/tools/cumples/tools"
const clientOptions: ClientOptions = {
	intents: [ GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences]
}

const client = new Client(clientOptions);

client.on("interactionCreate", async (interact)=>{
	if(!interact.isChatInputCommand()) return;
	
	const command = commands.find(command => command.data.name === interact.commandName);
	console.log("Command: ", command?.data.name);
	await command?.execute(interact);
});

client.once("ready", ()=> {
	console.log(`${client.user?.username} is ready!`.cyan)
	sendMessage(client)
	setInterval(() => {sendMessage(client)}, 2147483647)
})

client.login(process.env.BOT_TOKEN);