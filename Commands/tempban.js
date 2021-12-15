const settings = require("../settings.js");
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

function convertToIntervalTime(date) {
    var suffix = date.split('').pop();
    var nums = date.replace(suffix, '');

    var times = "";

    switch (suffix) {
        case 'd': times = "DAY"; break;
        case 'm': times = "MONTH"; break;
        case 'w': times = "WEEK"; break;
        case 'y': times = "YEAR"; break;
    }

    return "DATE_ADD(NOW(), INTERVAL " + nums + " " + times + ")";
}

module.exports.run = (bot, message, args, con) => {
    if (message.channel.id === settings.channel.command.admin || message.channel.id === settings.channel.command.moderator && (message.member && message.member.roles.cache.find(r => r.id === settings.role.moderator))) {
        if (args[1].match(/^([0-9]+)(d|m|y|w)$/)) {
            con.query("SELECT USERID, ID, iconIndex, name FROM PERSONA WHERE name = ?", [args[0]], (err, result) => {
                if (err) {
                    message.channel.send("Failed to execute command: " + err);
                } else {
                    if (result.length > 0) {
                        var userid = result[0].USERID;
                        var reason = message.content.replace("s!tempban", '').replace(args[0], '').replace(args[1], '').trim();
                        var nosuffix = args[1].substring(0, args[1].length - 1);
                        var durationsuffix = args[1].slice(-1)
                        var icon = result[0].iconIndex + settings.url.avatarFormat
                        const units = {
                            d: "day(s)",
                            w: "week(s)",
                            y: "year(s)",
                            m: "month(s)"
                        }
                        con.query("SELECT gameHardwareHash AS ghh FROM USER WHERE ID = ?", [userid], (err, userInfo) =>
                            con.query("SELECT * FROM BAN WHERE user_id = " + userid + " AND active = 1", (err, result1) => {
                                if (result1.length == 0) {
                                    con.query("INSERT INTO `BAN` (`id`, `ends_at`, `reason`, `started`, `banned_by_id`, `user_id`, `active`) VALUES (NULL, " + convertToIntervalTime(args[1]) + ", ?, NOW(), ?, ?, 1)", [reason, settings.core.botPersonaId, userid], err => {
                                        con.query("UPDATE HARDWARE_INFO SET banned = 1 WHERE userId = ? AND hardwareHash = ?", [userid, userInfo[0].ghh]), (err)
                                        axios.post(settings.core.url + '/Engine.svc/ofcmdhook?webhook=false&pid=' + settings.core.botPersonaId + '&cmd=kick%20' + result[0].name, null, { headers: { Authorization: settings.core.token.openfire } }).then(res => { }).catch(error => { })
                                        if (!err) {
                                            const post = new URLSearchParams();
                                            post.append('message', `TXT_RED,[${result[0].name}] HAS BEEN TEMPORARILY BANNED FOR ` + nosuffix.toUpperCase() + " " + units[durationsuffix].toUpperCase() + ".");
                                            post.append('announcementAuth', settings.core.token.server);
                                            const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' } };
                                            axios.post(settings.core.url + '/Engine.svc/Send/Announcement', post, config)
                                            if (reason.length > 0) {
                                                const embed = new MessageEmbed()
                                                    .setAuthor(result[0].name + " has been temporarily banned.", settings.url.avatarEndpoint + icon)
                                                    .setColor("#ff6600")
                                                    .addField("Reason", reason)
                                                    .addField("Ban duration", nosuffix + " " + units[durationsuffix])
                                                    .addField("Banned by", "<@" + message.author.id + ">")
                                                    .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                                                    .setTimestamp()
                                                bot.channels.cache.get(settings.channel.banlogs).send({ embeds: [embed] })
                                                message.channel.send({ embeds: [embed] })
                                            } else {
                                                const embed = new MessageEmbed()
                                                    .setAuthor(result[0].name + " has been temporarily banned.", settings.url.avatarEndpoint + icon)
                                                    .setColor("#ff6600")
                                                    .addField("Reason", "No reason specified.")
                                                    .addField("Ban duration", nosuffix + " " + units[durationsuffix])
                                                    .addField("Banned by", "<@" + message.author.id + ">")
                                                    .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                                                    .setTimestamp()
                                                bot.channels.cache.get(settings.channel.banlogs).send({ embeds: [embed] })
                                                message.channel.send({ embeds: [embed] })
                                            }
                                        } else {
                                            console.log(err)
                                        }
                                    })
                                }
                                else {
                                    message.channel.send("**" + result[0].name + "** already have an active ban.")
                                }
                            }))
                    } else {
                        message.channel.send("Driver **" + args[0] + "** not found.");
                    }
                }
            });
        } else {
            message.channel.send("Unknown unit or format, the available units are `d`, `w`, `m` and `y`.\nExample of usage for a **5 day** ban: `" + settings.bot.prefix + "tempban [DRIVER] 5d [REASON]`")
        }
    } else {
        const embed = new MessageEmbed()
        .setColor("#ff0000")
        .addField("Insufficient permissions", "You need `" + this.help.category.substring(4) + "` permissions to run this command.")
        .setFooter(bot.user.tag, bot.user.displayAvatarURL())
        .setTimestamp()
    message.channel.send({ embeds: [embed] })
    }
}

module.exports.help = {
    name: "tempban",
    description: ["Temporarily ban a player from the game."],
    category: "[⚔️] Moderator",
    args: "[player] [duration] [reason]",
    roles: [settings.role.admin, settings.role.moderator]
};