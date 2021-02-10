import discord
from discord.ext import commands
from youtube_search import YoutubeSearch
import os
import datetime
import random
import json


#Hace login usando una variable de entorno para no revelar publicamente el token del bot.
client = commands.Bot(command_prefix=commands.when_mentioned_or("h!"), help_command=None, activity=discord.Game(name="h!help", start=datetime.datetime.utcfromtimestamp(1612588761)))
token = os.environ.get('TOKEN')


#Devuelve en la consola informacion sobre el cliente, because why not.
@client.event
async def on_ready():
    print("Holas!")
    print('Iniciando sesion como:')
    print("Username: " + client.user.name+ "#" + client.user.discriminator)
    print("ID: " + str(client.user.id))
    print("Token: " + token)
    print("Servers: " + str(len(client.guilds)))


#Error Handling para ciertas Exceptions al ejecutar comandos.
@client.event
async def on_command_error(ctx, error):
    if isinstance(error, discord.ext.commands.errors.CommandNotFound):
        embed = discord.Embed(title="Error", description="El comando que intentas usar no existe!.", colour= discord.Colour(0xf5a623))
        await ctx.send(embed=embed)
    if isinstance(error, discord.ext.commands.errors.MemberNotFound):
        embed = discord.Embed(title="Error", description="No se ha encontrado al usuario.", colour= discord.Colour(0xf5a623))
        await ctx.send(embed=embed)
    if isinstance(error, discord.ext.commands.errors.MissingRequiredArgument):
        embed = discord.Embed(title="Error", description="Por favor declara los argumentos requeridos.", colour= discord.Colour(0xf5a623))
        await ctx.send(embed=embed)
    if isinstance(error, Exception):
        print(error)
    if isinstance(error, discord.ext.commands.MissingPermissions):
        embed = discord.Embed(title="Error", description="No tienes los permisos necesarios para ejecutar el comando.", colour= discord.Colour(0xf5a623))
        await ctx.send(embed=embed)



#Ping. Devuelve un embed con la latencia hacia la api de Discord.
@client.command()
async def ping(ctx):
    embed = discord.Embed(colour=discord.Colour(0xf5a623),description="La latencia del bot es: " + f"**{round(client.latency*1000)}**ms")
    await ctx.send(embed=embed)



#Help, Embed con una lista de todos los comandos públicos.
@client.command()
async def help(ctx):
    embed = discord.Embed(title="Comandos", colour=discord.Colour(0xf5a623))

    embed.set_thumbnail(url="https://cdn.discordapp.com/avatars/796797535208341544/c6b3f004ea31246515f88524518984ff.png")
    embed.set_author(name=ctx.message.author.name, icon_url=ctx.message.author.avatar_url)
    embed.set_footer(text="Prefix: h!", icon_url="https://cdn.discordapp.com/embed/avatars/0.png")
    embed.add_field(name="```help```", value="Muestra este mensaje (duh).", inline=False)
    embed.add_field(name="```say```", value="`say [mensaje]`.\nHace que el bot responda con[mensaje].", inline=False)
    embed.add_field(name="```ping```", value="Muestra la latencia del bot con discord.", inline=False)
    embed.add_field(name="```yt```", value="`yt [video]`.\nHace una busqueda en youtube usando [video] y devuelve el primer resultado.", inline=False)
    embed.add_field(name="```serverinfo```", value="Muestra información sobre este servidor.", inline=False)
    embed.add_field(name="```userinfo```", value="`userinfo [usuario/mención/id/nombre]`.\nMuestra informacion sobre [usuario] o la persona que ejecuta el comando.", inline=False)
    embed.add_field(name="```enlarge```", value="`enlarge [emoji]`.\nHace que el bot responda con la imagen de [emote].", inline=False)
    embed.add_field(name="```ban```", value="`ban [usuario/mencón/id/nombre]`.\nBanea al [usuario] especificado, funciona con personas fuera del servidor actual.", inline=False)
    embed.add_field(name="```unban```", value="`unban [usuario/mencón/id/nombre]`.\nDesbanea al [usuario] especificado, funciona con personas fuera del servidor actual.", inline=False)
    embed.add_field(name="```avatar```", value="`avatar [usuario/mencón/id/nombre]`.\nHace que el bot responda con el avatar de [usuario] o la persona que ejecuta el comando.", inline=False)
    await ctx.send(content="Holas!, " + f"{ctx.message.author.mention} " + "aquí tienes tu ayuda", embed=embed)



