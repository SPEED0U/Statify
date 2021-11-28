const settings = require("../settings.js");
const { MessageEmbed } = require('discord.js');

module.exports.run = (bot, message, args, con) => {
    if ((message.channel.id === settings.channel.command.admin || message.channel.id === settings.channel.command.moderator) && (message.member && message.member.roles.cache.find(r => r.id === settings.role.moderator))) {
        if (args[0].includes('@')) {
            con.query("SELECT ID FROM USER WHERE email = ?", [args[0]], (err, result) => {
                if (result.length > 0) {
                    con.query("UPDATE USER SET isLocked = 1 WHERE email = ?", [args[0]], err => {
                        const embed = new MessageEmbed()
                            .setAuthor("Player account locked")
                            .setColor("#fff700")
                            .setDescription("The account attached to the email `" + args[0] + "` has been locked.")
                            .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                            .setTimestamp()
                        message.channel.send({ embeds: [embed] })
                    })
                } else {
                    const embed = new MessageEmbed()
                        .setColor("#fff700")
                        .setDescription("There is no account attached to the email `" + args[0] + "`")
                        .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                        .setTimestamp()
                    message.channel.send({ embeds: [embed] })
                }
            })
        } else {
            con.query("SELECT USERID FROM PERSONA WHERE name = ?", [args[0]], (err, result) => {
                if (result.length > 0) {
                    con.query("UPDATE USER SET isLocked = 1 WHERE ID = ?", result[0].USERID, err => {
                        const embed = new MessageEmbed()
                            .setAuthor("Player account locked")
                            .setColor("#fff700")
                            .setDescription("The account attached to the driver `" + args[0] + "` has been locked.")
                            .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                            .setTimestamp()
                        message.channel.send({ embeds: [embed] })
                    })
                } else {
                    const embed = new MessageEmbed()
                        .setColor("#fff700")
                        .setDescription("There is no account attached to the driver `" + args[0] + "`")
                        .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                        .setTimestamp()
                    message.channel.send({ embeds: [embed] })
                }
            })
        }
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
    name: "lock",
    description: ["Lock the account of a player."],
    category: "[⚔️] Moderator",
    args: "[email or driver]",
    roles: [settings.role.admin, settings.role.moderator]
};