import {Message, MessageButton, MessageActionRow} from "discord.js";
import {comp,input_err} from "./tools";
import {Command} from "./class";

const Scraper = require('@yimura/scraper').default;
const youtube = new Scraper();

async function syt(msg:Message) {
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

const command = new Command("syt",syt)
export {command}
