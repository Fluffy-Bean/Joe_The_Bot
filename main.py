# Imports
print("//Importing add-ons")
from google_images_search import GoogleImagesSearch
print("google image search imported")
from youtubesearchpython import *
print("youtube image search imported")
from googlesearch import search
print("google search imported")
import wikipedia
print("wikipedia search imported")
from PyDictionary import PyDictionary
dictionary = PyDictionary()
print("dictionary search imported")

# Time control
from datetime import datetime
timefull = datetime.now()
import time, random, os, numpy, string
print("python preinstalled imported")

# Discord
import discord
from discord.ext import commands
import asyncio
print("discord imported")
# Token setup
gis = GoogleImagesSearch("Token1","Token2")

# Client and Intents
print("//Indent and Client setup")
intents = discord.Intents(messages = True, guilds = True, reactions = True, members = True, presences = True)
client = commands.Bot(command_prefix = "Joe." , intents = intents)

# Activity and bot online status
print("//Setting up events")
@client.event #Startup
async def on_ready():
    await client.change_presence(activity=discord.Game("Bot is loading todays message!"))
    print('Bot is up bitch! \n')

# Live update
async def status_update():
    await client.wait_until_ready()
    try:
        # String/values update
        status_list=["Joe.help | Programmed by Fluffy Bean",f"Joe.help | In {len(client.guilds)} server(s)","Joe.help | Drink water!"]
        # Client status update
        while not client.is_closed():
            status=random.choice(status_list)
            await client.change_presence(activity=discord.Game(name=status))
            await asyncio.sleep(10)
    except ConnectionError as print_error:
        print(f"{print_error} - your internet is down again lmao")
client.loop.create_task(status_update())

# Commands start here
@client.command(aliases=["Ping","ping"]) # ping command
async def _ping(ctx):
    await ctx.send(f"Pong! {round(client.latency * 1000)}ms")
    print(f"Ping called - ping {round(client.latency * 1000)}ms\n")

@client.command(aliases=["Credit","credit","Credits","credits"]) # credits
async def _credits(ctx):
    await ctx.send(f"{ctx.author.display_name}: Development of bot started 23/12/2020 and continues to this day because of Fluffy Bean!")
    print("Credits called")

@client.command(aliases=["Coin","coin"]) # coin flip
async def _coin_flip(ctx):
    coin=["Heads","Tails"]
    await ctx.send("Flipping coin...")
    time.sleep(1)
    await ctx.send(f"{ctx.author.display_name} got {coin[random.randint(0,1)]}!")
    print("Coin flip called\n")

@client.command(aliases=["Dice","dice"]) # dice roll number
async def _dice_roll(ctx,*,number):
    await ctx.send("Rolling Dice...")
    time.sleep(1)
    await ctx.send(f"{ctx.author.display_name} got {str(random.randint(1,int(number)))}!")
    print("Dice roll called\n")

@client.command(aliases=["Wiki","wiki","Wikipedia","wikipedia"]) # wikipedia search
async def _wikipedia_search(ctx,*,question):
    await ctx.send(f"Searching {question} for {ctx.author.display_name}...")
    try:
        await ctx.send(f"{wikipedia.summary(question, sentences=2)}\n{wikipedia.page(question).url}")
    except wikipedia.exceptions.DisambiguationError:
        await ctx.send(f"Too may results for {ctx.author.display_name}'s search, be more specific such as Portal (Video Game) or Painted Dog (Animal)")
    except wikipedia.exceptions.PageError:
        await ctx.send(f"There where no results for {ctx.author.display_name}'s search! You may want to try `Joe.google {question}`")
    print("Wikipedia search called\n")

@client.command(aliases=["Meaning","meaning","Dictionary","dictionary","Dict","dict"]) # dictionary
async def _word_meaning(ctx,*,question):
    await ctx.send(f"Searching for meaning of {question} for {ctx.author.display_name}, this might take a moment")
    word_dict = str({format(dictionary.meaning(question))})
    illegal_characters = ("[]{}'")
    for char in illegal_characters:
        word_dict = word_dict.replace(char,'')
    word_dict = word_dict.replace('"',"")
    word_dict = word_dict.replace("Noun:","**Noun**:")
    word_dict = word_dict.replace("Adjective:","\n**Adjective**:")
    await ctx.send(word_dict)
    print(f"Dictionary called, searched for {question}\n")

@client.command(aliases=["Search","search","Google","google","goog"]) # google search
async def _google_search(ctx,*,question):
    await ctx.send(f"Searching google for {question}")
    await ctx.send(f"{search(question,num_results=1)[0]}")
    print(f"Google search called, searched for {question}\n")

@client.command(aliases=["Image","image"]) # Google image search
async def _google_image_search(ctx,*,question):
    _search_params = {
    "q": question,
    "num": 1,
    #"safe": "high",
    "fileType": "jpg",
}
    image_name=f"Image.{str(ctx.author)}.{random.randint(1,1000)}.{question}"
    print(f"Searching {question} for {ctx.author.display_name}")
    gis.search(search_params=_search_params, path_to_dir="images", custom_image_name=image_name)
    try:
        await ctx.send(f"Image for **{question}**",file=discord.File(f"images/{image_name}.jpg"))
    except FileNotFoundError:
        await ctx.send(f"Failed to send image for {question}")
    os.remove("images" + '/' + f"{image_name}.jpg")
    print(f"Google Image Search called, searched for {question}\n")
    
# Client
print("//Running client")
client.run("Token0")
