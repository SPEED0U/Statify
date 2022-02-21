const { MessageEmbed, Guild } = require('discord.js');
const CronJob = require('cron').CronJob;
const axios = require('axios');
const settings = require("../settings.js");

let countMaxOnline, datePlayerPeak, timestamp, date

// Modules.
module.exports = (bot, con) => {
    const channel = bot.channels.cache.get(settings.channel.status)

    function playersonline() {
        try {
            con.query("SELECT * FROM ONLINE_USERS ORDER BY numberOfOnline DESC LIMIT 1", function (err, result) {
                if (!err) countMaxOnline = result[0].numberOfOnline;
                if (!err) timestamp = result[0].ID * 1000;
                date = new Date(timestamp);
                datePlayerPeak = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
            });
        } catch (err) { }
    }

    function serverstatus() {
        axios.get(settings.core.url + "/Engine.svc/GetServerInformation").then(response => {
            const json = response.data
            if (response.status !== 200 || json.length === 0) {
                throw ''
            }

            if (settings.core.announceLobbies === true) {
                if (json.onlineNumber <= settings.core.maxPlayerAnnounceLobby) {
                    con.query("SELECT value FROM PARAMETER WHERE name = 'SBRWR_INFORM_EVENT'", function (err, paramresult) {
                        if (paramresult[0].value == "false") {
                            con.query("UPDATE PARAMETER SET value = 'true' WHERE name = 'SBRWR_INFORM_EVENT'")
                            axios.post(settings.core.url + '/Engine.svc/ReloadParameters', "adminAuth=" + settings.core.token.server, null)
                        }
                    })
                } else if (json.onlineNumber > settings.core.maxPlayerAnnounceLobby) {
                    con.query("SELECT value FROM PARAMETER WHERE name = 'SBRWR_INFORM_EVENT'", function (err, paramresult) {
                        if (paramresult[0].value == "true") {
                            con.query("UPDATE PARAMETER SET value = 'false' WHERE name = 'SBRWR_INFORM_EVENT'")
                            axios.post(settings.core.url + '/Engine.svc/ReloadParameters', "adminAuth=" + settings.core.token.server, null)
                        }
                    })
                }
            }

            bot.guilds.fetch(settings.bot.serverid).then(guild => {
                const embed = new MessageEmbed()
                    .setAuthor({
                        name: json.serverName,
                        url: settings.url.website,
                        iconURL: guild.iconURL()
                    })
                    .setColor(settings.bot.embed.hexColor)
                    .setDescription("🟢 • Server is up and running.")
                    .addField('🌐 | __Online players__', json.onlineNumber.toString(), true)
                    .addField('🔖 | __Player peak__', "**" + countMaxOnline + "** the " + datePlayerPeak + "", true)
                    .addField('🎫 | __Registered players__', Intl.NumberFormat('en-US').format(json.numberOfRegistered) + "", true)
                if (json.cashRewardMultiplier <= 1 & json.repRewardMultiplier <= 1) {
                    embed.addField('📈 | __Multiplier__', "No multiplier active", true)
                } else if (json.cashRewardMultiplier > 1 & json.repRewardMultiplier <= 1) {
                    embed.addField('📈 | __Multiplier__', "Cash **X" + (json.cashRewardMultiplier) + "**", true)
                } else if (json.repRewardMultiplier > 1 & json.cashRewardMultiplier <= 1) {
                    embed.addField('📈 | __Multiplier__', "Reputation **X" + (json.repRewardMultiplier) + "**", true)
                } else if (json.cashRewardMultiplier > 1 & json.repRewardMultiplier > 1) {
                    embed.addField('📈 | __Multiplier__', "Cash & Rep **X" + (json.cashRewardMultiplier) + "**", true)
                } else if (json.cashRewardMultiplier != json.repRewardMultiplier && json.repRewardMultiplier > 1 || json.cashRewardMultiplier > 1) {
                    embed.addField('📈 | __Multiplier__', "Cash **X" + (json.cashRewardMultiplier) + "**, Rep **X" + (json.repRewardMultiplier) + "**", true)
                }

                embed.addField('🕵 | __Admins__', "<@&" + settings.role.admin + ">", true)
                    .addField('👮 | __Moderators__', "<@&" + settings.role.moderator + ">", true)
                    .addField('⏲️ | __Timezone__', '[' + settings.core.timezone + '](https://time.is/' + settings.core.timezone + ') [' + ('0' + new Date().getHours()).slice(-2) + ':' + ('0' + new Date().getMinutes()).slice(-2) + ']', true)
                    .addField('⏲️ | __Speedbug timer__', (json.secondsToShutDown / 60 / 60) + " hours", true)
                    .addField('⚙️ | __Server version__', json.serverVersion, true)
                    .setFooter({
                        text: bot.user.tag,
                        iconURL: bot.user.displayAvatarURL()
                    })
                    .setTimestamp()


                bot.user.setActivity({
                    name: json.onlineNumber + " players racing",
                    url: settings.url.website,
                    type: "WATCHING",
                    status: 'online'
                })

                channel.messages.fetch({ limit: 1 }).then(messages => {
                    let lastMessage = messages.first()
                    if (lastMessage) {
                        lastMessage.edit({ embeds: [embed] });
                    } else {
                        channel.send({ embeds: [embed] })
                    }
                })
            });
        }).catch(() => {
            bot.guilds.fetch(settings.bot.serverid).then(guild => {
            const embed = new MessageEmbed()
                .setAuthor({
                    name: settings.core.serverName,
                    url: settings.url.website,
                    iconURL: guild.iconURL()
                })
                .setColor("#ff0000")
                .setDescription("🔴 • Server is offline, check <#" + settings.channel.announcement + "> for further informations.")
                .addField('🌐 | __Online players__', "N/A", true)
                .addField('🔖 | __Player peak__', "N/A", true)
                .addField('🎫 | __Registered players__', "N/A", true)
                .addField('📈 | __Multiplier__', "N/A", true)
                .addField('🕵 | __Admins__', "<@&" + settings.role.admin + ">", true)
                .addField('👮 | __Moderators__', "<@&" + settings.role.admin + ">", true)
                .addField('⏲️ | __Timezone__', '[CET](https://time.is/fr/CET) [' + ('0' + new Date().getHours()).slice(-2) + ':' + ('0' + new Date().getMinutes()).slice(-2) + ']', true)
                .addField('⏲️ | __Speedbug timer__', "N/A", true)
                .addField('⚙️ | __Server version__', "N/A", true)
                .setFooter({
                    text: "last update"
                })
                .setTimestamp()

            channel.messages.fetch({ limit: 1 }).then(messages => {
                let lastMessage = messages.first()
                if (lastMessage) {
                    lastMessage.edit({ embeds: [embed] });
                } else {
                    channel.send({ embeds: [embed] })
                }
            })
        });
            bot.user.setActivity({
                name: "players complain because they don't read #📰-announcements.",
                type: "WATCHING",
                url: settings.url.website,
                status: 'idle'
            })
        })
    }
    const jobmaxplayer = new CronJob('* * * * *', playersonline)
    const jobstatus = new CronJob('* * * * *', serverstatus)


    jobmaxplayer.start()
    jobstatus.start()

    serverstatus()
    playersonline()
}