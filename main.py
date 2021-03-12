import discord, os, datetime, random, json, requests
from discord.ext import commands
from youtube_search import YoutubeSearch
from googlesearch import search
from tld import parse_tld
from google_images_search import GoogleImagesSearch
import asyncio

#Hace login usando una variable de entorno para no revelar publicamente el token del bot.
intents= discord.Intents.all()
client = commands.Bot(command_prefix=commands.when_mentioned_or("h!"), help_command=None, activity=discord.Game(name="h!help", start=datetime.datetime.utcnow(), intents=intents, case_insensitive=True))
token = os.environ.get('TOKEN')
gis = GoogleImagesSearch(os.environ.get("GCS_DEVELOPER_KEY"),os.environ.get("GCS_CX"))
#########################/


#Devuelve en la consola informacion sobre el cliente, because why not.
@client.event
async def on_ready():
    print("Holas!")
    print('Iniciando sesion como:')
    print("Username: " + client.user.name+ "#" + client.user.discriminator)
    print("ID: " + str(client.user.id))
    print("Token: " + token)
    print("Servers: " + str(len(client.guilds)))
#########################/

#Error Handling para ciertas Exceptions al ejecutar comandos.
@client.event
async def on_command_error(ctx, error):
    if isinstance(error, discord.ext.commands.errors.CommandNotFound):
        embed = discord.Embed(timestamp=datetime.datetime.utcnow(), title="Error", description="El comando que intentas usar no existe!.", colour= discord.Colour(0xf5a623))
        await ctx.send(embed=embed)

    if isinstance(error, discord.ext.commands.errors.MemberNotFound):
        embed = discord.Embed(timestamp=datetime.datetime.utcnow(), title="Error", description="No se ha encontrado al usuario.", colour= discord.Colour(0xf5a623))
        await ctx.send(embed=embed)

    if isinstance(error, discord.ext.commands.errors.MissingRequiredArgument):
        embed = discord.Embed(timestamp=datetime.datetime.utcnow(), title="Error", description="Por favor declara los argumentos requeridos.", colour= discord.Colour(0xf5a623))
        await ctx.send(embed=embed)

    if isinstance(error, discord.ext.commands.MissingPermissions):
        embed = discord.Embed(timestamp=datetime.datetime.utcnow(), title="Error", description="No tienes los permisos necesarios para ejecutar el comando.", colour= discord.Colour(0xf5a623))
        await ctx.send(embed=embed)

    if isinstance(error, discord.ext.commands.UserNotFound):
        embed = discord.Embed(timestamp=datetime.datetime.utcnow(), title="Error", description="No se ha encontrado al usuario.", colour= discord.Colour(0xf5a623))
        await ctx.send(embed=embed)

    if isinstance(error, Exception):
        print(error)
#########################/



#Help, Embed con una lista de todos los comandos públicos.
@client.command(usage="`help`", help="Muestra este mensaje (duh)")
async def help(ctx, cmdname = None):
    embed = discord.Embed(timestamp=datetime.datetime.utcnow(), title="Ayuda", description="Acá una lista de todos los comandos del bot, para una descripcion detallada de un comando escribe h!help [comando]", colour=discord.Colour(0xf5a623))
    embed.set_thumbnail(url="https://cdn.discordapp.com/avatars/796797535208341544/c6b3f004ea31246515f88524518984ff.png")
    embed.set_author(name=ctx.message.author.name, icon_url=ctx.message.author.avatar_url)
    embed.set_footer(text="Prefix: h!")
    embed.add_field(name="Administración/Moderación", value="`ban` `unban`")
    embed.add_field(name="Informativos", value="`avatar` `serverinfo` `userinfo` `help` `enlarge` `ping`")
    embed.add_field(name="Diversión", value="`google` `tenor` `hola` `say` `dado` `coin`")

    if cmdname == None:
        await ctx.send(content=f"Holas!, {ctx.message.author.mention} aquí tienes tu ayuda", embed=embed)
    else:
        cmd = client.get_command(cmdname)
        cmdembed = discord.Embed(timestamp=datetime.datetime.utcnow(), colour=discord.Colour(0xf5a623), title=cmd.name.capitalize())
        cmdembed.add_field(name="Uso", value=cmd.usage, inline=False)
        cmdembed.add_field(name="Función :nut_and_bolt:", value=cmd.help, inline=False)
        cmdembed.add_field(name="Notas :notepad_spiral:", value=cmd.brief, inline=False)
        await ctx.send(embed=cmdembed)
