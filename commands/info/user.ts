import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, APIEmbedField} from "discord.js"

export var c = {
	data: new SlashCommandBuilder()
		.setName("userinfo")
		.setDescription("Obtener información de un usuario")
		.addUserOption(ev => ev.setName("user")
		.setDescription("usuario a examinar")
		),
	async execute(interaction: ChatInputCommandInteraction) {
		var user = interaction.options.getUser("user") || interaction.user;	
		var discriminator = (()=>{if(user.discriminator === "0") return ""; else return "#" + user.discriminator})();
		var hypersquad = (()=>{
			let flags = user.flags?.toArray();
			if(!flags) return "**No especificada**";

			let house = flags.filter(v => v.startsWith("HypeSquadOnlineHouse"))[0] || undefined
			if(house === undefined) return "**No especificada**";

			if(house === "HypeSquadOnlineHouse1") return "<:housebravery:1121619726913765486> House Bravery Member";
			if(house === "HypeSquadOnlineHouse2") return "<:housebrilliance:1121619732706107392> House Brilliance Member";
			if(house === "HypeSquadOnlineHouse3") return "<:housebalance:1121619725135388692> House Balance Member";
		})();

		const embed = new EmbedBuilder();
		const fields: APIEmbedField[] = [
			{
				name: "Creación de cuenta",
				value: user.createdAt.toLocaleDateString("en-us",{weekday: "short", year: "numeric", "day": "numeric", "month":"short"})
			},
			{
				name: "ID",
				value: user.id
			},
			{
				name: "nickname",
				value: (await interaction.guild?.members.fetch(user.id))?.nickname || "*Sin definir*"
			},
			{
				name:"HypeSquad",
				value:hypersquad || "<:hypesquad:1121619730520866856> *No especificada*"
			}
		]

		if(user.bot) embed.setDescription("<:bot:1121622629703499898> Bot")

		embed.setAuthor({name:`${user.username}${discriminator}`})
		.setThumbnail(user.avatarURL({size: 128}))
		.setColor(
			(await interaction.guild?.members.fetch(user.id))?.roles.color?.color
			|| "Yellow"
			)
		.setImage(user.bannerURL({size:2048}) || null)
		.setFooter({text:interaction.client.user.username, iconURL:interaction.client.user.avatarURL({extension: "png"}) || undefined})
		.addFields(fields)
		// .setDescription()
		
		
		await interaction.reply({embeds:[embed]});
	}
};