const settings = require("../settings.js");
module.exports.run = (bot, message, args, con) => {
    if (message.channel.id === settings.channel.command.admin && (message.member && message.member.roles.cache.find(r => r.id === settings.role.launcher || settings.role.admin))) {
        if (args[0] == "sha") {
            if (message.member && message.member.roles.cache.find(r => r.id === settings.role.launcher || settings.role.admin)) {
                con.query("SELECT value FROM PARAMETER WHERE name = 'SIGNED_LAUNCHER_HASH'", [], (err, result) => {
                    let items = result[0]["value"].split(";")
                    let response = "";
                    for (let item of items)
                        response += "`" + item + "`, "

                    if (!err) message.channel.send("**SHA** list of whitelisted launcher builds : \n" + response.slice(0, -2) + ".")
                })
            } else {
                message.channel.send("You do not have enough permissions to run this command.")
            }
        } else if (args[0] == "hwid") {
            if (message.member && message.member.roles.cache.find(r => r.id === settings.role.launcher || settings.role.admin)) {
                con.query("SELECT value FROM PARAMETER WHERE name = 'SIGNED_LAUNCHER_HWID_WL'", [], (err, result) => {
                    let items = result[0]["value"].split(";")
                    let response = "";
                    for (let item of items)
                        response += "`" + item + "`, "

                    if (!err) message.channel.send("**HWID** list of whitelisted users : \n" + response.slice(0, -2) + ".")
                })
            } else {
                message.channel.send("You do not have enough permissions to run this command.")
            }
        }
    } else {
        const embed = new MessageEmbed()
        .setColor("#ff0000")
        .addField("Insufficient permissions", "You need `" + this.help.category.substring(4) + "` permissions to run this command.")
        .setFooter(bot.user.tag, bot.user.displayAvatarURL())
        .setTimestamp()
    message.channel.send({ embeds: [embed] })
    }
}

module.exports.help = {
    name: "list",
    description: ["List choosen hash type registered in database."],
    category: "[⚙️] Launcher developer",
    args: "[SHA or HWID]",
    roles: [settings.role.admin,settings.role.launcher] 
};