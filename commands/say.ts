import { SlashCommandBuilder, ChatInputCommandInteraction, Channel} from "discord.js"

export var c = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription("Di lo que quieras")
		.addStringOption(option =>
			option.setName("texto")
			.setDescription("Texto a decir")
			.setRequired(true)
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const text = interaction.options.getString("texto", true);
		await interaction.reply("Enviando...");
		await interaction.deleteReply();
		const channel = await interaction.client.channels.fetch(interaction.channelId)
		// console.log(interaction.client.guilds.cache)

		// @ts-ignore
		await channel?.send(text);
	}
};