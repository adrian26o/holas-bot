import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, APIEmbedField, Collection, CommandInteractionOption, AttachmentBuilder, BufferResolvable } from "discord.js"
import * as fs from "fs"
import * as path from "path"

export var c = {
	data: new SlashCommandBuilder()
		.setName("hungergames")
		.setDescription("Genera los links de los usuarios para usar en hunger games")
        .addBooleanOption((i) => i.setName("json").setDescription("Generar el archivo como json"))
	    ,
	async execute(interaction: ChatInputCommandInteraction) {
        const guild = await interaction.client.guilds.cache.get(interaction.guildId || "");
        const genJSON = interaction.options.get("json")

        if(guild === undefined || guild === null || guild instanceof Collection) {
			await interaction.reply("No te encuentras en un servidor!");
			return;
		}

        const user = await guild.members.fetch(interaction.user.id);

        
        if( // Administradri || Gatictus
            ! ["1103465466711777340", "1103482175380275211"].includes(user.roles.highest.id)
        ) {
            await interaction.reply("No tienes permiso!");
            return;
        }

        const users = guild.members.cache.filter((member) => ! member.user.bot)
        
        let text = "";
        
        console.log(interaction.guild?.members.cache);
        
        console.log(users);
        
        if(genJSON?.value) {
            const fileTemp: {
                "version": number, "characters": 
                {"name": string, "gender_select":"m" | "f" | "c" | "n" | "other", "pronoun_str" : string, "image": {"url": string}, "tags": []}[]
        } = {
                "version": 1,
                "characters": []
            }

            await interaction.reply("Generando archivo...")

            users.forEach((member)=> {
                fileTemp.characters.push({"name": member.user.username, gender_select: "m", "pronoun_str": "", image:{url: member.displayAvatarURL({extension:"png"})}, tags: []})
            })

            fs.writeFileSync(path.join(__dirname, "HungerLinks.json"), JSON.stringify(fileTemp, null, 1))

            await interaction.channel?.send({files: [path.join(__dirname, "HungerLinks.json")]})

        }
        else {
            users.forEach((member) => {
                text += member.user.username + ": " + member.displayAvatarURL({extension: "png"}) + "\n"
            })
            await interaction.reply("Generando archivo...")
            fs.writeFileSync(path.join(__dirname, "HungerLinks.txt"), text, {encoding: "utf-8"})

            await interaction.channel?.send({files: [path.join(__dirname, "HungerLinks.txt")]})
        }
	}
};