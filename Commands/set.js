const settings = require("../settings.js");
const axios = require('axios');
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
            message.channel.send("You do not have enough permissions to run this command.")
        }
    }
};


function repmultiplier(bot, message, args, con) {
    con.query("UPDATE PARAMETER SET value = ? WHERE name = 'REP_REWARD_MULTIPLIER'", [args[1]], err => {
        if (!err) message.channel.send("<:rep:814916853318025227> • Updated **rep multiplier** to **X" + parseInt(args[1]) + "**\n" + "Apply the changes by using `" + settings.bot.prefix + "reload`.")
    })
}

function cashmultiplier(bot, message, args, con) {
    con.query("UPDATE PARAMETER SET value = ? WHERE name = 'CASH_REWARD_MULTIPLIER'", [args[1]], err => {
        if (!err) message.channel.send("<:cash:814916853595766784> • Updated **cash multiplier** to **X" + parseInt(args[1]) + "**\n" + "Apply the changes by using `" + settings.bot.prefix + "reload`.")
    })
}

function multiplier(bot, message, args, con) {
    con.query("UPDATE PARAMETER SET value = ? WHERE name IN('CASH_REWARD_MULTIPLIER', 'REP_REWARD_MULTIPLIER')", [args[1]], err => {
        if (!err) message.channel.send("<:cash:814916853595766784> <:rep:814916853318025227> • Updated **cash & rep multiplier** to **X" + parseInt(args[1]) + "**\n" + "Apply the changes by using `" + settings.bot.prefix + "reload`.")
    })
}

function modsversion(bot, message, args, con) {
    const modsurl = "https://cdn.nightriderz.world/mods/" + args[1]
    con.query("UPDATE PARAMETER SET value = ? WHERE name = 'MODDING_BASE_PATH'", [modsurl], err => {
        if (!err) message.channel.send(":gear: • Updated **mods version** to **" + args[1] + "**\n" + "Apply the changes by using `" + settings.bot.prefix + "reload`.")
    })
}

function scenery(bot, message, args, con) {
    switch (args[1].toLowerCase()) {
        case "fireworks":
            con.query("UPDATE PARAMETER SET value = 'SCENERY_GROUP_NEWYEARS' WHERE name = 'SERVER_INFO_ENABLED_SCENERY'")
            con.query("UPDATE PARAMETER SET value = 'SCENERY_GROUP_NEWYEARS_DISABLED' WHERE name = 'SERVER_INFO_DISABLED_SCENERY'")
            axios.post(settings.core.url + '/Engine.svc/ReloadParameters', "adminAuth=" + settings.core.token.server, null)
            message.channel.send(":fireworks: • Enabled **" + args[1] + "** scenery.")
            break;
        case "normal":
            con.query("UPDATE PARAMETER SET value = 'SCENERY_GROUP_NORMAL' WHERE name = 'SERVER_INFO_ENABLED_SCENERY'")
            con.query("UPDATE PARAMETER SET value = 'SCENERY_GROUP_NORMAL_DISABLED' WHERE name = 'SERVER_INFO_DISABLED_SCENERY'")
            axios.post(settings.core.url + '/Engine.svc/ReloadParameters', "adminAuth=" + settings.core.token.server, null)
            message.channel.send(":cityscape: • Enabled **" + args[1] + "** scenery.")
            break;
        case "halloween":
            con.query("UPDATE PARAMETER SET value = 'SCENERY_GROUP_HALLOWEEN' WHERE name = 'SERVER_INFO_ENABLED_SCENERY'")
            con.query("UPDATE PARAMETER SET value = 'SCENERY_GROUP_HALLOWEEN_DISABLED' WHERE name = 'SERVER_INFO_DISABLED_SCENERY'")
            axios.post(settings.core.url + '/Engine.svc/ReloadParameters', "adminAuth=" + settings.core.token.server, null)
            message.channel.send(":ghost: • Enabled **" + args[1] + "** scenery.")
            break;
        case "christmas":
            con.query("UPDATE PARAMETER SET value = 'SCENERY_GROUP_CHRISTMAS' WHERE name = 'SERVER_INFO_ENABLED_SCENERY'")
            con.query("UPDATE PARAMETER SET value = 'SCENERY_GROUP_CHRISTMAS_DISABLED' WHERE name = 'SERVER_INFO_DISABLED_SCENERY'")
            axios.post(settings.core.url + '/Engine.svc/ReloadParameters', "adminAuth=" + settings.core.token.server, null)
            message.channel.send(":christmas_tree: • Enabled **" + args[1] + "** scenery.")
            break;
        case "oktoberfest":
            con.query("UPDATE PARAMETER SET value = 'SCENERY_GROUP_OKTOBERFEST' WHERE name = 'SERVER_INFO_ENABLED_SCENERY'")
            con.query("UPDATE PARAMETER SET value = 'SCENERY_GROUP_OKTOBERFEST_DISABLED' WHERE name = 'SERVER_INFO_DISABLED_SCENERY'")
            axios.post(settings.core.url + '/Engine.svc/ReloadParameters', "adminAuth=" + settings.core.token.server, null)
            message.channel.send(":beers: • Enabled **" + args[1] + "** scenery.")
            break;
    }
}
module.exports.help = {
    name: "set",
    description: ["Changes the global multiplier value.","Changes the reputation multiplier value.","Changes the cash multiplier value.","Changes the version of game mods.","Changes the game map scenery."],
    param: ["multiplier","repmultiplier","cashmultiplier","modsversion"],
    category: "Moderator",
    args: "[player] [reason]",
    roles: [settings.role.admin,settings.role.moderator] 
};