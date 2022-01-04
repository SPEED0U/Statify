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
                            con.query("SELECT * FROM HARDWARE_INFO WHERE userId = ? AND hardwareHash = ? AND banned = 1", [userid, userInfo[0].ghh], (err, result2) => {
                                if (result1.length > 0 || result2.length > 0) {
                                    con.query("UPDATE BAN SET active = 0 WHERE user_id = ?", [userid]); {
                                        con.query("UPDATE HARDWARE_INFO SET banned = 0 WHERE userId = ? AND hardwareHash = ?", [userid, userInfo[0].ghh])
                                        con.query("UPDATE USER SET isLocked = 0 WHERE ID = ?", [userid])
                                        if (reason.length > 0) {
                                            const embed = new MessageEmbed()
                                                .setAuthor(result[0].name + " has been unbanned.", settings.url.avatarEndpoint + icon)
                                                .setColor("#11ff00")
                                                .addField("Reason", reason)
                                                .addField("Unbanned by", "<@" + message.author.id + ">")
                                                .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                                                .setTimestamp()
                                            bot.channels.cache.get(settings.channel.banlogs).send({ embeds: [embed] })
                                            message.channel.send({ embeds: [embed] })
                                        } else {
                                            const embed = new MessageEmbed()
                                                .setAuthor(result[0].name + " has been unbanned.", settings.url.avatarEndpoint + icon)
                                                .setColor("#11ff00")
                                                .addField("Reason", "No reason provided.")
                                                .addField("Unbanned by", "<@" + message.author.id + ">")
                                                .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                                                .setTimestamp()
                                            bot.channels.cache.get(settings.channel.banlogs).send({ embeds: [embed] })
                                            message.channel.send({ embeds: [embed] })
                                        }
                                    }
                                    con.query("SELECT email, ID, isLocked FROM USER WHERE gameHardwareHash = ?", [userInfo[0].ghh], (err, otherAcc) => {
                                        if (otherAcc.length > 1) {
                                            const embed = new MessageEmbed()
                                                .setAuthor(result[0].name + " is also hardware banned on the following accounts", settings.url.avatarEndpoint + icon)
                                            message.channel.send({ embeds: [embed] })
                                            otherAcc.forEach(acc => {
                                                const embed = new MessageEmbed()
                                                    .setColor("#ff0000")
                                                    .addField("Email", "`" + acc.email + "`")
                                                    .addField("User ID", "`" + acc.ID + "`")
                                                    .addField("Account state", acc.isLocked == 1 ? "`Locked`" : "`Unlocked`")
                                                    .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                                                    .setTimestamp()
                                                message.channel.send({ embeds: [embed] })
                                            })
                                        }
                                    })
                                }
                                else {
                                    message.channel.send("The driver **" + args[0] + "** doesn't have any active ban.")
                                }
                            })))

                } else {
                    message.channel.send("Driver **" + args[0] + "** not found.");
                }
            }
        });
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
    name: "unban",
    description: ["Unban a player from the game."],
    category: "[⚔️] Moderator",
    args: "[player] [reason]",
    roles: [settings.role.admin, settings.role.moderator]
};