const settings = require("../settings.js");
const { MessageEmbed } = require('discord.js');
module.exports.run = (bot, message, args, con) => {
    if ((message.channel.id === settings.channel.command.admin || message.channel.id === settings.channel.command.moderator) && (message.member && message.member.roles.cache.find(r => r.id === settings.role.moderator))) {
        con.query("SELECT ID, USERID, iconIndex FROM PERSONA WHERE name = ?", [args[0]], (err, pid) => {
            if (pid.length > 0) {
                let personaid = pid[0].ID
                var icon = pid[0].iconIndex + settings.url.avatarFormat
                if (args[1] != undefined) {
                    con.query("SELECT ID FROM PERSONA WHERE name = ?", [args[1]], (err, result1) => {
                        if (result1.length === 0) {
                            con.query("UPDATE PERSONA SET name = ? WHERE ID = " + personaid, [args[1].toUpperCase()], err => {
                                if (!err) {
                                    const embed = new MessageEmbed()
                                        .setAuthor(args[0].toUpperCase() + " has been renamed.", settings.url.avatarEndpoint + icon)
                                        .setColor("#0080ff")
                                        .addField("Renamed to", args[1].toString().toUpperCase())
                                        .addField("Renamed by", "<@" + message.author.id + ">")
                                        .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                                        .setTimestamp()
                                bot.channels.cache.get(settings.channel.banlogs).send({ embeds: [embed] })
                                message.channel.send({ embeds: [embed] })}
                            })
                        } else {
                            message.channel.send("There is already a **driver** called **" + args[1].toUpperCase() + "**.")
                        }
                    })
                } else {
                    con.query("UPDATE PERSONA SET name = 'DRIVER" + personaid + "' WHERE ID = " + personaid, (err, result) => {
                        if (!err) {
                            const embed = new MessageEmbed()
                                .setAuthor(args[0].toUpperCase() + " has been renamed.", settings.url.avatarEndpoint + icon)
                                .setColor("#0080ff")
                                .addField("Renamed to", "DRIVER" + personaid)
                                .addField("Renamed by", "<@" + message.author.id + ">")
                                .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                                .setTimestamp()
                            bot.channels.cache.get(settings.channel.banlogs).send({ embeds: [embed] })
                            message.channel.send({ embeds: [embed] })
                        } else {
                            con.query("UPDATE PERSONA SET name = 'DRIVER" + (personaid + 1) + "' WHERE ID = " + personaid, (err, result) => {
                                if (!err) message.channel.send("Renamed **" + args[0] + "** driver name to **DRIVER" + (personaid + 1) + "**.")
                            })
                        }
                    })
                }
            } else message.channel.send("Driver **" + args[0] + "** not found.")
        })
    } else {
        const embed = new MessageEmbed()
        .setColor("#ff0000")
        .addField("Insufficient permissions", "You need `" + this.help.category.substring(4) + "` permissions to run this command.")
        .setFooter(bot.user.tag, bot.user.displayAvatarURL())
        .setTimestamp()
    message.channel.send({ embeds: [embed] })
    }
};

module.exports.help = {
    name: "rename",
    description: ["Rename a player in-game. (`new name` is optional)"],
    category: "[⚔️] Moderator",
    args: "[player] [new name]",
    roles: [settings.role.admin,settings.role.moderator] 
};