#Say, Devuelve el mensaje que el usuario declaró despues del comando.
@client.command()
async def say(ctx, *, mensaje = None):
    if len(ctx.message.mentions) != 0:
        await ctx.send(f"{ctx.message.author.mention}, No puedes mencionar gente o roles en tu mensaje 😠")
        await ctx.message.delete()
    mensaje = mensaje or (f"{ctx.message.author.mention}, Tienes que especificarme que decir tonta tonta 😠")
    mensaje_components = mensaje.split()
    if "@everyone" in mensaje_components or "@here" in mensaje_components:
        await ctx.send(f"{ctx.message.author.mention}, No puedes poner everyone o here en tu mensaje 😠")
        await ctx.message.delete()
        return
    await ctx.message.delete()
    await ctx.send(mensaje)



#Youtube, hace una busqueda en youtube y devuelve el link del primer resultado.
@client.command()
async def yt(ctx, *, search):
    results = YoutubeSearch(search, max_results=1).to_dict()
    await ctx.send(f"**{str(results[0]['title'])}**" + "\nhttps://www.youtube.com" + str(results[0]['url_suffix']))



#El check que verifica si el comando esta siendo ejecutado en el server correcto.
def is_it_lepirus_guild(ctx):
    return ctx.guild.id == 781631210262495292

#Un comando privado para un server especifico.
@client.command()
@commands.check(is_it_lepirus_guild)
async def schonkcreate(ctx):
    
    choices = open('choices/choices4.json', 'r')
    choices1 = open('choices/choices5.json', 'r')
    choices2 = open('choices/choices6.json', 'r')
    a1 = json.load(choices)
    a2 = json.load(choices1)
    a3 = json.load(choices2)    
    choose = random.choice(list(a1.values()))
    choose1 = random.choice(list(a2.values()))
    choose2 = random.choice(list(a3.values()))
    embed = discord.Embed(colour=discord.Colour(0xf5a623), description=f"**{str(choose)+str(choose1)+str(choose2)}**")
    await ctx.send(embed=embed)
    choices.close()
    choices1.close()
    choices2.close()



#Serverinfo, Devuelve un embed con un puñado de informacion sobre el servidor donde fue ejecutado el comando.
@client.command()
async def serverinfo(ctx):
    embed = discord.Embed(title=f"🖥️ {ctx.guild.name}", colour=discord.Colour(0xf5a623))

    embed.set_footer(text="Holas!", icon_url="https://cdn.discordapp.com/avatars/796797535208341544/c6b3f004ea31246515f88524518984ff.png")
    embed.set_thumbnail(url=ctx.guild.icon_url)
    embed.add_field(name="ID Del Servidor:", value=f"```{ctx.guild.id}```", inline= False)
    embed.add_field(name="Creado en:", value=ctx.guild.created_at, inline= False)  
    embed.add_field(name="Propietario:",value=f"<@{ctx.guild.owner_id}>", inline= False)
    embed.add_field(name="Región:",value=f"__{ctx.guild.region}__", inline= False)
    embed.add_field(name="Cantidad de Miembros:", value=ctx.guild.member_count, inline= False)
    embed.add_field(name="Nivel de Seguridad:", value=ctx.guild.mfa_level, inline= False)
    embed.add_field(name="Canal por defecto:", value=f"<#{ctx.guild.rules_channel.id}>", inline= False)
    embed.add_field(name="Canales:", value=f"{len(ctx.guild.text_channels)} Texto | {len(ctx.guild.voice_channels)} Voz | **{len(ctx.guild.text_channels) + len(ctx.guild.voice_channels)}** Total", inline= False)
    embed.add_field(name="Cantidad de Roles:", value=f"{len(ctx.guild.roles)}", inline= False)
    await ctx.send(embed=embed)



