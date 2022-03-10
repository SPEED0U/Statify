const settings = require("../settings.js");
const prefix = settings.bot.prefix;
const { MessageEmbed } = require('discord.js');
let users = {}
// Modules.
module.exports = (bot, con, message) => {
    if (message.author.bot || message.channel.type === 'dm') {
        return;
    }

    antispamscam(message, bot)

    if (!message.channel.permissionsFor(bot.user).has('SEND_MESSAGES')) {
        return;
    }

    if (!message.content.startsWith(prefix)) {
        return;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commande = args.shift();
    const cmd = bot.commands.get(commande);
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

function antispamscam(message, bot) {
    try {
        if (message.content.length > 0 && message.content.includes('http' || '/' || '.' || ':')) {
            if (users[message.author.id]) {
                const user = users[message.author.id]
                const lastMessage = user.messages.last()
                const diff = (message.createdTimestamp - lastMessage.createdTimestamp) / 1000
                if (diff <= settings.antiscam.delay && lastMessage.content === message.content) {
                    if (!user.messages.includes(lastMessage)) user.message.push(lastMessage)
                    user.messages.push(message)
                    const count = user.messages.length
                    if (count === settings.antiscam.maxDuplicate) {
                        for (const msg of user.messages) {
                            msg.delete()
                        }
                        message.member.kick('Kicked for spamming "' + message.content + '"')
                        const embed = new MessageEmbed()
                            .setAuthor({
                                name: message.author.tag + " has been kicked.",
                                iconURL: message.author.displayAvatarURL()
                            })
                            .setColor("#ff0000")
                            .addField("Spamming the following text", "```" + message.content + "```")
                            .addField("Discord user id", "`" + message.author.id + "`")
                            .setFooter({
                                text: bot.user.tag,
                                iconURL: bot.user.displayAvatarURL()
                            })
                            .setTimestamp()
                        bot.channels.cache.get(settings.channel.serverlogs).send({ embeds: [embed] })
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
        } else if (message.content.length > 0) {
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
                        message.member.kick('Kicked for spamming "' + message.content + '"')
                        const embed = new MessageEmbed()
                            .setAuthor({
                                name: message.author.tag + " has been kicked.",
                                iconURL: message.author.displayAvatarURL()
                            })
                            .setColor("#ff0000")
                            .addField("Spamming the following text", "```" + message.content + "```")
                            .addField("Discord user id", "`" + message.author.id + "`")
                            .setFooter({
                                text: bot.user.tag,
                                iconURL: bot.user.displayAvatarURL()
                            })
                            .setTimestamp()
                        bot.channels.cache.get(settings.channel.serverlogs).send({ embeds: [embed] })
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
    } catch {
    }
}