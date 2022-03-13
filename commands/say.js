const {Message} = require("discord.js");
const path = require("path");
const {comp,input_err} = require(__dirname+path.posix.sep+"tools.js");
/**
 * @param {Message} msg 
 */
async function say(msg) {
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

    const roles = [];
    msg.guild.roles.cache.forEach((role)=>{ roles.push(role) });

    for(i=0;i<roles.length;i++) {
        if(msg.content.includes(`<@&${roles[i].id}>`)) {
            input_err(msg,"You can't mention a guild role");
            return;
        }
    }
    let slice_start = 1;
    if(msg.content.split(" ").slice(0,2).join(" ")==`<@!${msg.client.user.id}> say`) slice_start +=1;

    msg.channel.send(msg.content.split(" ").slice(slice_start).join(" "));
    if(msg.deletable) await msg.delete();
}

module.exports = say;