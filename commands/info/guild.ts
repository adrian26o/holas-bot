import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, APIEmbedField, Collection, ChannelType} from "discord.js"

export var c = {
	data: new SlashCommandBuilder()
		.setName("serverinfo")
		.setDescription("Obtener información del servidor actual"),
	async execute(interaction: ChatInputCommandInteraction) {
		const embed = new EmbedBuilder();
		const guild = await interaction.client.guilds.fetch(interaction.guildId || "");
		const channels = await guild.channels.fetch();
		if(guild === undefined || guild === null || guild instanceof Collection) {
			interaction.reply("No te encuentras en un servidor!");
			return;
		}

		const fields: APIEmbedField[] = [
			{
				"name": "ID",
				"value": guild.id,
			},
			{
				"name": "Miembros",
				"value": `
:people_hugging: Usuarios: ${guild.memberCount}
`
			},
			{
				"name": "Owner",
				"value": `* <@${guild.ownerId}>
 * ID: ${guild.ownerId}`
			},
			{
				"name": "Canales",
				"value": `
<:chatchannel:1122614374964662282> Texto: ${channels.filter(v => v?.type === ChannelType.GuildText).size}
<:voicechannel:1122614372620046346> Voz: ${channels.filter(v => v?.type === ChannelType.GuildVoice).size}
<:categorychannel:1122614375908397197> Categorías: ${channels.filter(v => v?.type === ChannelType.GuildCategory).size}`
			},
			{
				"name": "Emojis",
				"value": ":no_mouth: " + guild.emojis.cache.size,
				"inline": true
			},
			{
				"name": "Stickers",
				"value": "<:sticker:1122621513951084715> " + guild.stickers.cache.size,
				"inline": true
			},
			{
				"name": "Roles",
				"value": ":identification_card: " + guild.roles.cache.size,
				"inline": true
			}
		]

		embed.setAuthor({
			name: guild.name,
			iconURL: guild.iconURL() || undefined
		})
		.setThumbnail(guild.iconURL({size: 1024}))
		.setColor("Yellow")
		.setImage(guild.bannerURL({size: 2048}))
		.setFooter({text:interaction.client.user.username, iconURL:interaction.client.user.avatarURL() || undefined})
		.addFields(fields)
		.setDescription(guild.description)
		
		
		await interaction.reply({embeds:[embed]});
	}
};