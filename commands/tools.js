const {Message} = require("discord.js");
/** 
 * @param {Message} msg
 * @param {String} command
*/
function comp(msg,command) {
    if(msg.content.split(" ")[0]==`h!${command}` || msg.content.split(" ")[0]==`<@!${msg.client.user.id}>${command}`) return false;
    return true;
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