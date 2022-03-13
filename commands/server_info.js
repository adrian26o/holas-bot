const {Message,MessageEmbed} = require("discord.js");
const path = require("path");
const {comp,input_err} = require(__dirname+path.posix.sep+"tools.js");
/**
 * @param {Message} msg 
 */
function server_info(msg) {
    
    if(comp(msg,["svinfo","serverinfo","guild","guildinfo","svinf"])) return;
    const embed = new MessageEmbed({
        footer:{
            text:msg.client.user.username,
            iconURL:msg.client.user.avatarURL()
        },
        timestamp:Date.now(),
        title:`${msg.guild.name}`,
        color:[245,166,35],
        thumbnail:{
            url:msg.guild.iconURL()
        }
    })

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

module.exports = server_info;