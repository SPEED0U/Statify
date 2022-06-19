const settings = require("../settings.js");
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const commands = {
    copsdestroyed,
    copsrammed,
    playersbusted,
    airtime,
    eventstoday,
    eventsthisweek,
    onlineplayers,
    registeredplayers
}

module.exports.run = (bot, message, args, con) => {
    if (commands[args[0]]) {
        if (message.channel.id === settings.channel.command.moderator ||
            (message.member.roles.cache.find(r => r.id === settings.role.moderator))) {
            commands[args[0]](bot, message, args, con)
        } else {
            const embed = new MessageEmbed()
                .setColor("#ff0000")
                .addField("Insufficient permissions", "You need `" + this.help.category.substring(4) + "` permissions to run this command.")
                .setFooter({
                    text: bot.user.tag,
                    iconURL: bot.user.displayAvatarURL()
                })
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
        }
    }
};

function copsdestroyed(bot, message, args, con) {
    con.query("SELECT SUM(`copsDisabled`) AS sum FROM `EVENT_DATA`", function (err, result) {
        if (!err) {
            const embed = new MessageEmbed()
                .setAuthor({
                    name: "Statistics",
                })
                .setColor("#b2c6d1")
                .addField("Cops destroyed", "`" + Intl.NumberFormat('en-US').format(result[0].sum) + "` cops have been destroyed.")
                .setFooter({
                    text: bot.user.tag,
                    iconURL: bot.user.displayAvatarURL()
                })
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
        }
    });
}

function copsrammed(bot, message, args, con) {
    con.query("SELECT SUM(`copsrammed`) AS sum FROM `EVENT_DATA`", function (err, result) {
        if (!err) {
            const embed = new MessageEmbed()
                .setAuthor({
                    name: "Statistics",
                })
                .setColor("#b2c6d1")
                .addField("Cops rammed", "`" + Intl.NumberFormat('en-US').format(result[0].sum) + "` cops have been rammed.")
                .setFooter({
                    text: bot.user.tag,
                    iconURL: bot.user.displayAvatarURL()
                })
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
        }
    });
}

function playersbusted(bot, message, args, con) {
    con.query("SELECT SUM(`bustedCount`) AS sum FROM `EVENT_DATA` WHERE finishReason IN(22,518)", function (err, result) {
        if (!err) {
            const embed = new MessageEmbed()
                .setAuthor({
                    name: "Statistics",
                })
                .setColor("#b2c6d1")
                .addField("Players busted", "`" + Intl.NumberFormat('en-US').format(result[0].sum) + "` players have been busted.")
                .setFooter({
                    text: bot.user.tag,
                    iconURL: bot.user.displayAvatarURL()
                })
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
        }
    });
}

function airtime(bot, message, args, con) {
    con.query("SELECT SUM(`sumOfJumpsDurationInMilliseconds`) AS sum FROM `EVENT_DATA` WHERE finishReason IN(22,518)", function (err, result) {
        if (!err) {
            const embed = new MessageEmbed()
                .setAuthor({
                    name: "Statistics",
                })
                .setColor("#b2c6d1")
                .addField("Air time", "Players spent `" + msToTime(result[0].sum) + "` in airs.")
                .setFooter({
                    text: bot.user.tag,
                    iconURL: bot.user.displayAvatarURL()
                })
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
        }
    });
}

function eventstoday(bot, message, args, con) {
    con.query("SELECT COUNT(ID) AS sum FROM `EVENT_DATA` WHERE finishReason IN(22,518) AND `DATE_PLAY` LIKE concat(curdate(),'%')", function (err, result) {
        if (!err) {
            const embed = new MessageEmbed()
                .setAuthor({
                    name: "Statistics",
                })
                .setColor("#b2c6d1")
                .addField("Events completed today", "`" + Intl.NumberFormat('en-US').format(result[0].sum) + "` events have been completed today.")
                .setFooter({
                    text: bot.user.tag,
                    iconURL: bot.user.displayAvatarURL()
                })
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
        }
    });
}

function eventsthisweek(bot, message, args, con) {
    con.query("SELECT COUNT(ID) AS sum FROM `EVENT_DATA` WHERE finishReason IN(22,518) AND `DATE_PLAY` > DATE_FORMAT(SUBDATE(now(), dayofweek(now()) - 2), '%Y-%m-%d')", function (err, result) {
        if (!err) {
            const embed = new MessageEmbed()
                .setAuthor({
                    name: "Statistics",
                })
                .setColor("#b2c6d1")
                .addField("Events completed this week", "`" + Intl.NumberFormat('en-US').format(result[0].sum) + "` events have been completed this week.")
                .setFooter({
                    text: bot.user.tag,
                    iconURL: bot.user.displayAvatarURL()
                })
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
        }
    });
}

function onlineplayers(bot, message, args, con) {
    axios.get(settings.core.url + "/Engine.svc/GetServerInformation").then(response => {
        const json = response.data
        if (!err) {
            const embed = new MessageEmbed()
                .setAuthor({
                    name: "Statistics",
                })
                .setColor("#b2c6d1")
                .addField("Players online", "`" + Intl.NumberFormat('en-US').format(json.numberOfOnline) + "` players actually online.")
                .setFooter({
                    text: bot.user.tag,
                    iconURL: bot.user.displayAvatarURL()
                })
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
        }
    });
}

function registeredplayers(bot, message, args, con) {
    axios.get(settings.core.url + "/Engine.svc/GetServerInformation").then(response => {
        const json = response.data
        if (!err) {
            const embed = new MessageEmbed()
                .setAuthor({
                    name: "Statistics",
                })
                .setColor("#b2c6d1")
                .addField("Players registered", "`" + Intl.NumberFormat('en-US').format(json.numberOfRegistered) + "` players registered.")
                .setFooter({
                    text: bot.user.tag,
                    iconURL: bot.user.displayAvatarURL()
                })
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
        }
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

    return days + " days, " + hours + " hours, " + minutes + " minutes and " + seconds + " seconds"
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
    param: ["copsdestroyed", "copsrammed", "playersbusted", "airtime", "eventstoday", "eventsthisweek", "onlineplayers", "registeredplayers"],
    category: "[⚔️] Moderator",
    args: "[player] [reason]",
    roles: [settings.role.admin, settings.role.moderator]
};