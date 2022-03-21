const { MessageEmbed } = require('discord.js');
const settings = require("../settings.js");
module.exports.run = (bot, message, args, con) => {
    if (message.channel.id === settings.channel.command.moderator || settings.channel.command.admin && (message.member && message.member.roles.cache.find(r => r.id === settings.role.moderator))) {
        if (args[0] == "sha") {
            if (message.member && message.member.roles.cache.find(r => r.id === settings.role.launcher || settings.role.admin)) {
                con.query("SELECT value FROM PARAMETER WHERE name = 'SIGNED_LAUNCHER_HASH'", [], (err, result) => {
                    con.query("UPDATE PARAMETER SET value = ? WHERE name = 'SIGNED_LAUNCHER_HASH'", [result[0]['value'].replace(';' + args[1], '')], err => {
                        if (!err) message.channel.send("Removed ``" + args[1] + "`` from the certified launcher hash list.")
                    })
                })
            } else {
                message.channel.send("You do not have enough permissions to run this command.")
            }
        } else if (args[0] == "hwid") {
            if (message.member && message.member.roles.cache.find(r => r.id === settings.role.launcher || settings.role.admin)) {
                con.query("SELECT value FROM PARAMETER WHERE name = 'SIGNED_LAUNCHER_HWID_WL'", [], (err, result) => {
                    con.query("UPDATE PARAMETER SET value = ? WHERE name = 'SIGNED_LAUNCHER_HWID_WL'", [result[0]['value'].replace(';' + args[1], '')], err => {
                        if (!err) message.channel.send("Removed ``" + args[1] + "`` from the user whitelist.")
                    })
                })
            } else {
                message.channel.send("You do not have enough permissions to run this command.")
            }
        } else {
            con.query("SELECT ID, cash, boost, iconIndex, name FROM PERSONA WHERE name = ?", [args[2]], (err, result) => {
                if (result.length > 0) {
                    var icon = result[0].iconIndex + settings.url.avatarFormat;
                    if (args[1] === "$")
                        con.query("UPDATE PERSONA SET cash = cash - ? WHERE name = ?", [args[0], args[2]], err => {
                            const embed = new MessageEmbed()
                            .setAuthor({
                                name: result[0].name + " lost some cash.",
                                iconURL: settings.url.avatarEndpoint + icon
                            })
                            .setColor("#0398fc")
                            .addField("Old cash amount", "`" + Intl.NumberFormat('en-US').format(result[0].cash) + " $`")
                            .addField("New cash amount", "`" + Intl.NumberFormat('en-US').format(Number(result[0].cash) - Number(args[0])) + " $`")
                            .addField("Cash removed by", "<@" + message.author.id + ">")
                            .setFooter({
                                text: bot.user.tag,
                                iconURL: bot.user.displayAvatarURL()
                            })
                            .setTimestamp()
                        message.channel.send({ embeds: [embed] })
                        })
                    else if (args[1] == "SB")
                        con.query("UPDATE PERSONA SET boost = boost - ? WHERE name = ?", [args[0], args[2]], err => {
                            const embed = new MessageEmbed()
                                .setAuthor({
                                    name: result[0].name + " lost some speedboost.",
                                    iconURL: settings.url.avatarEndpoint + icon
                                })
                                .setColor("#fcba03")
                                .addField("Old speedboost amount", "`" + Intl.NumberFormat('en-US').format(result[0].boost) + " SB`")
                                .addField("New speedboost amount", "`" + Intl.NumberFormat('en-US').format(Number(result[0].boost) - Number(args[0])) + " SB`")
                                .addField("Speedboost removed by", "<@" + message.author.id + ">")
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
    name: "del",
    description: ["Remove a choosen quantity of currency to a player."],
    category: "[⚔️] Moderator",
    args: "[amount] [currency] [persona]",
    roles: [settings.role.admin, settings.role.moderator]
};