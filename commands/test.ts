import { SlashCommandBuilder, ChatInputCommandInteraction} from "discord.js"

export var c = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription("Un comando de prueba"),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply('SIII FUNCA');
	}
};