#UserInfo, Devuelve un embed con informacion sobre el usuario que ejecuta el mensaje o el aclarado con una mencion
@client.command()
async def userinfo(ctx, user: discord.Member = None):
    if user == None:
        user = ctx.message.author
    embed = discord.Embed(title=user.name + "#" + str(user.discriminator), colour=discord.Colour(0xf5a623))
    embed.set_thumbnail(url=user.avatar_url)
    embed.set_footer(text="Holas!", icon_url="https://cdn.discordapp.com/avatars/796797535208341544/c6b3f004ea31246515f88524518984ff.png")
    embed.add_field(name="Apodo", value=user.display_name, inline=True)
    embed.add_field(name="ID", value=user.id, inline=True)
    embed.add_field(name="Creado en:", value=user.created_at, inline=False)
    embed.add_field(name="Se unió en:", value=user.joined_at, inline=False)
    rolelist = []
    for role in user.roles:
        rolename = role.name
        rolelist.append(rolename)
    rolelist.remove('@everyone')
    embed.add_field(name=f"Roles[{len(user.roles) - 1}]:", value= f"{str(', ').join(rolelist)}.", inline=False)
    await ctx.send(embed=embed)



#Avatar, Devuelve el avatar del usuario que ejecuta el comando o el especificado con una mención
@client.command()
async def avatar(ctx, user: discord.Member = None):
    if user == None:
        user = ctx.message.author
    embed = discord.Embed(colour=discord.Colour(0xf5a623))
    embed.set_image(url=user.avatar_url_as(format='png' or 'gif', size=1024))
    await ctx.send(embed=embed)


#Enlarge, devuelve la url de la imagen de un emote
@client.command()
async def enlarge(ctx, emote: discord.Emoji):
    embed = discord.Embed(colour=discord.Colour(0xf5a623))
    embed.set_image(url=emote.url_as(format='png' or 'gif'))
    await ctx.send(embed=embed)

#Avisa si el emote declarado no existe o no se encuentra en el servidor.
@enlarge.error
async def emojinotfound_error(ctx, error):
    if isinstance(error, discord.ext.commands.EmojiNotFound):
        embed = discord.Embed(title="Error", description="No se ha encontrado el emoji.", colour= discord.Colour(0xf5a623))
        await ctx.send(embed=embed)



#Ban, banea al usuario declarado con la razon declarada
@commands.has_permissions(administrator=True, ban_members=True)
@client.command()
async def ban(ctx, user: discord.User = None):
    embed = discord.Embed(title="You're going to brazil", description=f"El usuario {user.mention} ha sido correctamente enviado a Brasil", colour= discord.Colour(0xf5a623))
    embed.set_image(url="https://tenor.com/view/crane-brazil-grab-poor-car-gif-17372636.gif")
    user = await client.fetch_user(user.id)
    await user.send("https://cdn.discordapp.com/attachments/781631210262495296/802260477161898034/video0-3.mp4")
    await ctx.channel.send(embed=embed)
    await ctx.guild.ban(user)

@commands.has_permissions(administrator=True, ban_members=True)
@client.command()
async def unban(ctx, user: discord.User = None):
    embed = discord.Embed(colour= discord.Colour(0xf5a623), description="[Acho ponte el chambergo](https://discord.gg/rxVfZZJcJ8)", title="Acho abre el enlace")
    embed2 = discord.Embed(colour= discord.Colour(0xf5a623), description=f"El usuario {user.mention} ha vuelto de brasil")
    embed2.set_image(url="https://cdn.discordapp.com/attachments/781631210262495296/808869945643106355/image0.jpg")
    user = await client.fetch_user(user.id)
    await user.send(embed=embed)
    await ctx.channel.send(embed=embed2)
    await ctx.guild.unban.user

client.run(token)