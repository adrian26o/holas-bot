import {Message, MessageButton, MessagePayload, MessageActionRow,Interaction, User} from "discord.js";

const Scraper = require('@yimura/scraper').default;
const youtube = new Scraper();


async function int_syt(inte:Interaction) {
    if(!inte.isButton()) return;
	// @ts-ignore
    let author_username = inte.message.mentions.users.map((user:User) => user.username)

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

		// @ts-ignore
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

		// @ts-ignore
        await inte.message.edit({
            content:`Search for:\n[${index-1}] ${search}\n${videos[index-1].link}`,
            components:[row1]
        })
        inte.deferUpdate();
    }
}

export {int_syt}
