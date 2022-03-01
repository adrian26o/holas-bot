const {Client, Intents, MessageEmbed} = require("discord.js");
const Commands = require("./commands/init.js");
const int_syt = require("./interactions/search_youtube");

const client = new Client({intents:[
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILDS
]});

client.on("ready",()=>{
    console.log("Holas!\nBot is ready!")
    console.log(`Username: ${client.user.username}#${client.user.discriminator}`)
})


client.on("messageCreate",(ctx)=>{
    Commands.forEach((command)=>{
        command(ctx);
    })
})


client.on("interactionCreate",(inte)=>{
    int_syt(inte)
})
client.login(process.env.botToken)