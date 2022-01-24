const axios = require('axios');
const settings = require("../settings.js");
const { MessageEmbed } = require('discord.js');

module.exports.run = (bot, message, args, con) => {
    if (message.channel.id === settings.channel.command.admin && (message.member && message.member.roles.cache.find(r => r.id === settings.role.admin || settings.role.launcher))) {
        axios.post(settings.core.url + '/Engine.svc/ReloadParameters', "adminAuth=" + settings.core.token.server, null).then(() => {
            const embed = new MessageEmbed()
                .setColor("#00ff33")
                .addField("Server parameter cache has been reloaded", "The new settings are now active.")
                .setFooter({
                    text: bot.user.tag,
                    iconURL: bot.user.displayAvatarURL()
                })
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
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
    name: "reload",
    description: ["Reload the server parameter cache to apply new settings."],
    category: "[👑] Administrator ",
    args: "",
    roles: [settings.role.admin]
};