const {Message, MessageButton, MessagePayload, MessageActionRow,Interaction} = require("discord.js");
const Scraper = require('@yimura/scraper').default;
const youtube = new Scraper();

/**
 * @param {Interaction} inte 
 */

async function int_syt(inte) {
    if(!inte.isButton()) return;
    author_username = inte.message.mentions.users.map(user => user.username)

    if(inte.user.username != author_username) return;

    if(inte.customId=="SYTNext") {
        const search = inte.message.content.split("\n")[1].split(" ").slice(1).join(" ");
        const index = parseInt(inte.message.content.split("\n")[1].split(" ")[0][1]);
        const videos = (await youtube.search(search)).videos;

        let row1 = new MessageActionRow()
        .addComponents(
            new MessageButton().setLabel("⏮").setStyle("PRIMARY").setCustomId("SYTPrevious"),
            new MessageButton().setLabel("⏭").setStyle("PRIMARY").setCustomId("SYTNext").setDisabled(false)
        )

        if(index >= 8) {
            row1 = new MessageActionRow()
            .addComponents(
                new MessageButton().setLabel("⏮").setStyle("PRIMARY").setCustomId("SYTPrevious"),
                new MessageButton().setLabel("⏭").setStyle("PRIMARY").setCustomId("SYTNext").setDisabled(true)
            )
        }

        await inte.message.edit({
            content:`Search for:\n[${index+1}] ${search}\n${videos[index+1].link}`,
            components:[row1]
        })
        inte.deferUpdate();
    }

    if(inte.customId=="SYTPrevious") {
        const search = inte.message.content.split("\n")[1].split(" ").slice(1).join(" ");
        const index = parseInt(inte.message.content.split("\n")[1].split(" ")[0][1]);
        const videos = (await youtube.search(search)).videos;

        let row1 = new MessageActionRow()
        .addComponents(
            new MessageButton().setLabel("⏮").setStyle("PRIMARY").setCustomId("SYTPrevious").setDisabled(false),
            new MessageButton().setLabel("⏭").setStyle("PRIMARY").setCustomId("SYTNext")
        )

        if(index <= 1) {
            row1 = new MessageActionRow()
            .addComponents(
                new MessageButton().setLabel("⏮").setStyle("PRIMARY").setCustomId("SYTPrevious").setDisabled(true),
                new MessageButton().setLabel("⏭").setStyle("PRIMARY").setCustomId("SYTNext")
            )
        }

        await inte.message.edit({
            content:`Search for:\n[${index-1}] ${search}\n${videos[index-1].link}`,
            components:[row1]
        })
        inte.deferUpdate();
    }
}

module.exports = int_syt