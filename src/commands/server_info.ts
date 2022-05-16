import {Message,MessageEmbed} from "discord.js";
import {comp} from "./tools";
import {Command} from "./class";

function server_info(msg: Message) { 
    if(comp(msg,["svinfo","serverinfo","guild","guildinfo","svinf"])) return;
	if(
		msg.client.user == null ||
		msg.guild == null
	  ) return;

    const embed = new MessageEmbed({
        footer:{
            text:msg.client.user.username,
			//@ts-ignore
            iconURL:msg.client.user.avatarURL()
        },
			//@ts-ignore
        timestamp:Date.now(),
			//@ts-ignore
        title:`${msg.guild.name}`,
			//@ts-ignore
        color:[245,166,35],
        thumbnail:{
			//@ts-ignore
            url:msg.guild.iconURL()
        }
    })

	// @ts-ignore
    if(msg.guild.banner) embed.setImage(msg.guild.bannerURL());
    embed.addField("ID:",msg.guild.id,false);
    embed.addField("Created at:",`<t:${Math.round(msg.guild.createdTimestamp/1000)}>`,false);
    embed.addField("Owner:",`<@!${msg.guild.ownerId}>`,false);
    embed.addField("Region:",msg.guild.preferredLocale,false);
    embed.addField("Members count:",String(msg.guild.memberCount),false);
    embed.addField("Security level:",msg.guild.verificationLevel,false);

    const channels = {
        category:0,
        text:0,
        voice:0
    }

    msg.guild.channels.cache.forEach((ch)=> {
        if(ch.type == "GUILD_CATEGORY") channels.category += 1;
        if(ch.type == "GUILD_TEXT" || ch.type == "GUILD_NEWS") channels.text += 1;
        if(ch.type == "GUILD_VOICE") channels.voice += 1;
    })

    embed.addField("Channels:",`
    🟥**Categories:** ${channels.category}
    📝**Text:** ${channels.text}
    🔊**Voice:** ${channels.voice}
    `,false)

    embed.addField("Roles:",String(msg.guild.roles.cache.size-1),false)

    msg.reply({embeds:[embed]})
}

const command = new Command("serverinfo", server_info);
export {command}
