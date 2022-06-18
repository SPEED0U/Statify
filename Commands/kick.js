const settings = require("../settings.js");
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports.run = (bot, message, args, con) => {
    if (message.channel.id === settings.channel.command.admin || message.channel.id === settings.channel.command.moderator && (message.member && message.member.roles.cache.find(r => r.id === settings.role.moderator))) {
        con.query("SELECT USERID, ID, name, iconIndex FROM PERSONA WHERE name = ?", [args[0].toUpperCase()], (err, result) => {
            if (result.length == 1) {
                const post = new URLSearchParams();
                post.append('message', `TXT_ORANGE,[${result[0].name}] HAS BEEN KICKED.`);
                post.append('announcementAuth', settings.core.token.server);
                var reason = message.content.replace("s!kick", '').replace(args[0], '').trim();
                var icon = result[0].iconIndex + settings.url.avatarFormat
                const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' } };
                axios.post(settings.core.url + '/Engine.svc/Send/Announcement', post, config)
                axios.post(settings.core.url + '/Engine.svc/ofcmdhook?cmd=/kick%20' + result[0].name + '&pid=' + settings.core.botPersonaId + '&webhook=0', null, { headers: { Authorization: settings.core.token.openfire } }).then(res => {console.log(res)}).catch(error => {console.log(error)})
                if (reason.length > 0) {
                    const embed = new MessageEmbed()
                        .setAuthor({
                            name: result[0].name + " has been kicked.",
                            iconURL: settings.url.avatarEndpoint + icon
                        })
                        .setColor("#fff700")
                        .addField("Reason", reason)
                        .addField("Kicked by", "<@" + message.author.id + ">")
                        .setFooter({
                            text: bot.user.tag,
                            iconURL: bot.user.displayAvatarURL()
                        })
                        .setTimestamp()
                    bot.channels.cache.get(settings.channel.banlogs).send({ embeds: [embed] })
                    message.channel.send({ embeds: [embed] })
                } else {
                    const embed = new MessageEmbed()
                        .setAuthor({
                            name: result[0].name + " has been kicked.",
                            iconURL: settings.url.avatarEndpoint + icon
                        })
                        .setColor("#fff700")
                        .addField("Reason", "No reason specified.")
                        .addField("Kicked by", "<@" + message.author.id + ">")
                        .setFooter({
                            text: bot.user.tag,
                            iconURL: bot.user.displayAvatarURL()
                        })
                        .setTimestamp()
                    bot.channels.cache.get(settings.channel.banlogs).send({ embeds: [embed] })
                    message.channel.send({ embeds: [embed] })
                }
            }
            else message.channel.send("Cannot find the player **" + args[0] + "** in database.")
        })
    } else {
        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .addField("Insufficient permissions", "You need `" + this.help.category.substring(4) + "` permissions to run this command.")
            .setFooter({
                text: bot.user.tag,
                iconURL: bot.user.displayAvatarURL()
            })
            .setTimestamp()
        message.channel.send({ embeds: [embed] })
    }
}

module.exports.help = {
    name: "kick",
    description: ["Kick a player from the game."],
    category: "[⚔️] Moderator",
    args: "[player] [reason]",
    roles: [settings.role.admin, settings.role.moderator]
};