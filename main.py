import discord
from discord.ext import commands
import os
import json
client = commands.Bot(command_prefix=commands.when_mentioned_or("#"))
token = os.environ.get('TOKEN')

@client.event
async def on_ready():
    print("HOLAS")

@client.command()
async def ping(ctx):
    await ctx.send(f"{round(client.latency*1000)}ms")

@client.command()
async def say(ctx, *, message):
    mentions = ctx.message.raw_mentions
    if len(mentions) != 0:
        print(mentions)
        await ctx.send("No Menciones 😠")
        mentions.clear()
        return
    if ("@everyone") or ("@here") in message:
        await ctx.send("No Hagas Everyone 😠")
        return
    await ctx.send(message)
    await ctx.message.delete

client.run(token)