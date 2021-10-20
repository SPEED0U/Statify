const settings = require("../settings.json");
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
                    con.query("SELECT * FROM BAN WHERE user_id = " + userid + " AND active = 1", (err, result1) =>
                        con.query("SELECT * FROM HARDWARE_INFO WHERE userId = " + userid + " AND banned = 1", (err, result2) => {
                            if (result1.length > 0 || result2.length > 0) {
                                con.query("UPDATE BAN SET active = 0 WHERE user_id = " + userid); {
                                    con.query("UPDATE HARDWARE_INFO SET banned = 0 WHERE userId = " + userid)
                                    if (reason.length > 0) {
                                        const embed = new MessageEmbed()
                                        .setAuthor(result[0].name + " has been unbanned.", settings.url.avatarEndpoint + icon)
                                        .setColor("#11ff00")
                                        .addField("Reason", reason)
                                        .addField("Unbanned by", message.author.tag)
                                        .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                                        .setTimestamp()
                                    bot.channels.cache.get(settings.channel.banlogs).send({embeds:[embed]})
                                    message.channel.send({embeds:[embed]})
                                    } else {
                                        const embed = new MessageEmbed()
                                        .setAuthor(result[0].name + " has been unbanned.", settings.url.avatarEndpoint + icon)
                                        .setColor("#11ff00")
                                        .addField("Reason", "No reason specified.")
                                        .addField("Unbanned by", message.author.tag)
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
                        }))

                } else {
                    message.channel.send("Driver **+" + args[0] + "** not found.");
                }
            }
        });
    }
}

module.exports.help = {
    name: "unban"
};