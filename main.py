import discord
from discord.ext import commands
import os
import json
client = commands.Bot(command_prefix=commands.when_mentioned_or("h!"))
token = os.environ.get('TOKEN')

@client.event
async def on_ready():
    print("HOLAS")

@client.command()
async def ping(ctx):
    await ctx.send(f"{round(client.latency*1000)}ms")

@client.command()
async def say(ctx, *,mensaje):
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