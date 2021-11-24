const settings = require("../settings.js");
module.exports.run = (bot, message, args, con) => {
    if ((message.channel.id === settings.channel.command.admin || message.channel.id === settings.channel.command.moderator) && (message.member && message.member.roles.cache.find(r => r.id === settings.role.moderator))) {
        con.query("SELECT ID FROM USER WHERE email = ?", [args[0]], (err, result) => {
            if (result.length > 0) {
                con.query("UPDATE USER SET isLocked = 0 WHERE email = ?", [args[0]], err => {
                    if (!err) message.channel.send("Unlocked **" + args[0] + "**'s account.")
                })
            } else message.channel.send("Account **" + args[0] + "not found.")
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
    name: "unlock",
    description: ["Unlock the account of a player."],
    category: "[⚔️] Moderator",
    args: "[email]",
    roles: [settings.role.admin, settings.role.moderator]
};