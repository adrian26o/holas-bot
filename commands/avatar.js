const {MessageEmbed,Message,User} = require("discord.js");
const path = require("path");
const {comp,input_err,getUser} = require(__dirname+path.posix.sep+"tools.js");

/**
 * @param {Message} msg 
 */

function avatar(msg) {
    if(comp(msg,["avatar","av"])) return;

    /**
    @type {User}
    */
    const user = getUser(msg) || msg.author;

    const embed = new MessageEmbed();
    embed.setTimestamp(Date.now());
    embed.setImage(user.avatarURL({format:'png'||'gif',size:1024}));

    msg.reply({embeds:[embed]})
}

module.exports = avatar;