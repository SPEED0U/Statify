const settings = require("../settings.json");
const axios = require('axios');
const { MessageEmbed } = require('discord.js');
const querystring = require('querystring')

module.exports.run = (bot, message, args, con) => {
    if (message.channel.id === settings.channel.command.admin || message.channel.id === settings.channel.command.moderator && (message.member && message.member.roles.cache.find(r => r.id === settings.role.moderator))) {
        con.query("SELECT USERID, ID, name iconIndex FROM PERSONA WHERE name = ?", [args[0].toUpperCase()], (err, result) => {
            if (result.length == 1) {
                const post = querystring.stringify({
                    message: `TXT_ORANGE,[${result[0].name}] HAS BEEN KICKED.`,
                    announcementAuth: settings.core.token.server
                })
                var reason = message.content.replace("s!kick", '').replace(args[0], '').trim();
                var icon = result[0].iconIndex + settings.url.avatarFormat
                const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' } };
                axios.post(settings.core.url + '/Engine.svc/Send/Announcement', post, config)
                axios.post(settings.core.url + '/Engine.svc/ofcmdhook?webhook=false&pid=273463&cmd=kick%20' + result[0].name, null, { headers: { Authorization: settings.core.token.openfire } }).then(res => { }).catch(error => { })
                if (reason.length > 0) {
                    const embed = new MessageEmbed()
                    .setAuthor(result[0].name + " has been kicked.", settings.url.avatarEndpoint + icon)
                    .setColor("#fff700")
                    .addField("Reason", reason)
                    .addField("Kicked by", message.author.tag)
                    .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                    .setTimestamp()
                bot.channels.cache.get(settings.channel.banlogs).send({ embeds: [embed] })
                message.channel.send({ embeds: [embed] })
                } else {
                    const embed = new MessageEmbed()
                    .setAuthor(result[0].name + " has been kicked.", settings.url.avatarEndpoint + icon)
                    .setColor("#fff700")
                    .addField("Reason", "No reason specified.")
                    .addField("Kicked by", message.author.tag)
                    .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                    .setTimestamp()
                bot.channels.cache.get(settings.channel.banlogs).send({ embeds: [embed] })
                message.channel.send({ embeds: [embed] })
                }
            }
            else message.channel.send("Cannot find the player **" + args[0] + "** in database.")
        })
    }
}

module.exports.help = {
    name: "kick"
};