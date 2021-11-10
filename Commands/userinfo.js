const settings = require("../settings.js");
const { MessageEmbed } = require('discord.js');
module.exports.run = (bot, message, args, con) => {
    if ((message.channel.id === settings.channel.command.admin || message.channel.id === settings.channel.command.moderator) && (message.member && message.member.roles.cache.find(r => r.id === settings.role.moderator))) {
        con.query("SELECT USER.EMAIL, USER.gameHardwareHash, USER.IP_ADDRESS, USER.lastLogin, USER.isLocked, USER.created, USER.ID as UID, PERSONA.ID as PID, PERSONA.iconIndex USER INNER JOIN PERSONA ON PERSONA.USERID = PERSONA.ID WHERE PERSONA.NAME = ?", [args[0]], (err, userinfo) => {
            if (userinfo.length > 0) {
                con.query("SELECT name FROM PERSONA WHERE USERID = ?", [userinfo[0].UID], (err, drivers) => {
                    var attachedDrivers = []
                    for(driver of drivers) {
                        if(driver.toLowerCase() != args['0'].toLowerCase()) {
                            attachedDrivers.push(driver.name)
                        }
                    }

                    const embed = new MessageEmbed()
                        .setAuthor("Account information of " + args[0].toUpperCase(), settings.url.avatarEndpoint + icon)
                        .setThumbnail(settings.url.avatarEndpoint + userinfo[0].iconIndex + settings.url.avatarFormat, true)
                        .setColor("#ff0000")
                        .addField("Email", "`" + userinfo[0].EMAIL + "`")
                        .addField("Account ID", "`" + userinfo[0].UID + "`")
                        .addField("Account creation date", "`" + (userinfo[0].created).toLocaleString('en-GB', { timeZone: "Europe/Paris", hour12: false }) + "`")
                        .addField("Last connection", "`" + (userinfo[0].lastLogin).toLocaleString('en-GB', { timeZone: "Europe/Paris", hour12: false }) + "`")
                        .addField("Membership", userinfo[0].premium === 1 ? "`Premium`" : "`Freemium`")
                        .addField("Attached drivers", "`" + attachedDrivers.join(", ") + "`")
                        .addField("Hardware hash", "`" + (userinfo[0].gameHardwareHash).toUpperCase() + "`")
                        .addField("IP address", "`" + userinfo[0].IP_ADDRESS + "`")
                        .addField("Account state", userinfo[0].isLocked === 1 ? "`Locked`" : "`Unlocked`")
                        .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                        .setTimestamp()

                    message.channel.send({ embeds: [embed] })
                })
            } else {
                message.channel.send("Driver **" + args[0] + "** not found.")
            }
        })                 
    }
};

module.exports.help = {
    name: "userinfo"
};