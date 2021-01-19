import discord
from discord.ext import commands
import os

client = discord.Client(commands_prefix='#')
token = os.environ.get('TOKEN')

@client.event
async def on_ready():
    print("HOLAS")

client.run(token)