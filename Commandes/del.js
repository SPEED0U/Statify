const settings = require("../settings.json");
module.exports.run = (bot, message, args, con) => {
    if (message.channel.id === settings.channel.command.moderator || settings.channel.command.admin && (message.member && message.member.roles.cache.find(r => r.id === settings.role.moderator))) {
        if (args[0] == "sha") {
            if (message.member && message.member.roles.cache.find(r => r.id === settings.role.launcher || settings.role.admin)) {
                con.query("SELECT value FROM PARAMETER WHERE name = 'SIGNED_LAUNCHER_HASH'", [], (err, result) => {
                    con.query("UPDATE PARAMETER SET value = ? WHERE name = 'SIGNED_LAUNCHER_HASH'", [result[0]['value'].replace(';' + args[1], '')], err => {
                        if (!err) message.channel.send("Removed ``" + args[1] + "`` from the certified launcher hash list.")
                    })
                })
            } else {
                message.channel.send("You do not have enough permissions to run this command.")
            }
        } else if (args[0] == "hwid") {
            if (message.member && message.member.roles.cache.find(r => r.id === settings.role.launcher || settings.role.admin)) {
                con.query("SELECT value FROM PARAMETER WHERE name = 'SIGNED_LAUNCHER_HWID_WL'", [], (err, result) => {
                    con.query("UPDATE PARAMETER SET value = ? WHERE name = 'SIGNED_LAUNCHER_HWID_WL'", [result[0]['value'].replace(';' + args[1], '')], err => {
                        if (!err) message.channel.send("Removed ``" + args[1] + "`` from the user whitelist.")
                    })
                })
            } else {
                message.channel.send("You do not have enough permissions to run this command.")
            }
        } else {
            con.query("SELECT ID FROM PERSONA WHERE name = ?", [args[2]], (err, result) => {
                if (result.length > 0) {
                    if (args[1] === "$")
                        con.query("UPDATE PERSONA SET cash = cash - ? WHERE name = ?", [args[0], args[2]], err => {
                            if (!err) message.channel.send("Removed **" + args[0] + " $**" + " to **" + args[2] + "**.")
                        })
                    else if (args[1] == "SB")
                        con.query("UPDATE PERSONA SET boost = boost - ? WHERE name = ?", [args[0], args[2]], err => {
                            if (!err) message.channel.send("Removed **" + args[0] + " SB**" + " to **" + args[2] + "**.")
                        })
                } else message.channel.send("Persona **" + args[2] + "** not found.")
            })
        }
    }
};

module.exports.help = {
    name: "del"
};