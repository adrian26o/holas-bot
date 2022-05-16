import {MessageEmbed,Message} from "discord.js";
import {comp,input_err,getArgs} from "./tools";
import {Command} from "./class"

function enlarge(msg: Message) {
    if(comp(msg,["enlarge","e"])) return;
    const embed = new MessageEmbed();
    const args = getArgs(msg);

    if(args.length < 1) {
        input_err(msg,"Emoji no provided");
        return;
    }

    let EMOJI_ID = args[0].split(":")[2]
    
    if (EMOJI_ID != undefined) {
        EMOJI_ID = EMOJI_ID.slice(0,EMOJI_ID.length-1);
    }

	// @ts-ignore
    const emoji = msg.guild.emojis.cache.find(e => args[0] == `<:${e.name}:${e.id}>`) || `https://cdn.discordapp.com/emojis/${EMOJI_ID}.png`

    if (! emoji || typeof(EMOJI_ID) === "undefined") {
        input_err(msg, "Emoji no found")
        return
    }
    
    if (typeof(emoji) == "string") {
        embed.setImage(emoji)
    }
    else {
        embed.setImage(emoji.url)
    }

    embed.setTimestamp(Date.now())

    msg.reply({embeds:[embed]});
}

const command = new Command("enlarge", enlarge);
export {command}
