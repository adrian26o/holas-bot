import { ChatInputCommandInteraction } from "discord.js";
import { EmbedBuilder, SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { parseBirthdays, readLines } from "./tools";

export var c = {
    data: new SlashCommandSubcommandBuilder()
    .setName("obtener")
    .setDescription("ver el cumpleaños de un usuario")
    .addUserOption(i => i.setName("usuario").setDescription("usuario a consultar"))
    ,
    subcommand: true,
    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser("usuario") || interaction.user;
        
        let birthdayList;

        try {
            birthdayList = parseBirthdays(`./data/${interaction.guildId}-birthdays`)
        }
        catch {
            await interaction.reply("Usuario no encontrado en la base de datos de este servidor")
            return;
        }
        const userBirthday = birthdayList.filter(v => v.id === user.id)[0]
        if( ! userBirthday ) {
            await interaction.reply("Usuario no encontrado en la base de datos de este servidor")
            return;
        }

        const embed = new EmbedBuilder()
        .setTitle(user.username)
        .setThumbnail(user.avatarURL())
        .addFields([
            {
                name: "día",
                value: userBirthday.day.toString(),
                inline: true
            },
            {
                name: "mes",
                value: userBirthday.month.toString(),
                inline: true
            },
            {
                name: "año",
                value: userBirthday.year?.toString() || "No definido",
                inline: true
            },
            {
            name: "✉️ mensaje",
            value: userBirthday.message
        }
    ])

    await interaction.reply({embeds: [embed]})
    }
}