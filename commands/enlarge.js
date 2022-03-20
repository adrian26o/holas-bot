const {MessageEmbed,Message,User} = require("discord.js");
const path = require("path");
const {comp,input_err,getArgs} = require(__dirname+path.posix.sep+"tools.js");

/**
 * @param {Message} msg 
 */

module.exports = (msg) => {
    if(comp(msg,["enlarge","e"])) return;
    const embed = new MessageEmbed();
    const args = getArgs(msg);

    if(args < 1) {
        input_err(msg,"Emoji no provided")
        return
    }

    let EMOJI_ID = args[0].split(":")[2]
    
    if (EMOJI_ID != undefined) {
        EMOJI_ID = EMOJI_ID.slice(0,EMOJI_ID.length-1);
    }
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