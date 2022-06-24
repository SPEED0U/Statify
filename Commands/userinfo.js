const settings = require("../settings.js");
const { MessageEmbed } = require('discord.js');
module.exports.run = (bot, message, args, con) => {
    if ((message.channel.id === settings.channel.command.admin || message.channel.id === settings.channel.command.moderator) && (message.member && message.member.roles.cache.find(r => r.id === settings.role.moderator))) {
        con.query("SELECT ID FROM USER WHERE email = ?", [args[0]], (err, userid) => {
            con.query("SELECT ID, USERID, iconIndex FROM PERSONA WHERE name = ?", [args[0]], (err, pid) => {
                if (pid.length > 0 || userid.length > 0) {
                    con.query("SELECT EMAIL, gameHardwareHash, IP_ADDRESS, lastLogin, isLocked, created, ID, premium, discord FROM USER WHERE id = ?", [pid.length > 0 ? pid[0].USERID : userid[0].ID], (err, uid) => {
                        var email = uid[0].EMAIL
                        var ghh = uid[0].gameHardwareHash
                        var ip = uid[0].IP_ADDRESS
                        var lastlog = uid[0].lastLogin
                        var locked = uid[0].isLocked.readInt8()
                        var accCreation = uid[0].created
                        var userId = uid[0].ID
                        var premium = uid[0].premium.readInt8()
                        var discordid = uid[0].discord
                        con.query("SELECT name FROM PERSONA WHERE USERID = ?", [userId], (err, drivers) => {
                            var attachedDrivers = []
                            for (driver of drivers) {
                                attachedDrivers.push("`" + driver.name + "`")
                            }
                            console.log(attachedDrivers.length)
                            const embed = new MessageEmbed()
                                .setAuthor({
                                    name: "Account information of " + args[0].toUpperCase()
                                })
                                .setColor("#ff0000")
                                .addField("Account ID", "`" + userId + "`")
                                .addField("Hardware hash", "`" + ghh.toUpperCase() + "`")
                                .addField("Email", "`" + email + "`")
                                .addField("Discord ID", discordid != null ? "`" + discordid + "` alias <@" + discordid + ">" : "`No account linked`")
                                .addField("IP address", "`" + ip + "`")
                                .addField("Membership", premium == 1 ? "`Premium`" : "`Freemium`")
                                .addField("Account state", locked == 1 ? "`Locked`" : "`Unlocked`")                                
                                .addField("Account creation date", "`" + accCreation.toLocaleString('en-GB', { timeZone: "Europe/Paris", hour12: false }) + "`")
                                .addField("Last connection", "`" + lastlog.toLocaleString('en-GB', { timeZone: "Europe/Paris", hour12: false }) + "`")
                                if (attachedDrivers.length < 1) {
                                    embed.addField("Attached drivers", "`This account doesn't have any drivers.`")
                                } else {
                                    embed.addField("Attached drivers", attachedDrivers.join(", "))
                                }
                                embed.setFooter({
                                    text: bot.user.tag,
                                    iconURL: bot.user.displayAvatarURL()
                                })
                                .setTimestamp()
                            message.channel.send({ embeds: [embed] })
                        })
                    })
                } else if (args[0].includes('@')) {
                    message.channel.send("Email **" + args[0] + "** not found.")
                } else {
                    message.channel.send("Driver **" + args[0] + "** not found.")
                }
            })
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
};

module.exports.help = {
    name: "userinfo",
    description: ["Show specific info about the account of a player."],
    category: "[⚔️] Moderator",
    args: "[player]",
    roles: [settings.role.admin, settings.role.moderator]
};