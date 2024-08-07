import { ChatInputCommandInteraction } from "discord.js"
import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from '@discordjs/builders';
import { appendFile, writeFileSync, readFileSync, existsSync, mkdirSync} from "fs"
import * as establecer from "./establecer"
import * as obtener from "./obtener"
import * as config from "./config"
import * as lista from "./lista"
type commandModule =  {
	c: {
		data:SlashCommandBuilder | SlashCommandSubcommandBuilder | SlashCommandSubcommandGroupBuilder,
		execute: Function,
		subcommand: boolean | null
	}
}

const subcommands:  commandModule["c"][] = [establecer.c, obtener.c, config.c, lista.c]

export var c = {
	data: new SlashCommandBuilder()
    .setName("cumpleaños")
    .setDescription("oladri")
    .addSubcommand(establecer.c.data)
    .addSubcommand(obtener.c.data)
    .addSubcommand(lista.c.data)
    .addSubcommandGroup(config.c.data)    
    ,
	async execute(interaction: ChatInputCommandInteraction) {
        if(interaction.options.getSubcommandGroup()) {
            const subGroup = subcommands.filter(v => v.data instanceof SlashCommandSubcommandGroupBuilder)[0]
            if (! subGroup ) return;
            subGroup.execute(interaction)
        }
        else {
            const subcommand = subcommands.filter(s => s.data.toJSON().name === interaction.options.getSubcommand())[0]
            if(! subcommand ) return;
            
            subcommand.execute(interaction);
        }
    }
}
;