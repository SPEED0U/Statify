const settings = require("../settings.js");
const prefix = settings.bot.prefix;
const { MessageEmbed } = require('discord.js');
let users = {}
// Modules.
module.exports = (bot, con, message) => {
    if (message.author.bot || message.channel.type === 'dm') {
        return;
    }

    antispam(message, bot)

    if (!message.channel.permissionsFor(bot.user).has('SEND_MESSAGES')) {
        return;
    }

    if ((message.content.toLowerCase().includes('need help') || message.content.toLowerCase().includes('help me')) && (message.channel.id === settings.channel.support.needhelp || message.channel.id === settings.channel.support.bugreport)) {
        message.channel.send("Hello <@" + message.author.id + ">, please describe the **issue** you encounter in details. A **helper** will assist you as soon as possible.")
        return
    }
    
    if (!message.content.startsWith(prefix)) {
        return;
    }
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commande = args.shift();
    const cmd = bot.commands.get(commande);
    // Fonction : qui permet d'afficher un embed quand une erreur de commande survient.
    if (!cmd) {
        message.channel.send("This command doesn't exist. See `" + prefix + "help` to see all commands.")
        return
    }

    try {
        return (cmd.run(bot, message, args, con));
    } catch (warning) {
        message.channel.send(`An error occurred on **${cmd.help.name}**.`);
    }
}

function antispam(message, bot) {
    if (message.content.length > 0) {
        if (users[message.author.id]) {
            const user = users[message.author.id]
            const lastMessage = user.messages.last()
            const diff = (message.createdTimestamp - lastMessage.createdTimestamp) / 1000
            if (diff <= settings.antispam.delay && lastMessage.content === message.content) {
                if (!user.messages.includes(lastMessage)) user.message.push(lastMessage)
                user.messages.push(message)
                const count = user.messages.length
                if (count === settings.antispam.maxDuplicate) {
                    for (const msg of user.messages) {
                        msg.delete()
                    }
                    message.member.kick('Kicked for spamming "' + message.content + '" across channels.')
                    const embed = new MessageEmbed()
                    .setAuthor(message.author.tag + " has been kicked.", message.author.displayAvatarURL())
                    .setColor("#ff0000")
                    .setDescription("Spamming the following text:```" + message.content + "```")
                    .setFooter("User ID: " + message.author.id)
                    .setTimestamp()
                    bot.channels.cache.get(settings.channel.serverlogs).send({embeds:[embed]})
                    delete users[message.author.id]

                }
            } else {
                user.messages = [message]
            }
        } else {
            users[message.author.id] = {
                messages: [message]
            }
        }        
    }
}