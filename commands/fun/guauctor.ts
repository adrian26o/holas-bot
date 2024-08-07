import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, APIEmbedField, Collection, CommandInteractionOption, AttachmentBuilder, BufferResolvable } from "discord.js"

const ono: {
	"sound": string,
	"extendLetter": string,
	"extendIndex": number
}[] = [
	{
		"sound": "guau",
		"extendLetter": "u",
		"extendIndex": 3
	},
	{
		"sound": "ouaf",
		"extendLetter": "a",
		"extendIndex": 2
	},
	{
		"sound": "woof",
		"extendLetter": "o",
		"extendIndex": 2
	},
	{
		"sound": "wau",
		"extendLetter": "u",
		"extendIndex": 2
	},
	{
		"sound": "haf",
		"extendLetter": "a",
		"extendIndex": 1
	}
]

export var c = {
	data: new SlashCommandBuilder()
		.setName("guauctor")
		.setDescription("traduce a idioma perruno!")
		.addStringOption(i => i.setName("texto").setDescription("texto a traducir").setMinLength(1).setRequired(true))
		.addBooleanOption(i => i.setName("traducir").setDescription("traducir de perruno a letras"))
	    ,
	async execute(interaction: ChatInputCommandInteraction) {
        const text = interaction.options.getString("texto", true);

		const translate = interaction.options.getBoolean("traducir") || false;
		// a-z [97-122]
		// ñ => 241

		// 26 letras
		const onoRange = Math.floor(26 / ono.length)

		const newText: string[] = []
		for(let i = 0; i < text.length; i++) {
			const letter = text[i]
			const char = text.toLocaleLowerCase().charCodeAt(i) - 97;
			console.log(char)
			
			for(let j = 0; j < ono.length; j++) {
				if(char < onoRange * (j + 1)){
					let c = ono[j].sound.slice(0,ono[j].extendIndex)

					for(let h = 0; h < char - (onoRange * j); h++) {
						c = c.concat(ono[j].extendLetter)
					}
					c = c.concat(ono[j].sound.slice(ono[j].extendIndex))

					if(letter === letter.toUpperCase()) {
						let carray = c.split("")
						carray[0] = carray[0].toUpperCase()
						c = carray.join("")
					}

					newText.push(c)
					break
				}
			}
		}

		await interaction.reply({
			ephemeral: true,
			content: newText.join(" ")
		})
	}
};