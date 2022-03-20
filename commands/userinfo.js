const {MessageEmbed,Message,User} = require("discord.js");
const path = require("path");
const {comp,input_err,getUser} = require(__dirname+path.posix.sep+"tools.js");

/**
 * @param {Message} msg 
 */

async function userinfo(msg) {
    if(comp(msg,["user","userinfo","uinf","whois"])) return;

    /**
    @type {User}
    */
    const user = getUser(msg) || msg.author;
    const member = msg.guild.members.cache.find(m => m.user == user)
    const embed = new MessageEmbed();
    embed.setFooter({text:msg.client.user.username,iconURL:msg.client.user.avatarURL()})
    embed.setTitle(`${user.username}#${user.discriminator}`)
    embed.setTimestamp(Date.now())
    embed.setThumbnail(user.avatarURL())

    embed.addField("Nick:",member.nickname || "None",true)
    embed.addField("ID:",String(user.id), true)
    embed.addField("Created at:",`<t:${Math.round(user.createdTimestamp / 1000)}>`,true)
    embed.addField("Joined at:", `<t:${Math.round(member.joinedTimestamp / 1000)}>`,true)

    const roles = member.guild.roles.cache.filter(role => member._roles.some((id) => id == role.id)).map(role => role.name);
    embed.addField(`Roles[${roles.length}]:`,roles.join("\n"))

    msg.reply({embeds:[embed]})
}

module.exports = userinfo;