const {Message,MessageEmbed} = require("discord.js");
const path = require("path");
const {comp,input_err} = require(__dirname+path.posix.sep+"tools.js");
/**
 * @param {Message} msg 
 */
function ping(msg) {
    if(comp(msg,"ping")) return;
    const embed = new MessageEmbed({
        description:`Latency: ${Date.now() - msg.createdTimestamp}ms\nApi Latency: ${Math.round(msg.client.ws.ping)}ms`,
        timestamp:Date.now(),
        color:[245,166,35]
    })

    msg.reply({
        embeds:[embed]
    })
}

module.exports = ping;