#########################/



#Ping. Devuelve un embed con la latencia hacia la api de Discord.
@client.command(usage="`ping`", help="Muestra la latencia del bot con discord", brief="No se han especificado notas en este comando")
async def ping(ctx):
    embed = discord.Embed(timestamp=datetime.datetime.utcnow(), colour=discord.Colour(0xf5a623),description="La latencia del bot es: " + f"**{round(client.latency*1000)}**ms")
    await ctx.send(embed=embed)
#########################/



#Say, Devuelve el mensaje que el usuario declaró despues del comando.
@client.command(usage="`say|s [mensaje]`", help="Hace que el bot responda con[mensaje]", brief="No se han especificado notas en este comando", aliases=["s"])
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
#########################/



#Youtube, hace una busqueda en youtube y devuelve el link del primer resultado.
@client.command(usage="`yt|youtube [video]`", help="Hace una busqueda en youtube usando [video] y devuelve el primer resultado", brief="No se han especificado notas en este comando", aliases=["youtube","video"])
async def yt(ctx, *, search):
    results = YoutubeSearch(search, max_results=1).to_dict()
    await ctx.send(f"**{str(results[0]['title'])}**" + "\nhttps://www.youtube.com" + str(results[0]['url_suffix']))
#########################/
    


#El check que verifica si el comando esta siendo ejecutado en el server correcto.
def is_it_lepirus_guild(ctx):
    return ctx.guild.id == 781631210262495292
#Unos comandos privado para un server especifico.
@client.command(usage="", help="", brief="No se han especificado notas en este comando", )
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
    embed = discord.Embed(timestamp=datetime.datetime.utcnow(), colour=discord.Colour(0xf5a623), description=f"**{str(choose)+str(choose1)+str(choose2)}**")
    await ctx.send(embed=embed)
    choices.close()
    choices1.close()
    choices2.close()

@client.command(usage="", help="", brief="No se han especificado notas en este comando", )
@commands.check(is_it_lepirus_guild)
async def achometro(ctx):
    rangelist = []
    rangelist2 = []
    rangelist3 = []
    z = 0
    x = random.randrange(2,100)
    idlist = [ 
        366521206326820869,
        519534411880988673,
        546031227266793472,
        624136223253987329,
        492815944666578975,
        574386627091234818
    ]
    if ctx.message.author.id in idlist:
        x = 100
        spembed = discord.Embed(timestamp=datetime.datetime.utcnow(), colour=(0xf5a623), title="Acho que tu nivel de Acho es:", description="**100%**")
        spembed.set_image(url="https://cdn.discordapp.com/attachments/774051815950909493/810627964185215116/bandera-de-extremadura.gif")
        await ctx.channel.send(embed=spembed)
        return
    else:
        for i in range(1, x, 10):
            i = "<:lime_concrete:810312413026582548>"
            i2 = "<:white_concrete:810311770341769247>"
            i3 = "<:black_concrete:810311770501414922>"
            rangelist.append(i)
            rangelist2.append(i2)
            rangelist3.append(i3)
    embed = discord.Embed(timestamp=datetime.datetime.utcnow(), colour=discord.Colour(0xf5a623), title="Acho que tu nivel de Acho es:", description=f"{''.join(rangelist)}   **{x}%**\n{''.join(rangelist2)}\n{''.join(rangelist3)}")
    
    await ctx.channel.send(embed=embed)
#########################/


