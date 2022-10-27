console.log('|+++++++++++++++++++++++|\n\
| Welcome to Joe.ts!!!! |\n\
|+++++++++++++++++++++++|')
console.log('Starting the bot now...')

import DiscordJs, { ApplicationCommandOptionType, GatewayIntentBits, ActivityType, EmbedBuilder } from 'discord.js'
import google from 'googlethis'
import Booru from 'booru'
import wiki from 'wikijs'
import dotenv from 'dotenv'

// Set booru search
const esix = Booru('e621')

// Config env file
dotenv.config()

// Google search options
const opt = {
    page: 0,
    safe: false,
    parse_ads: false,
    additional_params: { 
        hl: 'en' 
    }
}

console.log(' -> Imported all the modules')

const client = new DiscordJs.Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent
    ],
    ws: {
        properties: {
            browser: 'Discord iOS',
        }
    }
})

console.log(' -> Set up client')

// Create a new client and set the intents
const statusMessages = [
    'you',
    'deez nuts',
    'Gwa Gwa',
    'the world burn',
    `${client.guilds.cache.size} servers`,
]

// Automatically updating status
const updateStatus = () => {
    client.user?.setPresence({
        status: 'online',
        activities: [{ 
            name: statusMessages[Math.floor(Math.random() * statusMessages.length)],
            type: ActivityType.Watching,
        }],
    })

    setTimeout(updateStatus, 1000 * 60 * 1)
}

client.user?.setPresence({
    status: 'dnd',
    activities: [{ 
        name: 'To the server crying',
        type: ActivityType.Listening,
    }],
})

// When the client is ready, register the slash commands
client.on('ready', () => {
    // Register the guild
    const guildID = ['950536786235490325', '860295331396845619']
    const guild = client.guilds.cache.get(guildID[0])
    const guild2 = client.guilds.cache.get(guildID[1])
    let commands

    if (guild) {
        commands = guild.commands
    } else {
        commands = client.application?.commands
    }

    if (guild2) {
        commands = guild2.commands
    } else {
        commands = client.application?.commands
    }

    // Create ping command
    commands?.create({
        name: 'ping',
        description: 'Sends bots current ping',
    })

    commands?.create({
        name: 'help',
        description: 'Help help!',
    })

    // Create add command
    commands?.create({
        name: 'add',
        description: 'Adds two numbers',
        options: [
            {
                name: '1st',
                description: 'The first number',
                required: true,
                type: ApplicationCommandOptionType.Number,
            },
            {
                name: '2nd',
                description: 'The second number',
                required: true,
                type: ApplicationCommandOptionType.Number,
            }
        ]
    })

    // Create google command
    commands?.create({
        name: 'google',
        description: 'Searches google',
        options: [
            {
                name: 'query',
                description: 'Queryt to search',
                required: true,
                type: ApplicationCommandOptionType.String,
            }
        ]
    })

    // Create image search command
    commands?.create({
        name: 'image',
        description: 'Searches google images',
        options: [
            {
                name: 'query',
                description: 'Image to search',
                required: true,
                type: ApplicationCommandOptionType.String,
            }
        ]
    })

    // Create e621 search command
    commands?.create({
        name: 'e621',
        description: 'Searches e621',
        options: [
            {
                name: 'query',
                description: 'Post to search',
                required: true,
                type: ApplicationCommandOptionType.String,
            }
        ]
    })

    // Create wiki command
    commands?.create({
        name: 'wiki',
        description: 'Searches wikipedia',
        options: [
            {
                name: 'query',
                description: 'Query to search',
                required: true,
                type: ApplicationCommandOptionType.String,
            }
        ]
    })

    console.log(' -> Registered slash commands')

    console.log('Bot is up bitch')
    updateStatus()
})


