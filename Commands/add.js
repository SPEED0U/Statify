const { MessageEmbed } = require('discord.js');
const settings = require("../settings.js");
module.exports.run = (bot, message, args, con) => {
    if (message.channel.id === settings.channel.command.moderator || settings.channel.command.admin && (message.member && message.member.roles.cache.find(r => r.id === settings.role.moderator))) {
        if (args[0].toUpperCase() == "SHA") {
            if (message.member && message.member.roles.cache.find(r => r.id === settings.role.launcher || settings.role.admin)) {
                con.query("UPDATE PARAMETER SET value = CONCAT(value, ?) WHERE name = 'SIGNED_LAUNCHER_HASH'", [";" + args[1].toUpperCase()], err => {
                    if (!err) message.channel.send("Added `" + args[1].toUpperCase() + "` to the certified launcher hash list.")
                })
            } else {
                message.channel.send("You do not have enough permissions to run this command.")
            }
        } else if (args[0].toUpperCase() == "HWID") {
            if (message.member && message.member.roles.cache.find(r => r.id === settings.role.launcher || settings.role.admin)) {
                con.query("UPDATE PARAMETER SET value = CONCAT(value, ?) WHERE name = 'SIGNED_LAUNCHER_HWID_WL'", [";" + args[1].toUpperCase()], err => {
                    if (!err) message.channel.send("Added `" + args[1].toUpperCase() + "` to the user whitelist.")
                })
            } else {
                message.channel.send("You do not have enough permissions to run this command.")
            }
        } else {
            con.query("SELECT ID, cash, boost, iconIndex, name FROM PERSONA WHERE name = ?", [args[2]], (err, result) => {
                if (result.length > 0) {
                    var icon = result[0].iconIndex + settings.url.avatarFormat;
                    if (args[1] === "$")
                        con.query("UPDATE PERSONA SET cash = cash + ? WHERE name = ?", [args[0], args[2]], err => {
                            const embed = new MessageEmbed()
                                .setAuthor({
                                    name: result[0].name + " received cash.",
                                    iconURL: settings.url.avatarEndpoint + icon
                                })
                                .setColor("#0398fc")
                                .addField("Old cash amount", "`" + Intl.NumberFormat('en-US').format(result[0].cash) + " $`")
                                .addField("New cash amount", "`" + Intl.NumberFormat('en-US').format(Number(result[0].cash) + Number(args[0])) + " $`")
                                .addField("Cash added by", "<@" + message.author.id + ">")
                                .setFooter({
                                    text: bot.user.tag,
                                    iconURL: bot.user.displayAvatarURL()
                                })
                                .setTimestamp()
                            message.channel.send({ embeds: [embed] })
                        })
                    else if (args[1] === "SB" || "sb")
                        con.query("UPDATE PERSONA SET boost = boost + ? WHERE name = ?", [args[0], args[2]], err => {
                            const embed = new MessageEmbed()
                                .setAuthor({
                                    name: result[0].name + " received speedboost.",
                                    iconURL: settings.url.avatarEndpoint + icon
                                })
                                .setColor("#fcba03")
                                .addField("Old speedboost amount", "`" + Intl.NumberFormat('en-US').format(result[0].boost) + " SB`")
                                .addField("New speedboost amount", "`" + Intl.NumberFormat('en-US').format(Number(result[0].boost) + Number(args[0])) + " SB`")
                                .addField("Speedboost added by", "<@" + message.author.id + ">")
                                .setFooter({
                                    text: bot.user.tag,
                                    iconURL: bot.user.displayAvatarURL()
                                })
                                .setTimestamp()
                            message.channel.send({ embeds: [embed] })
                        })
                } else message.channel.send("Persona **" + args[2] + "** not found.")
            })
        }
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
    name: "add",
    description: ["Add a choosen quantity of currency to a player."],
    category: "[⚔️] Moderator",
    args: "[amount] [currency] [persona]",
    roles: [settings.role.admin, settings.role.moderator]
};