#Serverinfo, Devuelve un embed con un puñado de informacion sobre el servidor donde fue ejecutado el comando.
@client.command(usage="`serverinfo|svinf`", help="Muestra información sobre este servidor", brief="No se han especificado notas en este comando", aliases=["svinfo", "svinf", "guild", "guildinfo"])
async def serverinfo(ctx):
    embed = discord.Embed(timestamp=datetime.datetime.utcnow(), title=f"🖥️ {ctx.guild.name}", colour=discord.Colour(0xf5a623))
    embed.set_footer(text="Holas!", icon_url="https://cdn.discordapp.com/avatars/796797535208341544/c6b3f004ea31246515f88524518984ff.png")
    embed.set_thumbnail(url=ctx.guild.icon_url)
    embed.add_field(name="ID Del Servidor:", value=f"```{ctx.guild.id}```", inline= False)
    embed.add_field(name="Creado en:", value=ctx.guild.created_at, inline= False)  
    embed.add_field(name="Propietario:",value=f"<@{ctx.guild.owner_id}>", inline= False)
    embed.add_field(name="Región:",value=f"__{ctx.guild.region}__", inline= False)
    embed.add_field(name="Cantidad de Miembros:", value=ctx.guild.member_count, inline= False)
    embed.add_field(name="Nivel de Seguridad:", value=ctx.guild.mfa_level, inline= False)   
    embed.add_field(name="Canales:", value=f"{len(ctx.guild.text_channels)} Texto | {len(ctx.guild.voice_channels)} Voz | **{len(ctx.guild.text_channels) + len(ctx.guild.voice_channels)}** Total", inline= False)
    embed.add_field(name="Cantidad de Roles:", value=f"{len(ctx.guild.roles)}", inline= False)
    await ctx.send(embed=embed)
#########################/



#UserInfo, Devuelve un embed con informacion sobre el usuario que ejecuta el mensaje o el aclarado con una mencion
@client.command(usage="`userinfo|whois [usuario/mención/id/nombre]`", help="Muestra informacion sobre [usuario] o la persona que ejecuta el comando", brief="No se han especificado notas en este comando", aliases=["uinfo", "uinf", "whois"])
async def userinfo(ctx, user: discord.Member = None):
    if user == None:
        user = ctx.message.author
    embed = discord.Embed(timestamp=datetime.datetime.utcnow(), title=user.name + "#" + str(user.discriminator), colour=discord.Colour(0xf5a623))
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
#########################/



#Avatar, Devuelve el avatar del usuario que ejecuta el comando o el especificado con una mención
@client.command(usage="`avatar|av [usuario/mención/id/nombre]`", help="Hace que el bot responda con el avatar de [usuario] o la persona que ejecuta el comando", brief="No se han especificado notas en este comando", aliases=["av"])
async def avatar(ctx, user: discord.Member = None):
    if user == None:
        user = ctx.message.author
    embed = discord.Embed(timestamp=datetime.datetime.utcnow(), colour=discord.Colour(0xf5a623))
    embed.set_image(url=user.avatar_url_as(format='png' or 'gif', size=1024))
    await ctx.send(embed=embed)
#########################/



#Enlarge, devuelve la url de la imagen de un emote
@client.command(usage="`enlarge|e [emoji]`", help="Hace que el bot responda con la imagen de [emote]", brief="No se han especificado notas en este comando", aliases=["e"])
async def enlarge(ctx, emote: discord.Emoji):
    embed = discord.Embed(timestamp=datetime.datetime.utcnow(), colour=discord.Colour(0xf5a623))
    embed.set_image(url=emote.url_as(format='png' or 'gif'))
    await ctx.send(embed=embed)

#Avisa si el emote declarado no existe o no se encuentra en el servidor.
@enlarge.error
async def emojinotfound_error(ctx, error):
    if isinstance(error, discord.ext.commands.EmojiNotFound):
        embed = discord.Embed(timestamp=datetime.datetime.utcnow(), title="Error", description="No se ha encontrado el emoji.", colour= discord.Colour(0xf5a623))
        await ctx.send(embed=embed)
#########################/



