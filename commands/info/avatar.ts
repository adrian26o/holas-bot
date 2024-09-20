import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, APIEmbedField} from "discord.js"

export var c = {
	data: new SlashCommandBuilder()
		.setName("avatar")
		.setDescription("Obtener la foto de perfil de un usuario")
		.addUserOption(ev => ev.setName("user")
		.setDescription("usuario a examinar")
		),
	async execute(interaction: ChatInputCommandInteraction) {
		var user = interaction.options.getUser("user") || interaction.user;	

		const embed = new EmbedBuilder();
		embed.setAuthor({name:`${user.username}`, url: user.avatarURL({size: 2048}) || user.defaultAvatarURL})
		.setImage(user.avatarURL({size: 2048}) || user.defaultAvatarURL)
		.setColor(
			(await interaction.guild?.members.fetch(user.id))?.roles.color?.color
			|| "Yellow"
			)
		.setFooter({text:interaction.client.user.username, iconURL:interaction.client.user.avatarURL() || undefined})
		// .setDescription()
		
		
		await interaction.reply({embeds:[embed]});
	}
};