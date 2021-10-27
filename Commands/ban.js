const settings = require("../settings.js");
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const querystring = require('querystring')

module.exports.run = (bot, message, args, con) => {
    if (message.channel.id === settings.channel.command.admin || message.channel.id === settings.channel.command.moderator && (message.member && message.member.roles.cache.find(r => r.id === settings.role.moderator))) {
        con.query("SELECT USERID, ID, iconIndex, name FROM PERSONA WHERE name = ?", [args[0]], (err, result) => {
            if (err) {
                message.channel.send("Failed to execute command: " + err);
            } else {
                if (result.length > 0) {
                    var userid = result[0].USERID;
                    var icon = result[0].iconIndex + ".jpg"
                    var reason = message.content.replace("s!ban", '').replace(args[0], '').trim();

                    con.query("SELECT * FROM BAN WHERE user_id = " + userid + " AND active = 1", (err, result1) => {
                            if (result1.length == 0) {
                                con.query("INSERT INTO `BAN` (`id`, `ends_at`, `reason`, `started`, `banned_by_id`, `user_id`, `active`) VALUES (NULL, NULL, ?, NOW(), '273463', ?, 1)", [reason, userid], err => {
                                    con.query("UPDATE HARDWARE_INFO SET banned = 1 WHERE userId = " + userid)
                                    axios.post(settings.core.url + '/Engine.svc/ofcmdhook?webhook=false&pid=273463&cmd=kick%20' + result[0].name, null, { headers: { Authorization: settings.core.token } }).then(res => { }).catch(error => { })
                                    if (reason.length >= 1) {
                                        const post = querystring.stringify({
                                            message: `TXT_RED,[${result[0].name}] HAS BEEN PERMANENTLY BANNED.`,
                                            announcementAuth: settings.core.token.server
                                        })
                                        const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' } };
                                        axios.post(settings.core.url + '/Engine.svc/Send/Announcement', post, config)
                                        if (!err) {
                                            const embed = new MessageEmbed()
                                                .setAuthor(result[0].name + " has been permanently banned.", settings.url.avatarEndpoint + icon)
                                                .setColor("#ff0000")
                                                .addField("Reason", reason)
                                                .addField("Banned by", "<@" + message.author.id + ">")
                                                .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                                                .setTimestamp()
                                            bot.channels.cache.get(settings.channel.banlogs).send({ embeds: [embed] })
                                            message.channel.send({ embeds: [embed] })
                                        }
                                    }
                                    else {
                                        const post = querystring.stringify({
                                            message: `TXT_RED,${result[0].name} HAS BEEN PERMANENTLY BANNED.`,
                                            announcementAuth: settings.core.token.server
                                        })
                                        const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' } };
                                        axios.post(settings.core.url + '/Engine.svc/Send/Announcement', post, config).then(result2)
                                        if (!err) {
                                            const embed = new MessageEmbed()
                                                .setAuthor(result[0].name + " has been permanently banned.", settings.url.avatarEndpoint + icon)
                                                .setColor("#ff0000")
                                                .addField("Reason", "No reason specified.")
                                                .addField("Banned by", "<@" + message.author.id + ">")
                                                .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                                                .setTimestamp()
                                            bot.channels.cache.get(settings.channel.banlogs).send({ embeds: [embed] })
                                            message.channel.send({ embeds: [embed] })
                                        }
                                    }
                                })
                            }
                            else {
                                message.channel.send("**" + result[0].name + "** already have an active ban.")
                            }
                        })

                } else {
                    message.channel.send("Driver **+" + args[0].toUpperCase() + "** not found.");
                }
            }
        });
    }
}

module.exports.help = {
    name: "ban"
};