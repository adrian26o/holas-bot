const {Message, MessageButton, MessagePayload, MessageActionRow} = require("discord.js");
const path = require("path");
const {comp,input_err} = require(__dirname+path.posix.sep+"tools.js");
const Scraper = require('@yimura/scraper').default;
const youtube = new Scraper();

/**
 * @param {Message} msg 
 */
async function syt(msg) {
    if(comp(msg,"syt")) return;
    if(msg.content.split(" ").slice(1).join(" ").trim().length==0) {
        input_err(msg,"Search input is empty");
        return;
    }
    const row1 = new MessageActionRow()
    .addComponents(
        new MessageButton().setLabel("⏮").setStyle("PRIMARY").setCustomId("SYTPrevious").setDisabled(true),
        new MessageButton().setLabel("⏭").setStyle("PRIMARY").setCustomId("SYTNext")
    )
    msg.reply({content:`Search for:\n[0] ${msg.content.split(" ").slice(1).join(" ")}\n`+(await youtube.search(msg.content.split(" ").slice(1).join(" "))).videos[0].link,components:[row1]})
    
}

module.exports = syt;