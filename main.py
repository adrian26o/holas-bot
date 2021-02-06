import discord
from discord.ext import commands
from youtube_search import YoutubeSearch
import os
import datetime
client = commands.Bot(command_prefix=commands.when_mentioned_or("h!"), help_command=None, activity=discord.Game(name="h!help", start=datetime.datetime.utcfromtimestamp(1612588761)))
token = os.environ.get('TOKEN')

@client.event
async def on_ready():
    print("Holas!")
    print('Iniciando sesion como:')
    print("Username: " + client.user.name+ "#" +client.user.discriminator)
    print("ID: " + str(client.user.id))
    print("Token: " + token)



@client.command()
async def ping(ctx):
    embed = discord.Embed(colour=discord.Colour(0xf5a623),description="La latencia del bot es: " + f"**{round(client.latency*1000)}**ms")
    await ctx.send(embed=embed)



@client.command()
async def help(ctx):
    embed = discord.Embed(title="Comandos", colour=discord.Colour(0xf5a623), timestamp=datetime.datetime.utcfromtimestamp(1612588761))

    embed.set_thumbnail(url="https://cdn.discordapp.com/avatars/796797535208341544/c6b3f004ea31246515f88524518984ff.png")
    embed.set_author(name=ctx.message.author.name, icon_url=ctx.message.author.avatar_url)
    embed.set_footer(text="Prefix: " + str(client.command_prefix), icon_url="https://cdn.discordapp.com/embed/avatars/0.png")
    embed.add_field(name="```help```", value="Muestra este mensaje (duh).", inline=False)
    embed.add_field(name="```say```", value="`say [mensaje]`.\nHace que el bot responda con[mensaje].", inline=False)
    embed.add_field(name="```ping```", value="Muestra la latencia del bot con discord.", inline=False)
    embed.add_field(name="```yt```", value="`yt [video]`.\nHace una busqueda en youtube usando [video] y devuelve el primer resultado.", inline=False)

    await ctx.send(content="Holas!, " + f"{ctx.message.author.mention} " + "aquí tienes tu ayuda", embed=embed)



@client.command()
async def say(ctx, *, mensaje = None):
    embed = discord.Embed(colour=discord.Colour(0xf5a623),title="Error",description="Tienes que especificarme que decir tonta tonta 😠")

    if mensaje == None:
        await ctx.send(embed=embed)
        return     

    if ctx.message.mention_everyone == True or len(ctx.message.mentions) != 0:
        if ctx.message.mention_everyone == True:
            await ctx.send("No se permiten everyone ni here 😠.")
            await ctx.message.delete()
        else:
            await ctx.send("No se permiten menciones 😠.")
            await ctx.message.delete()
            return
        return

    else:
        await ctx.send(mensaje)
        await ctx.message.delete()



@client.command()
async def yt(ctx, *, search):
    results = YoutubeSearch(search, max_results=1).to_dict()
    await ctx.send(str(results[0]['title']) + "\nhttps://www.youtube.com" + str(results[0]['url_suffix']))
    

client.run(token)