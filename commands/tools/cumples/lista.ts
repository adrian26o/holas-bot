import { APIEmbedField, ButtonStyle, ChatInputCommandInteraction, Embed } from "discord.js";
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { parseBirthdays } from "./tools";

export var c = {
    data: new SlashCommandSubcommandBuilder()
    .setName("lista")
    .setDescription("ver todos los cumpleaños registrados")
    .addNumberOption(i => i.setName("pagina").setDescription("pagina a ver de la lista").setMinValue(1))
    ,
    subcommand: true,
    async execute(interaction: ChatInputCommandInteraction) {
        let NumP = interaction.options.getNumber("pagina") || 1;
        let ElementsPerPage = 8

        let birthdays = parseBirthdays(`./data/${interaction.guildId}-birthdays`)

        if(birthdays.length < ElementsPerPage * NumP) {
            NumP = Math.ceil(birthdays.length / ElementsPerPage)
        }

        const embed = new EmbedBuilder().setTitle("Lista de usuarios").setDescription("Página " + NumP)
        const fieldList: APIEmbedField[] = []

        for(let i = 0; i < ElementsPerPage; i++) {
            const user = birthdays[((NumP - 1) * ElementsPerPage) + i];

            if( user ) {
                fieldList.push({
                    name: user.name,
                    value: `${user.day}/${user.month}${user.year == null ? "":"/" + user.year}`
                })
            }
        }

        embed.setFields(fieldList)

        const nextButton = new ButtonBuilder().setCustomId("nextPL").setLabel("Siguiente página").setStyle(ButtonStyle.Primary)
        const befButton = new ButtonBuilder().setCustomId("nextBL").setLabel("Página anterior").setStyle(ButtonStyle.Primary)

        // No sé porqué falla esto... Por mientras lo dejo si en algún momento lo implemento
        const row = new ActionRowBuilder().addComponents(befButton, nextButton)

        await interaction.reply({
            ephemeral: true,
            embeds: [embed]
        })
    }
}