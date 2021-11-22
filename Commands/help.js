const { MessageEmbed } = require('discord.js');
const settings = require("../settings.js");
const fs = require('fs');

const helps = {}
fs.readdir("./Commands", (error, f) => {
    if (error) { return console.error(error); }
    let commands = f.filter(f => f.split(".").pop() === "js");
    if (commands.length <= 0) { return console.log("No command found."); }

    commands.forEach((f) => {
        let command = require(`./${f}`);
        if (helps[command.help.category] === undefined) {
            helps[command.help.category] = []
        }
        helps[command.help.category].push(command.help)
    });
});

module.exports.run = async (bot, message, args) => {
    const roles = []
    if (message.member) {
        message.member.roles.cache.forEach(r => roles.push(r.id))
    }
    const embed = new MessageEmbed()
        .setAuthor("Command list", 'https://cdn.nightriderz.world/images/website/NR_NoBG_Shadow.png', 'https://nightriderz.world')
        .setColor("#6600ff")
        .setDescription("Every commands of **Statify** are listed below.")
        .setFooter("Requested at")
        .setTimestamp()

    for (const category in helps) {
        var description = ""
        for (const help of helps[category]) {
            if (help.hidden === true) continue;
            var cansee = help.roles === undefined || help.roles.length === 0
            if (help.roles) {
                for (const role of help.roles) {
                    cansee ||= roles.includes(role)
                }
            }

            if (cansee) {
                i = 0
                if (help.description)
                    help.description.forEach(desc => {
                        var param = ""
                        if (help.param) param = " " + help.param[i]
                        description += "**" + settings.bot.prefix + help.name + (param ?? '') + " " + (help.args ?? '') + "** | " + (desc ?? '') + "\n"
                        i++
                    })
            }
        }
        if (description.length > 0) embed.addField(category, description)
    }
    message.channel.send({ embeds: [embed] })
};

module.exports.help = {
    name: "help",
    hidden: true
};