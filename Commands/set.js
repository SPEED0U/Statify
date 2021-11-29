const settings = require("../settings.js");
const { MessageEmbed } = require('discord.js');
const commands = {
    repmultiplier,
    cashmultiplier,
    multiplier,
    modsversion,
    scenery
}
module.exports.run = (bot, message, args, con) => {
    if (commands[args[0]]) {
        if (message.channel.id === settings.channel.command.admin ||
            (message.member.roles.cache.find(r => r.id === settings.role.moderator))) {
            commands[args[0]](bot, message, args, con)
        } else {
            const embed = new MessageEmbed()
                .setColor("#ff0000")
                .addField("Insufficient permissions", "You need `" + this.help.category.substring(4) + "` permissions to run this command.")
                .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
        }
    }
};

function repmultiplier(bot, message, args, con) {
    con.query("UPDATE PARAMETER SET value = ? WHERE name = 'REP_REWARD_MULTIPLIER'", [args[1]], err => {
        if (!err) {
            const embed = new MessageEmbed()
                .setAuthor("Reward multiplier")
                .setColor("#0090e3")
                .addField("Reputation", "The **rep** multiplier is now `X" + args[1] + "`")
                .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
            newSettings(bot, message, args, con)
        }
    })
}

function cashmultiplier(bot, message, args, con) {
    con.query("UPDATE PARAMETER SET value = ? WHERE name = 'CASH_REWARD_MULTIPLIER'", [args[1]], err => {
        if (!err) {
            const embed = new MessageEmbed()
                .setAuthor("Reward multiplier")
                .setColor("#b2c6d1")
                .addField("Cash", "The **cash** multiplier is now `X" + args[1] + "`")
                .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
            newSettings(bot, message, args, con)
        }
    })
}

function multiplier(bot, message, args, con) {
    con.query("UPDATE PARAMETER SET value = ? WHERE name IN('CASH_REWARD_MULTIPLIER', 'REP_REWARD_MULTIPLIER')", [args[1]], err => {
        if (!err) {
            const embed = new MessageEmbed()
                .setAuthor("Reward multiplier")
                .setColor("#75dfff")
                .addField("Cash", "The **cash** multiplier is now `X" + args[1] + "`")
                .addField("Reputation", "The **rep** multiplier is now `X" + args[1] + "`")
                .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
            newSettings(bot, message, args, con)
        }
    })
}

function modsversion(bot, message, args, con) {
    const modsurl = settings.url.modsEndpoint + args[1]
    con.query("UPDATE PARAMETER SET value = ? WHERE name = 'MODDING_BASE_PATH'", [modsurl], err => {
        if (!err) {
            const embed = new MessageEmbed()
                .setAuthor("Server mods")
                .setColor("#00ff84")
                .addField("Version", "The **mods version** is now `" + args[1] + "`")
                .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
            newSettings(bot, message, args, con)
        }
    })
}

function scenery(bot, message, args, con) {
    switch (args[1].toLowerCase()) {
        case "fireworks":
            con.query("UPDATE PARAMETER SET value = 'SCENERY_GROUP_NEWYEARS' WHERE name = 'SERVER_INFO_ENABLED_SCENERY'")
            con.query("UPDATE PARAMETER SET value = 'SCENERY_GROUP_NEWYEARS_DISABLED' WHERE name = 'SERVER_INFO_DISABLED_SCENERY'")
            var embed = new MessageEmbed()
                .setAuthor("Game scenery")
                .setColor("#ffffff")
                .addField("Scenery", "The **scenery** has been set to `fireworks`")
                .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
            break;
        case "normal":
            con.query("UPDATE PARAMETER SET value = 'SCENERY_GROUP_NORMAL' WHERE name = 'SERVER_INFO_ENABLED_SCENERY'")
            con.query("UPDATE PARAMETER SET value = 'SCENERY_GROUP_NORMAL_DISABLED' WHERE name = 'SERVER_INFO_DISABLED_SCENERY'")
            var embed = new MessageEmbed()
                .setAuthor("Game scenery")
                .setColor("#ffffff")
                .addField("Scenery", "The **scenery** has been set to `normal`")
                .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
            break;
        case "halloween":
            con.query("UPDATE PARAMETER SET value = 'SCENERY_GROUP_HALLOWEEN' WHERE name = 'SERVER_INFO_ENABLED_SCENERY'")
            con.query("UPDATE PARAMETER SET value = 'SCENERY_GROUP_HALLOWEEN_DISABLED' WHERE name = 'SERVER_INFO_DISABLED_SCENERY'")
            var embed = new MessageEmbed()
                .setAuthor("Game scenery")
                .setColor("#ffffff")
                .addField("Scenery", "The **scenery** has been set to `halloween`")
                .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
            break;
        case "christmas":
            con.query("UPDATE PARAMETER SET value = 'SCENERY_GROUP_CHRISTMAS' WHERE name = 'SERVER_INFO_ENABLED_SCENERY'")
            con.query("UPDATE PARAMETER SET value = 'SCENERY_GROUP_CHRISTMAS_DISABLED' WHERE name = 'SERVER_INFO_DISABLED_SCENERY'")
            var embed = new MessageEmbed()
                .setAuthor("Game scenery")
                .setColor("#ffffff")
                .addField("Scenery", "The **scenery** has been set to `christmas`")
                .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
            break;
        case "oktoberfest":
            con.query("UPDATE PARAMETER SET value = 'SCENERY_GROUP_OKTOBERFEST' WHERE name = 'SERVER_INFO_ENABLED_SCENERY'")
            con.query("UPDATE PARAMETER SET value = 'SCENERY_GROUP_OKTOBERFEST_DISABLED' WHERE name = 'SERVER_INFO_DISABLED_SCENERY'")
            var embed = new MessageEmbed()
                .setAuthor("Game scenery")
                .setColor("#ffffff")
                .addField("Scenery", "The **scenery** has been set to `oktoberfest`")
                .setFooter(bot.user.tag, bot.user.displayAvatarURL())
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
            break;
    }
    newSettings(bot, message, args, con)
}

function newSettings(bot, message, args, con) {
    const embed = new MessageEmbed()
        .setColor("#ff7700")
        .addField("Settings changed", "To apply the new settings use `" + settings.bot.prefix + "reload`.")
        .setFooter(bot.user.tag, bot.user.displayAvatarURL())
        .setTimestamp()
    message.channel.send({ embeds: [embed] })
}

module.exports.help = {
    name: "set",
    description: ["Changes the global multiplier value.", "Changes the reputation multiplier value.", "Changes the cash multiplier value.", "Changes the version of game mods.", "Changes the game map scenery."],
    param: ["multiplier", "repmultiplier", "cashmultiplier", "modsversion", "scenery"],
    category: "[⚔️] Moderator",
    args: "[player] [reason]",
    roles: [settings.role.admin, settings.role.moderator]
};