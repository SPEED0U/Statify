const settings = require("../settings.js");
module.exports.run = (bot, message, args, con) => {
    if (message.channel.id === settings.channel.command.moderator || settings.channel.command.admin && (message.member && message.member.roles.cache.find(r => r.id === settings.role.moderator))) {
        if (args[0].toUpperCase() == "SHA") {
            if (message.member && message.member.roles.cache.find(r => r.id === settings.role.launcher || settings.role.admin)) {
                con.query("UPDATE PARAMETER SET value = CONCAT(value, ?) WHERE name = 'SIGNED_LAUNCHER_HASH'", [";" + args[1].toUpperCase()], err => {
                    if (!err) message.channel.send("Added `" + args[1].toUpperCase() + "` to the certified launcher hash list.")
                })
            } else {
                message.channel.send("You do not have enough permissions to run this command.")
            }
        } else if (args[0].toUpperCase() == "HWID") {
            if (message.member && message.member.roles.cache.find(r => r.id === settings.role.launcher || settings.role.admin)) {
                con.query("UPDATE PARAMETER SET value = CONCAT(value, ?) WHERE name = 'SIGNED_LAUNCHER_HWID_WL'", [";" + args[1].toUpperCase()], err => {
                    if (!err) message.channel.send("Added `" + args[1].toUpperCase() + "` to the user whitelist.")
                })
            } else {
                message.channel.send("You do not have enough permissions to run this command.")
            }
        } else {
            con.query("SELECT ID FROM PERSONA WHERE name = ?", [args[2]], (err, result) => {
                if (result.length > 0) {
                    if (args[1] === "$")
                        con.query("UPDATE PERSONA SET cash = cash + ? WHERE name = ?", [args[0], args[2]], err => {
                            if (!err) message.channel.send("Added **" + args[0] + " $**" + " to **" + args[2] + "**.")
                        })
                    else if (args[1] === "SB" || "sb")
                        con.query("UPDATE PERSONA SET boost = boost + ? WHERE name = ?", [args[0], args[2]], err => {
                            if (!err) message.channel.send("Added **" + args[0] + " SB**" + " to **" + args[2] + "**.")
                        })
                } else message.channel.send("Persona **" + args[2] + "** not found.")
            })
        }
    }
};

module.exports.help = {
    name: "add"
};