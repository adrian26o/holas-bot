import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, APIEmbedField } from "discord.js"

export var c = {
	data: new SlashCommandBuilder()
		.setName("timestamp")
		.setDescription("generar un timestamp")
        .addIntegerOption(i => i.setName("hora").setDescription("hora del timestamp").setMinValue(1).setMaxValue(24))
        .addIntegerOption(i => i.setName("minutos").setDescription("minutos del timestamp").setMinValue(0).setMaxValue(59))
        .addIntegerOption(i => i.setName("día").setDescription("día del timestamp").setMinValue(1).setMaxValue(31))
        .addIntegerOption(i => i.setName("mes").setDescription("mes del timestamp").setMinValue(1).setMaxValue(12))
        .addIntegerOption(i => i.setName("año").setDescription("año del timestamp").setMinValue(1970))
        .addStringOption(i => i.setName("estilo").setDescription("estilo del timestamp").addChoices(
                {
                    "name": "default",
                    "value": "default"
                },
                {
                    "name": "hora(corta)",
                    "value": "t"
                },
                {
                    "name": "hora(larga)",
                    "value": "T"
                },
                {
                    "name": "fecha(corta)",
                    "value": "d"
                },
                {
                    "name": "fecha(larga)",
                    "value": "D"
                },
                {
                    "name": "hora-fecha(corta)",
                    "value": "f"
                },
                {
                    "name": "hora-fecha(larga)",
                    "value": "F"
                },
                {
                    "name": "relativo",
                    "value": "R"
                }
        ))
	    ,
	async execute(interaction: ChatInputCommandInteraction) {
        const now = interaction.createdAt

        const hour = interaction.options.getInteger("hora") || now.getHours();
        const minutes = interaction.options.getInteger("minutos") || now.getMinutes();
        const day = interaction.options.getInteger("día") || now.getDate();
        const month = interaction.options.getInteger("mes") || now.getMonth() + 1;
        const year = interaction.options.getInteger("año") || now.getFullYear();

        const type = interaction.options.getString("estilo") || "default";

        const newDate = new Date(year, month - 1, day, hour, minutes, 0, 0)

        const epoch = Math.round(newDate.getTime() / 1000)

        await interaction.reply({
            ephemeral: true,
            content: `<t:${epoch}${type == "default" ? "" : ":" + type}> \\<t:${epoch}${type == "default" ? "" : ":" + type}>`
        })
    }
};