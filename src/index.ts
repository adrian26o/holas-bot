import {Client, Intents, ClientOptions} from "discord.js";
import {commands} from "./commands/init";
import {Command} from "./commands/class";
import {int_syt} from "./interactions/search_youtube";

const options: ClientOptions = {
	intents: [
	Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILDS
	]
}

const client = new Client(options);

client.on("ready",()=>{
	if(client.user == null) return;
    console.log("Holas!\nBot is ready!")
    console.log(`Username: ${client.user.username}#${client.user.discriminator}`)
})


client.on("messageCreate",(ctx)=>{
    commands.forEach((i:Command)=>{
		i.exec(ctx);
    })
})


client.on("interactionCreate",(inte)=>{
    int_syt(inte)
})

client.login(process.env.botToken)
