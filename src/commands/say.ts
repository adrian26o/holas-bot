import {Message} from "discord.js";
import {comp,input_err} from "./tools";
import {Command} from "./class"

async function say(msg: Message) {
    if(comp(msg,"say")) return;
    if(msg.author.bot) return;

    if(msg.content.split(" ").slice(1).join(" ").trim().length == 0) {
        input_err(msg,"Message content is empty");
        return;
    }
    if(msg.content.includes("@everyone") || msg.content.includes("@here")) {
        input_err(msg,"Message contains here or everyone mention")
        return;
    }

	// @ts-ignore
    const roles = msg.guild.roles.cache.map(role => role)

    const mroles = roles.filter(role => msg.content.includes(`<@&${role.id}>`))
    if(mroles.length > 0) {
	    input_err(msg,"You can't mention a guild role")
	    return;
    }

    let slice_start = 1;
	// @ts-ignore
    if(msg.content.split(" ").slice(0,2).join(" ")==`<@!${msg.client.user.id}> say`||msg.content.split(" ").slice(0,2).join(" ")==`<@${msg.client.user.id}> say`) slice_start +=1;

    msg.channel.send(msg.content.split(" ").slice(slice_start).join(" "));
    if(msg.deletable) await msg.delete();
}

const command = new Command("say",say);

export {command};
