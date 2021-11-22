const settings = require("../settings.js");
const axios = require('axios');
const commands = {
    copsdestroyed,
    copsrammed,
    playersbusted,
    airtime,
    eventstoday,
    eventsthisweek,
    onlineplayers,
    registeredplayers,
    forgedpartsinv,
    forgedpartsinstalled
}
module.exports.run = (bot, message, args, con) => {
    if (commands[args[0]]) {
        if (message.channel.id === settings.channel.command.moderator ||
            (message.member.roles.cache.find(r => r.id === settings.role.moderator))) {
            commands[args[0]](bot, message, args, con)
        } else {
            message.channel.send("You do not have enough permissions to run this command.")
        }
    }
};

function copsdestroyed(bot, message, args, con) {
    con.query("SELECT SUM(`copsDisabled`) AS sum FROM `EVENT_DATA` WHERE finishReason IN(22,518)", function(err, result) {
        if (!err) message.channel.send(":oncoming_police_car: • There was **" + Intl.NumberFormat('en-US').format(result[0].sum) + "** cops destroyed.")
    });
}

function copsrammed(bot, message, args, con) {
    con.query("SELECT SUM(`copsRammed`) AS sum FROM `EVENT_DATA` WHERE finishReason IN(22,518)", function(err, result) {
        if (!err) message.channel.send(":oncoming_police_car: • There was **" + Intl.NumberFormat('en-US').format(result[0].sum) + "** cops rammed.")
    });
}

function playersbusted(bot, message, args, con) {
    con.query("SELECT SUM(`bustedCount`) AS sum FROM `EVENT_DATA` WHERE finishReason IN(22,518)", function(err, result) {
        if (!err) message.channel.send(":police_officer_tone2: • There was **" + Intl.NumberFormat('en-US').format(result[0].sum) + "** players busted.")
    });
}

function airtime(bot, message, args, con) {
    con.query("SELECT SUM(`sumOfJumpsDurationInMilliseconds`) AS sum FROM `EVENT_DATA` WHERE finishReason IN(22,518)", function(err, result) {
        if (!err) message.channel.send(":timer: • Players spent a total of **" + msToTime(result[0].sum) + "**in air.")
    });
}

function eventstoday(bot, message, args, con) {
    con.query("SELECT COUNT(ID) AS sum FROM `EVENT_DATA` WHERE finishReason IN(22,518) AND `DATE_PLAY` LIKE concat(curdate(),'%')", function(err, result) {
        if (!err) message.channel.send(":chart_with_upwards_trend: • There was **" + Intl.NumberFormat('en-US').format(result[0].sum) + "** events completed today.")
    });
}

function eventsthisweek(bot, message, args, con) {
    con.query("SELECT COUNT(ID) AS sum FROM `EVENT_DATA` WHERE finishReason IN(22,518) AND `DATE_PLAY` > DATE_FORMAT(SUBDATE(now(), dayofweek(now()) - 2), '%Y-%m-%d')", function(err, result) {
        if (!err) message.channel.send(":chart_with_upwards_trend: • There was **" + Intl.NumberFormat('en-US').format(result[0].sum) + "** events completed this week.")
    });
}

function onlineplayers(bot, message, args, con) {
    con.query("SELECT numberOfOnline AS sum FROM ONLINE_USERS ORDER BY ID DESC LIMIT 1", function(err, result) {
        if (!err) message.channel.send(":globe_with_meridians: • There is **" + Intl.NumberFormat('en-US').format(result[0].sum) + "** players online.")
    });
}

function registeredplayers(bot, message, args, con) {
    axios.get(settings.server_core_url + "/Engine.svc/GetServerInformation").then(response => {
        const json = response.data
        message.channel.send(":chart_with_upwards_trend: • There is **" + Intl.NumberFormat('en-US').format(json.numberOfRegistered) + "** players registered.")
    });
}

function forgedpartsinv(bot, message, args, con) {
    con.query("SELECT COUNT(*) AS FORGEDPARTSINV FROM INVENTORY_ITEM WHERE INVENTORY_ITEM.productId LIKE('%SRV-FORGED%')", function(err, result) {
        if (!err) message.channel.send(":star: • There is **" + result[0].FORGEDPARTSINV + "** forged parts in all player's inventories.")
    });
}

function forgedpartsinstalled(bot, message, args, con) {
    con.query("SELECT COUNT(*) AS FORGEDPARTSINSTALLED FROM PERFORMANCEPART WHERE PERFORMANCEPART.performancePartAttribHash IN('-1851071701','106599177','-1450656527','-1218843908','1665759806','-240640192')", function(err, result) {
        if (!err) message.channel.send(":star: • There is **" + result[0].FORGEDPARTSINSTALLED + "** forged parts installed on all cars owned.")
    });
}

function msToTime(duration) {
    let milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
        days = Math.floor(duration / (1000 * 60 * 60 * 24))

    days = (days < 10) ? "0" + days : days
    hours = (hours < 10) ? "0" + hours : hours
    minutes = (minutes < 10) ? "0" + minutes : minutes
    seconds = (seconds < 10) ? "0" + seconds : seconds

    return days + " days, " + hours + " hours, " + minutes + " minutes and " + seconds + " seconds "
}

module.exports.help = {
    name: "stat",
    description: [  
                    "Show how much cops has been destroyed.",
                    "Show how much cops has been rammed.",
                    "Show how much time players spent in airs.",
                    "Show how much events has been completed today.",
                    "Show how much events has been completed this week.",
                    "Show how much players are currently connected.",
                    "Show how much players are registered on server."
                ],
    param: ["copsdestroyed","copsrammed","playersbusted","airtime","eventstoday","eventsthisweek","onlineplayers","registeredplayers"],
    category: "Moderator",
    args: "[player] [reason]",
    roles: [settings.role.admin,settings.role.moderator] 
};