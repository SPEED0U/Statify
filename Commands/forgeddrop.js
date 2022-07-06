const settings = require("../settings.js");
const { MessageEmbed } = require('discord.js');
module.exports.run = (bot, message, args, con) => {
    if (message.channel.id === settings.channel.command.admin && (message.member && message.member.roles.cache.find(r => r.id === settings.role.admin || settings.role.moderator))) {
        if (args[0] == "enable") {
            con.query("UPDATE REWARD_TABLE_ITEM SET dropWeight = 0.025 WHERE ID IN(22091,22092,22093,22094,22099,22100,22101)")
            const embed = new MessageEmbed()
                .setColor("#00ff33")
                .addField("The state of forged parts drop has changed", "Forged parts are now `droppable`")
                .setFooter({
                    text: bot.user.tag,
                    iconURL: bot.user.displayAvatarURL()
                })
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
        } else if (args[0] == "disable") {
            con.query("UPDATE REWARD_TABLE_ITEM SET dropWeight = 0 WHERE ID IN(22091,22092,22093,22094,22099,22100,22101)")
            const embed = new MessageEmbed()
                .setColor("#00ff33")
                .addField("The state of forged parts drop has changed", "Forged parts are now not `droppable`")
                .setFooter({
                    text: bot.user.tag,
                    iconURL: bot.user.displayAvatarURL()
                })
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
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
    name: "forgeddrop",
    description: ["Manage the drop of forged parts."],
    category: "[⚔️] Moderator",
    args: "[enable or disable]",
    roles: [settings.role.admin, settings.role.moderator]
};