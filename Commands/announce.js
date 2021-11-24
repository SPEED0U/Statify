const settings = require("../settings.js");
const axios = require('axios');
const { MessageEmbed } = require('discord.js');
module.exports.run = (bot, message, args, con) => {
    if (message.channel.id === settings.channel.command.admin && (message.member.roles.cache.find(r => r.id === settings.role.moderator))) {
        const color = args.shift();
        const prefix = args.shift();
        const announcement = args.join(" ");
        const post = new URLSearchParams();
        post.append('message', `TXT_${color.toUpperCase()},[${prefix}] ${announcement}`);
        post.append('announcementAuth', settings.core.token.server);
        const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' } };
        axios.post(settings.core.url + '/Engine.svc/Send/Announcement', post, config).then(res2 => {
            const embed = new MessageEmbed()
                .setAuthor("Chat announcement", bot.user.displayAvatarURL())
                .setColor(color.replace("TXT_", "").toUpperCase())
                .addField("Message", announcement)
                .addField("Context", capitalizeFirstLetter(prefix))
                .addField("Initiator", "<@" + message.author.id + ">")
                .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                .setTimestamp()
            bot.channels.cache.get(settings.channel.banlogs).send({ embeds: [embed] })
            message.channel.send({ embeds: [embed] })
        }).catch(error => {
            message.reply(error);
        })
    } else {
        const embed = new MessageEmbed()
        .setColor("#ff0000")
        .addField("Insufficient permissions", "You need `" + this.help.category.substring(4) + "` permissions to run this command.")
        .setFooter(bot.user.tag, bot.user.displayAvatarURL())
        .setTimestamp()
    message.channel.send({ embeds: [embed] })
    }
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
};

module.exports.help = {
    name: "announce",
    description: ["Sends a announcement thru the game chat."],
    category: "[⚔️] Moderator",
    args: "[color] [prefix] [announcement]",
    roles: [settings.role.admin, settings.role.moderator]
};