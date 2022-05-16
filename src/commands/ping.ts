import {Message,MessageEmbed} from "discord.js";
import {Command} from "./class"
import {comp} from "./tools";

function ping(msg:Message) {
    if(comp(msg,"ping")) return;
    const embed = new MessageEmbed({
        description:`Latency: ${Date.now() - msg.createdTimestamp}ms\nApi Latency: ${Math.round(msg.client.ws.ping)}ms`,
        timestamp:Date.now(),
        color:[245,166,35]
    })

    msg.reply({
        embeds:[embed]
    })
}

const command = new Command("ping",ping);
export {command}
