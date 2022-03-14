const {Message} = require("discord.js");
/** 
 * @param {Message} msg
 * @param {String} command
*/
function comp(msg,command) {
    if(typeof(command)=="string"){
        if(msg.content.split(" ")[0]==`h!${command}` || msg.content.split(" ").slice(0,2).join(" ")==`<@!${msg.client.user.id}> ${command}` || msg.content.split(" ").slice(0,2).join(" ")==`<@${msg.client.user.id}> ${command}`) return false;
        return true;
    }
    else {
        let is_command = false;
        for(i=0;i<command.length;i++){
            if(msg.content.split(" ")[0]==`h!${command[i]}` || msg.content.split(" ").slice(0,2).join(" ")==`<@!${msg.client.user.id}> ${command[i]}`)is_command=true;
        }
        if(is_command) return false;
        else return true;
    }
}

/** 
 * @param {Message} msg
 * @param {String} info
*/

async function input_err(msg,info) {
    const reply = await msg.reply(info);
    await new Promise(r => setTimeout(r, 5000));
    await reply.delete();
    if(msg.deletable) await msg.delete();
}

module.exports = {comp,input_err};