// Listen for slash commands
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    const { commandName, options } = interaction

    switch (commandName) {
        case 'ping': {
            interaction.reply({
                content: `pong ${client.ws.ping}ms`,
                ephemeral: false,
            })

            break
        }
        case 'help': {
            const embed = new EmbedBuilder()
                try {
                    const images = await google.image('Maned Wolf', opt)
                    embed.setThumbnail(images[Math.floor(Math.random() * images.length)]['url'])
                } finally {
                    embed.setTitle('Help help!')
                    embed.setDescription('How to use the bot!!!!!')
                    embed.addFields(
                        { name: 'ping', value: 'Sends bots current ping, used for testing'},
                        { name: 'help', value: 'Shows this message' },
                        { name: 'add', value: 'Adds two numbers, used for testing' },
                        { name: 'google', value: 'Searches google, can add specific searches such as definition and translate' },
                        { name: 'wiki', value: 'Searches wikipedia' },
                        { name: 'image', value: 'Searches for a random image from google related to your search' },
                        { name: 'e621', value: 'Searches for a random image from e621 related to your search, still being tested' },
                    )
                    embed.setFooter({ text: 'Made by Fluffy Bean#5212', })
                    embed.setColor('#8C977D')
                }
            

            
            interaction.reply({
                embeds: [embed],
                ephemeral: true,
            })
            
            break
        }
        case 'add': {
            await interaction.deferReply({
                ephemeral: false,
            })
    
            const num1 = options.getNumber('1st')!
            const num2 = options.getNumber('2nd')!
    
            interaction.editReply({
                content: `The sum is ${num1 + num2}`,
            })

            break
        }
        case 'google': {
            await interaction.deferReply({
                ephemeral: false,
            })
    
            const query     = options.getString('query')!
            const results   = await google.search(query, opt)
    
            if (!results) {
                interaction.reply({
                    content: 'No results found',
                    ephemeral: true,
                })
            } else if (results['translation']['source_language']) {
                const source_lang   = results['translation']['source_language'] || 'Unknown'
                const source_text   = results['translation']['source_text'] || 'Unknown'
                const target_lang   = results['translation']['target_language'] || 'Unknown'
                const target_text   = results['translation']['target_text']|| 'Unknown'
    
                const embed         = new EmbedBuilder()
                
                .setFooter({ text: 'Made by Fluffy Bean#5212' })
                .setColor('#8C977D')
    
                .setFields(
                    { name: source_lang, value: source_text },
                    { name: target_lang, value: target_text }
                )
    
                interaction.editReply({
                    embeds: [embed],
                })
            } else if (results['knowledge_panel']['title']) {
                const embed = new EmbedBuilder()
    
                .setFooter({ text: 'Made by Fluffy Bean#5212' })
                .setColor('#8C977D')
                .setTitle(results['knowledge_panel']['title'])
                .setDescription(results['knowledge_panel']['description'])
    
                if (results['knowledge_panel']['images'][0]?.url) {
                    embed.setImage(results['knowledge_panel']['images'][0]['url'])
                }
                if (results['knowledge_panel']?.url) {
                    embed.setURL(results['knowledge_panel']['url'])
                }
    
                for (const key in results['knowledge_panel']['metadata']) {
                    const data = results['knowledge_panel']['metadata'][key]
                    const name = data['title'] || 'Unknown title'
                    const value = data['value'] || 'Unknown value'
    
                    embed.addFields({ name: name, value: value , inline: true })
                }
    
                interaction.editReply({
                    embeds: [embed],
                })
            } else if (results['dictionary']['word']) {
                const embed = new EmbedBuilder()
    
                .setFooter({ text: 'Made by Fluffy Bean#5212' })
                .setColor('#8C977D')
                .setTitle(results['dictionary']['word'])
                .setDescription(results['dictionary']['phonetic'])
    
                for (const key in results['dictionary']['definitions']) {
                    const name = results['dictionary']['definitions'][key] || 'Unknown definition'
                    const value = results['dictionary']['examples'][key] || 'No example'
    
                    embed.addFields({ name: name, value: value , inline: true })
                }
    
                interaction.editReply({
                    embeds: [embed],
                })
            } else {
                const embed = new EmbedBuilder()
    
                .setFooter({ text: 'Made by Fluffy Bean#5212' })
                .setColor('#8C977D')
                .setTitle(results['results'][0]['title'])
                .setDescription(results['results'][0]['description'])
    
                if (results['results'][0]?.url) {
                    embed.setURL(results['results'][0]['url'])
                }
    
                interaction.editReply({
                    embeds: [embed],
                })
            }

            break
        }
        case 'image': {
            await interaction.deferReply({
                ephemeral: false,
            })
    
            const query     = options.getString('query')!
            const images    = await google.image(query, opt)
    
            if (!images) {
                interaction.editReply({
                    content: 'No images found',
                })
            } else {
                const count     = images.length
                const random    = Math.floor(Math.random() * count)
                const embed     = new EmbedBuilder()
    
                .setFooter({ text: 'Made by Fluffy Bean#5212' })
                .setColor('#8C977D')
                .setDescription(`${query}`)
                .setImage(images[random]['url'])
                .addFields(
                    { name: 'Resolution', value: `${images[random]['width']} x ${images[random]['height']}`, inline: true },
                    { name: 'ID', value: images[random]['id'], inline: true },
                )
                try {
                    embed.setTitle(images[random]['origin']['title'])
                    embed.setURL(images[random]['origin']['website']['url'])
                } finally {
                    interaction.editReply({
                        embeds: [embed],
                    })
                }
            }

            break
        }
        case 'e621': {
            await interaction.deferReply({
                ephemeral: false,
            })
    
            const query = options.getString('query')!
    
            esix.search([query], { limit: 1, random: true })
            .then(posts => {
                for (let post of posts) {
                    if (!post) {
                        interaction.editReply({
                            content: 'No results found',
                        })
                    } else {
                        const embed = new EmbedBuilder()
    
                        .setFooter({ text: 'Made by Fluffy Bean#5212' })
                        .setColor('#8C977D')
                        .setTitle('e621')
                        .setDescription(post.id)
                        .setImage(post.fileUrl)
                        .addFields(
                            { name: 'Rating', value: post.rating.toString(), inline: true },
                            { name: 'Score', value: post.score.toString(), inline: true },
                            { name: 'Tags', value: post.tags.toString(), inline: true },
                            { name: 'Resolution', value: `${post.width} x ${post.height}`, inline: true }
                        )
    
                        interaction.editReply({
                            embeds: [embed],
                        })
                    }
                }
            })

            break
        }
        case 'wiki': {
            await interaction.deferReply({
                ephemeral: false,
            })
    
            const query     = options.getString('query')!
            const results   = await wiki().page(query)
            const summary   = await results.summary()
            const embed     = new EmbedBuilder()
    
            .setFooter({ text: 'Made by Fluffy Bean#5212' })
            .setColor('#8C977D')
            .setTitle(results.raw.title)
            .setDescription(summary)
            .setURL(results.raw.fullurl)
            .setImage(await results.mainImage())
            .addFields(
                { name: 'Page ID', value: results.raw.pageid.toString(), inline: true },
                { name: 'Article length', value: results.raw.length.toString(), inline: true },
            )
    
            interaction.editReply({
                embeds: [embed],
            })

            break
        }
        default: {
            break
        }
    }
})

console.log(' -> Loaded commands')

// Login the client
client.login(process.env.TOKEN)