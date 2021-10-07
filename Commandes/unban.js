const settings = require("../settings.json");
const { MessageEmbed } = require('discord.js');

module.exports.run = (bot, message, args, con) => {
    if (message.channel.id === settings.channel.command.admin || message.channel.id === settings.channel.command.moderator && (message.member && message.member.roles.cache.find(r => r.id === settings.role.moderator))) {
        con.query("SELECT USERID FROM PERSONA WHERE name = ?", [args[0]], (err, result) => {
            if (err) {
                message.channel.send("Failed to execute command: " + err);
            } else {
                if (result.length > 0) {
                    var userid = result[0].USERID;
                    var reason = message.content.replace("s!unban", '').replace(args[0], '').trim();
                    con.query("SELECT * FROM BAN WHERE user_id = " + userid + " AND active = 1", (err, result1) =>
                        con.query("SELECT * FROM HARDWARE_INFO WHERE userId = " + userid + " AND banned = 1", (err, result2) => {
                            if (result1.length > 0 || result2.length > 0) {
                                con.query("UPDATE BAN SET active = 0 WHERE user_id = " + userid); {
                                    con.query("UPDATE HARDWARE_INFO SET banned = 0 WHERE userId = " + userid)
                                    if (reason.length > 0) {
                                        if (!err) message.channel.send("Unbanned **" + args[0] + "** with reason: `" + reason + "`."); {
                                            const embed = new MessageEmbed()
                                                .setColor("#2fff00")
                                                .setDescription("**" + args[0] + "** has been unbanned.\nReason: `" + reason + "`")
                                            bot.channels.cache.get(settings.channel.banlogs).send({embeds:[embed]})
                                        }
                                    } else {
                                        if (!err) message.channel.send("Unbanned **" + args[0] + "**."); {
                                            const embed = new MessageEmbed()
                                                .setColor("#2fff00")
                                                .setDescription("**" + args[0] + "** has been unbanned.")
                                            bot.channels.cache.get(settings.channel.banlogs).send({embeds:[embed]})
                                        }
                                    }
                                }
                            }
                            else {
                                message.channel.send("**" + args[0] + "** doesn't have any active ban.")
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