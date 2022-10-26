import DiscordJs, { ApplicationCommandOptionType, GatewayIntentBits, ActivityType, EmbedBuilder } from 'discord.js'
import google from 'googlethis'
import dotenv from 'dotenv'

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

// Create a new client and set the intents
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

// When the client is ready, register the slash commands
client.on('ready', () => {
    console.log('Bot is up bitch')

    client.user?.setPresence({ 
        activities: [{ 
            name: 'you',
            type: ActivityType.Watching,
        }],
    })
    client.user?.setStatus('online');


    // Register the guild
    const guildID = '950536786235490325'
    const guild = client.guilds.cache.get(guildID)
    let commands

    if (guild) {
        commands = guild.commands
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
})

// Listen for slash commands
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    const { commandName, options } = interaction

    if (commandName === 'ping') {                       // Ping command
        interaction.reply({
            content: `pong ${client.ws.ping}ms`,
            ephemeral: false,
        })
    } else if (commandName === 'help') {                // Help help!
        const embed = new EmbedBuilder()
            .setTitle('Help help!')
            .setDescription('How to use the bot!!!!!')
            .addFields(
                { name: 'ping', value: 'Sends bots current ping'},
                { name: 'help', value: 'Shows this message' },
                { name: 'add', value: 'Adds two numbers' },
                { name: 'google', value: 'Searches google' },
            )
            .setFooter({
                text: 'Made by Fluffy Bean#5212',
            })
            .setColor('#FEBBEC')
            .setThumbnail('https://i.imgur.com/6Kj9knK.jpeg')
        
        interaction.reply({
            embeds: [embed],
            ephemeral: true,
        })
    } else if (commandName === 'add') {                 // Add command
        const num1 = options.getNumber('1st')!
        const num2 = options.getNumber('2nd')!

        interaction.reply({
            content: `The sum is ${num1 + num2}`,
            ephemeral: false,
        })
    } else if (commandName === 'google') {              // Google command
        const query = options.getString('query')!
        const results = await google.search(query, opt)

        if (!results) {
            interaction.reply({
                content: 'No results found',
                ephemeral: true,
            })
        } else if (results['translation']['source_language']) {
            const source_lang = results['translation']['source_language'] || 'Unknown'
            const source_text = results['translation']['source_text'] || 'Unknown'
            const target_lang = results['translation']['target_language'] || 'Unknown'
            const target_text = results['translation']['target_text']|| 'Unknown'

            const embed = new EmbedBuilder()
            
            .setFooter({ text: 'Made by Fluffy Bean#5212' })
            .setColor('#FEBBEC')


            .setFields(
                { name: source_lang, value: source_text },
                { name: target_lang, value: target_text }
            )

            interaction.reply({
                embeds: [embed],
                ephemeral: false,
            })
        } else if (results['knowledge_panel']['title']) {
            const embed = new EmbedBuilder()

            .setFooter({ text: 'Made by Fluffy Bean#5212' })
            .setColor('#FEBBEC')
            .setTitle(results['knowledge_panel']?.title)
            .setDescription(results['knowledge_panel']?.description)

            if (results['knowledge_panel']['images'][0]?.url) {
                embed.setImage(results['knowledge_panel']['images'][0]['url'])
            }
            if (results['knowledge_panel']?.url) {
                embed.setURL(results['knowledge_panel']['url'])
            }

            interaction.reply({
                embeds: [embed],
                ephemeral: false,
            })
        } else {
            const embed = new EmbedBuilder()

            .setFooter({ text: 'Made by Fluffy Bean#5212' })
            .setColor('#FEBBEC')
            .setTitle(results['results'][0]?.title)
            .setDescription(results['results'][0]?.description)

            if (results['results'][0]?.url) {
                embed.setImage(results['results'][0]['url'])
            }

            interaction.reply({
                embeds: [embed],
                ephemeral: false,
            })
        }
    } else if (commandName === 'image') {
        const query = options.getString('query')!
        const images = await google.image(query, opt);

        if (!images) {
            interaction.reply({
                content: 'No images found',
                ephemeral: true,
            })
        } else {
            const count = images.length
            const random = Math.floor(Math.random() * count)
            const embed = new EmbedBuilder()

            .setFooter({ text: 'Made by Fluffy Bean#5212' })
            .setColor('#FEBBEC')
            .setDescription(`Found ${count} images`)
            .setImage(images[random].url)
            try {
                embed.setTitle(images[random]['origin'].title)
                embed.setURL(images[random]['origin']['website'].url)
            } finally {
                interaction.reply({
                    embeds: [embed],
                    ephemeral: false,
                })
            }
        }
    }
})

// Login the client
client.login(process.env.TOKEN)