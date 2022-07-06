const settings = require("../settings.js");
const { MessageEmbed } = require('discord.js');

module.exports.run = (bot, message, args, con) => {
    if (message.channel.id === settings.channel.command.admin || message.channel.id === settings.channel.command.moderator && (message.member && message.member.roles.cache.find(r => r.id === settings.role.moderator))) {
        con.query("SELECT USERID, iconIndex FROM PERSONA WHERE name = ?", [args[0]], (err, result) => {
            if (args[0] === undefined) {
                message.channel.send("Put the `driver` name after the command, <@" + message.author.id + "> you bozo.");
            } else {
            if (err) {
                message.channel.send("Failed to execute command: " + err);
            } else {
                if (result.length > 0) {
                    var userid = result[0].USERID;
                    var icon = result[0].iconIndex + settings.url.avatarFormat
                    con.query("SELECT started,ends_at,reason,active FROM BAN WHERE user_id = " + userid, (err, result1) => {
                        if (result1.length > 0) {
                            result1.forEach(ban => {
                                let reason = !!ban.reason ? ban.reason : "No reason specified"
                                let banEnd = !!ban.ends_at ? ban.ends_at : "Never"
                                if (banEnd != "Never") {
                                    const embed = new MessageEmbed()
                                        .setAuthor({
                                            name: "Ban records for " + args[0].toUpperCase(),
                                            iconURL: settings.url.avatarEndpoint + icon
                                        })
                                        .setColor("#ff0000")
                                        .addField("Started at", ban.started.toLocaleString('en-GB', { timeZone: 'Europe/Paris', hour12: false }))
                                        .addField("Ended at", banEnd.toLocaleString('en-GB', { timeZone: 'Europe/Paris', hour12: false }))
                                        .addField("Reason", reason)
                                        .addField("Ban state", ban.active === 1 ? "Active" : "Inactive")
                                        .setFooter({
                                            text: bot.user.tag,
                                            iconURL: bot.user.displayAvatarURL()
                                        })
                                        .setTimestamp()
                                    message.channel.send({ embeds: [embed] })
                                } else {
                                    const embed = new MessageEmbed()
                                        .setAuthor({
                                            name: "Ban records for " + args[0].toUpperCase(),
                                            iconURL: settings.url.avatarEndpoint + icon
                                        })
                                        .setColor("#ff0000")
                                        .addField("Started at", ban.started.toLocaleString('en-GB', { timeZone: 'Europe/Paris', hour12: false }))
                                        .addField("Ended at", "This ban has no end date.")
                                        .addField("Reason", reason)
                                        .addField("Ban state", ban.active === 1 ? "Active" : "Inactive")
                                        .setFooter({
                                            text: bot.user.tag,
                                            iconURL: bot.user.displayAvatarURL()
                                        })
                                        .setTimestamp()
                                    message.channel.send({ embeds: [embed] })
                                }
                            })
                        } else {
                            message.channel.send("There is no ban records for **" + args[0].toUpperCase() + "**.");
                        }
                    })

                } else {
                    message.channel.send("Driver **" + args[0].toUpperCase() + "** not found.");
                }
            }}
        });
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
    name: "banlist",
    description: ["List the ban records of a player."],
    category: "[⚔️] Moderator",
    args: "[player]",
    roles: [settings.role.admin, settings.role.moderator]
};