#Ban, banea al usuario declarado con la razon declarada
@commands.has_permissions(administrator=True, ban_members=True)
@client.command(usage="`ban [usuario/mención/id/nombre]`", help="Banea al [usuario] especificado, funciona con gente fuera del servidor también.", brief="No se han especificado notas en este comando", )
async def ban(ctx, user: discord.User, *, reason = None):
    if user == ctx.message.author:
        embed = discord.Embed(timestamp=datetime.datetime.utcnow(), title="¡Ey!", description=f":warning: {user.mention} No puedes autobanearte :warning:", colour= discord.Colour(0xf5a623))
        await ctx.channel.send(embed=embed)
        return
    else:
        embed = discord.Embed(timestamp=datetime.datetime.utcnow(), title="You're going to brazil", description=f"El usuario {user.mention} ha sido correctamente enviado a Brasil", colour= discord.Colour(0xf5a623))
        embed.set_image(url="https://tenor.com/view/crane-brazil-grab-poor-car-gif-17372636.gif")
        await user.send("https://cdn.discordapp.com/attachments/781631210262495296/802260477161898034/video0-3.mp4")
        await ctx.channel.send(embed=embed)
        await ctx.guild.ban(user, reason=reason)
#########################/



#Unban, desbanea al usuario declarado con la razon declarada
@commands.has_permissions(administrator=True, ban_members=True)
@client.command(usage="`unban [id/nombre]`", help="Desbanea al [usuario] especificado", brief="No se han especificado notas en este comando", )
async def unban(ctx, user: discord.User):
    embed = discord.Embed(timestamp=datetime.datetime.utcnow(), colour= discord.Colour(0xf5a623), description=f"Has sido desbaneado de **{ctx.guild.name}**", title="Atención")
    embed2 = discord.Embed(timestamp=datetime.datetime.utcnow(), colour= discord.Colour(0xf5a623), description=f"El usuario {user.mention} ha vuelto de brasil")
    embed2.set_image(url="https://cdn.discordapp.com/attachments/781631210262495296/808869945643106355/image0.jpg")
    await user.send(embed=embed)
    await ctx.channel.send(embed=embed2)
    await ctx.guild.unban(user)
#########################/



#¡El HolasBot te saludará!
@client.command(usage="`hola [usuario/mención/id/nombre]`", help="Hace que el bot responda con un saludo hacia un [usuario] o la persona que ejecuta el comando", brief="No se han especificado notas en este comando",aliases=["hi","holas"])
async def hola(ctx, *, member: discord.Member = None):
    author = ctx.message.author
    message1 =  f"¡El Usuario {author.name} te ha saludado! :"
    if member == None or member == ctx.message.author:
        member = ctx.message.author
        author = client.user
        message1 = f"¡Hola {member.name}! Te mando un saludo :"
    holaembed = discord.Embed(timestamp=datetime.datetime.utcnow(), colour=discord.Colour(0xf5a623), title="¡Hola!",description=f"{member.mention}",clearmention = False)
    holaembed.add_field(name=message1,value= ":wave:",inline=False)
    holaembed.set_author(icon_url=author.avatar_url, name=author.name)
    await ctx.send(embed = holaembed)
#########################/



#Google, Realiza una busqueda usando una api de google y devuelve los 5 primeros resultados
@client.command(usage="`google [busqueda]`", help="Hace que el bot responda con una busqueda rápida en Google dandote a elegir de 5 opciones", brief="No se han especificado notas en este comando", aliases=["g"])
async def google(ctx, * ,search1 = None):
    if search1 == None:
        embed = discord.Embed(timestamp=datetime.datetime.utcnow(), title="Error", description=f"{ctx.message.author.mention} Haz una búsqueda.", colour= discord.Colour(0xf5a623))
        await ctx.channel.send(embed=embed)
    else:
        search2 = search(search1,stop=5,lang="es")
        urls = [next(search2),next(search2),next(search2),next(search2),next(search2)]
        titles = [parse_tld(urls[0]),parse_tld(urls[1]),parse_tld(urls[2]),parse_tld(urls[3]),parse_tld(urls[4])]
        embed = discord.Embed(timestamp=datetime.datetime.utcnow(), title=search, description="Resultados:", colour= discord.Colour(0xf5a623))
        embed.set_author(name=ctx.message.author,icon_url=ctx.message.author.avatar_url)
        embed.add_field(inline=False,name=f"{titles[0][1]}",value=urls[0])
        embed.add_field(inline=False,name=f"{titles[1][1]}",value=urls[1])
        embed.add_field(inline=False,name=f"{titles[2][1]}",value=urls[2])
        embed.add_field(inline=False,name=f"{titles[3][1]}",value=urls[3])
        embed.add_field(inline=False,name=f"{titles[4][1]}",value=urls[4])
        await ctx.channel.send(embed=embed)
