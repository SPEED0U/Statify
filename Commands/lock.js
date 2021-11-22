const settings = require("../settings.js");
module.exports.run = (bot, message, args, con) => {
    if ((message.channel.id === settings.channel.command.admin || message.channel.id === settings.channel.command.moderator) && (message.member && message.member.roles.cache.find(r => r.id === settings.role.moderator))) {
        con.query("SELECT ID FROM USER WHERE email = ?", [args[0]], (err, result) => {
            if (result.length > 0) {
                con.query("UPDATE USER SET isLocked = 1 WHERE email = ?", [args[0]], err => {
                    if (!err) message.channel.send("Locked **" + args[0] + "**'s account.")
                })
            } else message.channel.send("Account **+" + args[0] + "**not found.")
        })
    }
};

module.exports.help = {
    name: "lock",
    description: ["Lock the account of a player."],
    category: "Moderator",
    args: "[email]",
    roles: [settings.role.admin,settings.role.moderator] 
};