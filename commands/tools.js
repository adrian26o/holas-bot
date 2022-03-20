const {Message, User} = require("discord.js");
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

/**
 * 
 * @param {Message} msg 
 * @param {Number} index
 * @returns {User}
 */

function getUser(msg,index = 1) {
    const msgSplit = msg.content.split(" ");
    let _user;

    if (msgSplit[0] == `<@!${msg.client.user.id}>` || msgSplit[0] == `<@${msg.client.user.id}>`)
        _user = msgSplit[index+1];
    else
        _user = msgSplit[index];

    if(_user == undefined) return undefined;
    
    const user = msg.client.users.cache.find(u => u.username.toLowerCase() == _user.toLowerCase() || `<@!${u.id}>` == _user || `<@${u.id}>` == _user || u.id == String(_user));
    return user;
}

/**
 * 
 * @param {Message} msg 
 * @param {Number} index 
 * @returns {Object}
 */

function getArgs(msg,index = 1) {
    const msgSplit = msg.content.split(" ");
    let args;

    if (msgSplit[0] == `<@!${msg.client.user.id}>` || msgSplit[0] == `<@${msg.client.user.id}>`)
        args = msgSplit.slice(index+1)
    else
        args = msgSplit.slice(index)
    
    return args;
}

module.exports = {comp,input_err,getUser,getArgs};