#########################/



#Img, hace una busqueda en google imagenes y devuelve el primer resultado.
@client.command(usage="`img [busqueda]`", help="Busca una imagen dependiendo el termino [busqueda]", brief="No se han especificado notas en este comando", aliases=["image"])
async def img(ctx, *, search):
    search_params = {
        "q": search,
        "num": 1,
        "safe": 'medium',
        "fileType": 'jpg',
        "imgType": 'photo',
        "imgSize": 'LARGE'
    }
    
    gis.search(search_params=search_params, path_to_dir="", custom_image_name="image")
    for image in gis.results():
        image.download("images")
    imagefile = discord.File(filename="image.png", fp="images/image.jpg")
    embed = discord.Embed(timestamp=datetime.datetime.utcnow(), colour= discord.Colour(0xf5a623), title="Aquí esta su resultado!")
    await ctx.send(embed=embed, file=imagefile)
    os.remove("images/image.jpg")
#########################/


#Tenor, hace una busqueda en tenor, agarra los 15 primeros resultados, selecciona uno aleatorio y lo devuelve.
@client.command(usage="`tenor [busqueda]`", help="Busca un gif aleatorio según el termino [busqueda] y devuelve uno aleatorio de una lista de 15 resultados", brief="No se han especificado notas en este comando", aliases=["t", "gif"])
async def tenor(ctx, *, search_term):
    embed = discord.Embed(timestamp=datetime.datetime.utcnow(), color=0xf5a623, title="¡Aquí esta su resultado!")
    
    akey = "JBZCHHI0B0BO"
    lmt = 15

    r = requests.get (f"https://g.tenor.com/v1/search?q={search_term}&key={akey}&limit={lmt}")
    if r.status_code == 200:
        gifs = json.loads(r.content)
        b = random.choice(gifs['results'])
        embed.set_image(url=b["media"][0]["mediumgif"]["url"])
        embed.set_footer(text=b["title"])
    await ctx.send(embed=embed)
#########################/

#Coin, Girará una moneda, cayendo cara o cruz.
@client.command(usage="`coin`", help="Devolverá cara o cruz dependiendo de tu suerte", brief="No se han especificado notas en este comando",aliases=["coinflip","volado"])
async def coin(ctx):
    coin1 = random.choice(["cara","cruz"])
    if coin1 == "cara":
        image = "https://media.discordapp.net/attachments/816087291482734613/820002905816956938/Holas_Coin.png?width=383&height=383"
    else:
        image = "https://media.discordapp.net/attachments/816087291482734613/820002942748327956/Holas_Coin2.png?width=383&height=383"
    embed = discord.Embed(title="Coin", description=f"¡Salió {coin1}!",colour= discord.Colour(0xf5a623))
    embed.set_author(name=ctx.message.author.name,icon_url=ctx.message.author.avatar_url)
    embed.set_image(url=image)
    await ctx.send(embed=embed)
#########################/

#Girará un dado y te dará el resultado.
@client.command(usage="`dado`", help="Girará un dado devolviendo un valor del 1 al 6", brief="No se han especificado notas en este comando",aliases=["dice","die","dados"])
async def dado(ctx):
    urlist = ["https://media.discordapp.net/attachments/816087291482734613/820022423130603590/1.png?width=87&height=87", 
    "https://media.discordapp.net/attachments/816087291482734613/820022426174750760/2.png?width=87&height=87",
    "https://media.discordapp.net/attachments/816087291482734613/820022428175433737/3.png?width=87&height=87",
    "https://media.discordapp.net/attachments/816087291482734613/820022430092361748/4.png?width=87&height=87",
    "https://media.discordapp.net/attachments/816087291482734613/820022431166365757/5.png?width=87&height=87",
    "https://media.discordapp.net/attachments/816087291482734613/820022434618015765/6.png?width=87&height=87"]
    x = random.randint(1,6)
    await ctx.send(embed=discord.Embed(title=f"Tu dado es {x}",colour= discord.Colour(0xf5a623)).set_image(url=urlist[x - 1]).set_author(name=ctx.message.author.name,icon_url=ctx.message.author.avatar_url))
#########################/

client.run(token)