import { APIEmbedField, ChatInputCommandInteraction, PermissionsBitField, ChannelType } from "discord.js";
import { EmbedBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from '@discordjs/builders';
import { parseBirthdays, readLines, getGuildOptions, birthdayGuildOptions, writeGuildOptions } from "./tools";
import { existsSync, mkdirSync, writeFileSync } from "fs"


async function obtener(interaction: ChatInputCommandInteraction) {
    const options = getGuildOptions(`./data/${interaction.guildId}-birthdays`)

    const keys = Object.keys(options);

    const embed = new EmbedBuilder()
    .setTitle("opciones")

    const fields: APIEmbedField[] = [];

    for( let key in keys ) {
        let config = keys[key];
        let value = ""
        
        switch(config) {
            case "channel":
                value = options.channel === "null" ? "Indefinido" : `<#${options.channel}>`
        }

        fields.push({
            name: config,
            value: value,
            inline: true
        })
    }

    embed.addFields(fields)

    await interaction.reply({embeds: [embed], ephemeral: true})
}

async function canal(interaction: ChatInputCommandInteraction) {
    const _o = getGuildOptions(`./data/${interaction.guildId}-birthdays`)
    
    _o.channel = interaction.options.getChannel("canal", true).id

    writeGuildOptions(`./data/${interaction.guildId}-birthdays`, _o)

    await interaction.reply({
        content: `Se ha establecido <#${_o.channel}> como canal de notificaciones`,
        ephemeral: true
    })
}


export var c = {
    data: new SlashCommandSubcommandGroupBuilder()
    .setName("config")
    .setDescription("configurar el comportamiento de los cumpleaños en el servidor")
    .addSubcommand( i => i.setName("obtener").setDescription("Ver las configuraciones del servidor"))
    .addSubcommand( i => i.setName("canal").setDescription("Establecer el canal para las notificaciones").addChannelOption(
        s => s.setName("canal").setDescription("Canal para notificaciones").setRequired(true).addChannelTypes([ChannelType.GuildText])
    ))
    ,
    subcommand: true,
    async execute(interaction: ChatInputCommandInteraction) {
        const permissions: PermissionsBitField = interaction.member?.permissions as PermissionsBitField

        if(! existsSync("./data")) {
            mkdirSync("./data")
            console.log("[Info]".yellow, "Carpeta 'Data' creada");
        }
    
        const dataFolder = `./data/${interaction.guildId}-birthdays`
    
        if(! existsSync(dataFolder) )
        {
            writeFileSync(dataFolder, `# ${interaction.guild?.name}\n# ${interaction.guildId}\n# id;name;day;month;year;message\n! channel:null`)
            console.log("[Info]".yellow, `Servidor ${interaction.guild?.name} [${interaction.guildId}] añadido a la base de cumpleaños`)
        }

        if( ! permissions.has(PermissionsBitField.Flags.ManageGuild) ) {
            await interaction.reply("No tienes permisos :)")
            return
        }

        switch(interaction.options.getSubcommand()) {
            case "obtener":
                obtener(interaction)
                break;
            case "canal":
                canal(interaction)
                break;
        }
    }
}