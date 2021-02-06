import discord
from discord.ext import commands
import os
import datetime
client = commands.Bot(command_prefix=commands.when_mentioned_or("h!"), help_command=None)
token = os.environ.get('TOKEN')

@client.event
async def on_ready():
    print("HOLAS")

@client.command()
async def help(ctx):
    embed = discord.Embed(title="Comandos", colour=discord.Colour(0xf5a623), timestamp=datetime.datetime.utcfromtimestamp(1612588761))

    embed.set_thumbnail(url="https://cdn.discordapp.com/avatars/796797535208341544/c6b3f004ea31246515f88524518984ff.png")
    embed.set_author(name=ctx.message.author.name, icon_url=ctx.message.author.avatar_url)
    embed.set_footer(icon_url="https://cdn.discordapp.com/embed/avatars/0.png")

    embed.add_field(name="```help```", value="Muestra este mensaje (duh).")
    embed.add_field(name="```say```", value="`say [mensaje]`. Hace que el bot responda con[mensaje].  ")
    embed.add_field(name="```ping```", value="Muestra la latencia del bot con discord.")

    await ctx.send(content="Holas!, " + f"{ctx.message.author.mention} " + "aquí tienes tu ayuda", embed=embed)

@client.command()
async def ping(ctx):
    embed = discord.Embed(colour=discord.Colour(0xf5a623),description="La latencia del bot es: " + f"**{round(client.latency*1000)}**ms")
    await ctx.send(embed=embed)

@client.command()
async def say(ctx, *, mensaje):
    if mensaje == None:
        return
    if len(ctx.message.mentions)!= 0 or ctx.message.mention_everyone == True:
        if ctx.message.mention_everyone == True:
            await ctx.send("No se permiten Everyone's ni Here.")
            await ctx.message.delete()
        if ctx.message.mention_everyone == False:
            await ctx.send("No se permiten menciones.")
            await ctx.message.delete()
            return
        return
    if len(ctx.message.mentions) == 0:
        await ctx.send(mensaje)
        await ctx.message.delete()

client.run(token)