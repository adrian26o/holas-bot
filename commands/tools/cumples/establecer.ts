import { ChatInputCommandInteraction } from "discord.js";
import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { appendFile, writeFileSync, existsSync, mkdirSync} from "fs";
import { parseBirthdays, readLines } from "./tools";
export var c = {
    data: new SlashCommandSubcommandBuilder()
    .setName("establecer")
    .setDescription("pon tu cumpleaños!")
    .addIntegerOption(i => i.setName("día").setRequired(true).setDescription("día nacimiento").setMinValue(1).setMaxValue(31))
    .addIntegerOption(i => i.setName("mes").setRequired(true).setDescription("mes nacimiento").setMinValue(1).setMaxValue(12))
    .addIntegerOption(i => i.setName("año").setRequired(false).setDescription("tu año de nacimiento!").setMinValue(1900))
    .addStringOption(i => i.setName("mensaje").setDescription("mensaje personalizado para cuando suceda!").setMaxLength(500))
    ,
    subcommand: true,

    async execute(interaction: ChatInputCommandInteraction) {
    if(interaction.guildId == null) {
        await interaction.reply("necesitas estar en un servidor!")
        return;
    }

    let mensaje = interaction.options.getString("mensaje") || "Felicidades $mention!";

    if(mensaje.includes(";")) {
        await interaction.reply("No se puede usar el carácter ; en el mensaje")
        return
    }

    mensaje = mensaje.replace("$name",interaction.user.displayName).replace("$mention", `<@${interaction.user.id}>`)

    let date = {
        day: interaction.options.getInteger("día", true),
        month: interaction.options.getInteger("mes", true),
        year: interaction.options.getInteger("año")
    }

    try {
        if(date.day >= 30 && date.month == 2){
            throw "Ese día no existe!" 
        }

        if(date.month > 12) {
            throw "Solo hay 12 meses al año..."
        }

        if(date.month <= 0 || date.day <= 0) {
            throw "No hay fechas negativas!"
        }

        if((date.month <= 6 && date.month % 2 == 0 && date.day >= 31) || (date.month > 8 && date.month % 2 == 1 && date.day >= 31) ) {
            throw "La fecha no existe!"
        }

        if(date.year && (new Date().getDate() > date.day || new Date().getFullYear() < date.year)) {
            throw "¿Vas a nacer todavía?"
        }    
    }
    catch(err) {
        const msg = err as string
        await interaction.reply(msg)
        return
    }

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
    
    const birthdayList = parseBirthdays(dataFolder)

    const userInList = birthdayList.filter(v => v.id === interaction.user.id)[0]

    const formatedString = `${interaction.user.id};${interaction.user.username};${date.day};${date.month};${date.year || "null"};${mensaje}`

    if (userInList) {
        let fileLines = readLines(dataFolder);
        fileLines[userInList.pos] = formatedString;

        writeFileSync(dataFolder, fileLines.join("\n"))
    }
    else {
        await appendFile(dataFolder, "\n" + formatedString, (err)=> {
            if(err) {
                console.log("[ERROR]".red, "Ha habido un error")
                console.error(err)
            }
        })
    }
    await interaction.reply(`Tu fecha de cumpleaños se ha establecido como ${date.day}/${date.month} con el mensaje \`\`\`\n${mensaje}\`\`\``)
    }
}