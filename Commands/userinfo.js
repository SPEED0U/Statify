const settings = require("../settings.js");
const { MessageEmbed } = require('discord.js');
module.exports.run = (bot, message, args, con) => {
    if ((message.channel.id === settings.channel.command.admin || message.channel.id === settings.channel.command.moderator) && (message.member && message.member.roles.cache.find(r => r.id === settings.role.moderator))) {
        con.query("SELECT ID, USERID, iconIndex FROM PERSONA WHERE name = ?", [args[0]], (err, pid) => {
            con.query("SELECT EMAIL, gameHardwareHash, IP_ADDRESS, lastLogin, isLocked, created FROM USER WHERE id = ?", pid[0].USERID, (err, uid))
            var email = uid[0].EMAIL
            var ghh = uid[0].gameHardwareHash
            var ip = uid[0].IP_ADDRESS
            var lastlog = uid[0].lastLogin
            var locked = uid[0].isLocked
            var accCreation = uid[0].created
            var icon = pid[0].iconIndex + settings.url.avatarFormat
            var uid = uid[0].id
            if (pid.length > 0) {
                const embed = new MessageEmbed()
                    .setAuthor("Account information of " + args[0].toUpperCase(), settings.url.avatarEndpoint + icon)
                    .setColor("#ff0000")
                    .addField("Email", email)
                    .addField("Account ID", uid)
                    .addField("Account creation date", accCreation.toLocaleString('en-GB', { timeZone: 'Europe/Paris', hour12: false }))
                    .addField("Last connection", lastlog.toLocaleString('en-GB', { timeZone: 'Europe/Paris', hour12: false }))
                    .addField("Hardware hash", ghh.toUpperCase())
                    .addField("IP address", ip)
                    .addField("Acount state", locked === 1 ? "Locked" : "Unlocked")
                    .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                    .setTimestamp()
                message.channel.send({ embeds: [embed] })
            } else message.channel.send("Driver **" + args[0] + "** not found.")
        })
    }
};

module.exports.help = {
    name: "userinfo"
};