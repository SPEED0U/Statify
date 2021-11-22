const settings = require("../settings.js");
const { MessageEmbed } = require('discord.js');

module.exports.run = (bot, message, args, con) => {
    if (message.channel.id === settings.channel.command.admin || message.channel.id === settings.channel.command.moderator && (message.member && message.member.roles.cache.find(r => r.id === settings.role.moderator))) {
        con.query("SELECT USERID, name, iconIndex FROM PERSONA WHERE name = ?", [args[0]], (err, result) => {
            if (err) {
                message.channel.send("Failed to execute command: " + err);
            } else {
                if (result.length > 0) {
                    var userid = result[0].USERID;
                    var icon = result[0].iconIndex + settings.url.avatarFormat
                    var reason = message.content.replace("s!unban", '').replace(args[0], '').trim();
                    con.query("SELECT gameHardwareHash AS ghh FROM USER WHERE ID = ?", [userid], (err, userInfo) =>
                    con.query("SELECT * FROM BAN WHERE user_id = ? AND active = 1", [userid], (err, result1) =>
                    con.query("SELECT * FROM HARDWARE_INFO WHERE userId = ? AND hardwareHash = ? AND banned = 1", [userid,userInfo[0].ghh], (err, result2) => {
                            if (result1.length > 0 || result2.length > 0) {
                                con.query("UPDATE BAN SET active = 0 WHERE user_id = ?", [userid]); {
                                    con.query("UPDATE HARDWARE_INFO SET banned = 0 WHERE userId = ? AND hardwareHash = ?", [userid,userInfo[0].ghh])
                                    if (reason.length > 0) {
                                        const embed = new MessageEmbed()
                                        .setAuthor(result[0].name + " has been unbanned.", settings.url.avatarEndpoint + icon)
                                        .setColor("#11ff00")
                                        .addField("Reason", reason)
                                        .addField("Unbanned by", "<@" + message.author.id + ">")
                                        .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                                        .setTimestamp()
                                    bot.channels.cache.get(settings.channel.banlogs).send({embeds:[embed]})
                                    message.channel.send({embeds:[embed]})
                                    } else {
                                        const embed = new MessageEmbed()
                                        .setAuthor(result[0].name + " has been unbanned.", settings.url.avatarEndpoint + icon)
                                        .setColor("#11ff00")
                                        .addField("Reason", "No reason provided.")
                                        .addField("Unbanned by", "<@" + message.author.id + ">")
                                        .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                                        .setTimestamp()
                                        bot.channels.cache.get(settings.channel.banlogs).send({embeds:[embed]})
                                        message.channel.send({embeds:[embed]})
                                    }
                                }
                            }
                            else {
                                message.channel.send("The driver **" + args[0] + "** doesn't have any active ban.")
                            }
                        })))

                } else {
                    message.channel.send("Driver **+" + args[0] + "** not found.");
                }
            }
        });
    }
}

module.exports.help = {
    name: "unban",
    description: ["Unban a player from the game."],
    category: "Moderator",
    args: "[player] [reason]",
    roles: [settings.role.admin,settings.role.moderator] 
};