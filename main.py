import discord
from discord.ext import commands
import os

client = commands.Bot(command_prefix=commands.when_mentioned_or("#"))
token = os.environ.get('TOKEN')

@client.event
async def on_ready():
    print("HOLAS")

@client.command()
async def say(ctx, *, message):
    if len(ctx.message.raw_mentions) != 0:
        print(ctx.message.raw_mentions)
        await ctx.send("No Menciones 😠")
        return
    await ctx.send(message)
    await ctx.message.delete
    
client.run(token)