import {MessageEmbed,Message,User} from "discord.js"
import {comp,getUser} from "./tools"
import {Command} from "./class"

async function userinfo(msg: Message) {
    if(comp(msg,["user","userinfo","uinf","whois"])) return;
	if(
		msg.guild == null ||
		msg.client.user == null
	) return;

    const user:User = getUser(msg) || msg.author;
    const member = msg.guild.members.cache.find(m => m.user == user)
    const embed = new MessageEmbed();
	// @ts-ignore
    embed.setFooter({text:msg.client.user.username,iconURL:msg.client.user.avatarURL()})
    embed.setTitle(`${user.username}#${user.discriminator}`)
    embed.setTimestamp(Date.now())
	// @ts-ignore
    embed.setThumbnail(user.avatarURL())

	// @ts-ignore
    embed.addField("Nick:",member.nickname || "None",true)
    embed.addField("ID:",String(user.id), true)
    embed.addField("Created at:",`<t:${Math.round(user.createdTimestamp / 1000)}>`,true)
	// @ts-ignore
    embed.addField("Joined at:", `<t:${Math.round(member.joinedTimestamp / 1000)}>`,true)

	// @ts-ignore
    const roles = member.guild.roles.cache.filter(role => member._roles.some((id) => id == role.id)).map(role => role.name);
    embed.addField(`Roles[${roles.length}]:`,roles.join("\n"))

    msg.reply({embeds:[embed]})
}

const command = new Command("userinfo", userinfo);
export {command}
