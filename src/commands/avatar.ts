import {MessageEmbed,Message,User} from "discord.js";
import {comp,getUser} from "./tools";
import {Command} from "./class";

function avatar(msg: Message) {
    if(comp(msg,["avatar","av"])) return;

    const user:User = getUser(msg) || msg.author;

    const embed:MessageEmbed = new MessageEmbed();
    embed.setTimestamp(Date.now());

	// @ts-ignore
    embed.setImage(user.avatarURL({format:'png'||'gif',size:1024}));

    msg.reply({embeds:[embed]})
}

const command = new Command("avatar",avatar)
export {command};
