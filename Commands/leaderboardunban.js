const settings = require("../settings.js");
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports.run = (bot, message, args, con) => {
    if (message.channel.id === settings.channel.command.admin || message.channel.id === settings.channel.command.moderator && (message.member && message.member.roles.cache.find(r => r.id === settings.role.moderator))) {
        con.query("SELECT BAN.id FROM BAN INNER JOIN PERSONA ON PERSONA.USERID = BAN.user_id WHERE PERSONA.NAME = ?", [args[0].toUpperCase()], (err, result) => {
            if (result.length == 1) {
                con.query("DELETE FROM BAN WHERE ID = ?", [result[0].id], (err2, result2) => {
                    if(err2) { 
                        message.channel.send("Cannot remove leaderoard ban from user **" + args[0] + "**.")
                    } else {
                        const embed = new MessageEmbed()
                        .setAuthor({
                            name: result[0].name + " has been unbanned from leaderboard.",
                            iconURL: settings.url.avatarEndpoint + icon
                        })
                        .setColor("#11ff00")
                        .addField("Unbanned by", "<@" + message.author.id + ">")
                        .setFooter({
                            text: bot.user.tag,
                            iconURL: bot.user.displayAvatarURL()
                        })
                        .setTimestamp()
                    bot.channels.cache.get(settings.channel.banlogs).send({ embeds: [embed] })
                    message.channel.send({ embeds: [embed] })
                    }
                })
            } else message.channel.send("Cannot find the player **" + args[0] + "** in database.")
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
}

module.exports.help = {
    name: "leaderboardunban",
    description: ["Removes ban from the leaderboard."],
    category: "[⚔️] Moderator",
    args: "[player]",
    roles: [settings.role.admin, settings.role.moderator]
};