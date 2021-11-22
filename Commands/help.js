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
        .setColor("#6600ff")
        .setDescription("Every commands of **Statify** are listed below.")
        message.channel.send({ embeds: [embed] })
        var description = {}

    for (const category in helps) {
        for (const help of helps[category]) {
            if (help.hidden === true) continue;
            var cansee = help.roles === undefined || help.roles.length === 0
            if (help.roles) {
                for (const role of help.roles) {
                    cansee ||= roles.includes(role)
                }
            }

            if (cansee) {
                if (help.description)
                    help.description.forEach((desc, i) => {
                        var param = ""
                        if (help.param) param = " " + help.param[i]
                        if(!description[category]) description[category] = []
                        description[category].push( {name: settings.bot.prefix + help.name + (param ?? '') + " " + (help.args ?? ''), description : (desc ?? '') } )
                    })

            }
        }
        if(category && description[category]){
            const embed = new MessageEmbed()
            .setDescription("__**" + category + "**__")
            .setColor("#6600ff")

            for(const desc of description[category]) {
                embed.addField("**" + desc['name'] + "**", desc['description'])
            }
            message.channel.send({ embeds: [embed] })
        }
    }
    console.log(embed.length)
};

module.exports.help = {
    name: "help",
    hidden: true
};