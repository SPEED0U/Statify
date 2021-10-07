const { MessageEmbed } = require('discord.js');
const settings = require("../settings.json");

module.exports.run = async (bot, message, args) => {
    const embed = new MessageEmbed()
        .setAuthor("Command list", 'https://cdn.nightriderz.world/images/website/NR_NoBG_Shadow.png', 'https://nightriderz.world')
        .setColor("#6600ff")
        .setDescription("Every commands of **Statify** are listed below.")
        .addField('Settings [Moderators]', "**" + settings.bot.prefix + "set multiplier [value]** ― To change **global** multiplier value. \n**" + settings.bot.prefix + "set repmultiplier [value]** ― To change **reputation** multiplier value.\n**" + settings.bot.prefix + "set cashmultiplier [value]** ― To change **cash** multiplier value.\n**" + settings.bot.prefix + "set modsversion [value]** ― To change **mods version** value.\n**" + settings.bot.prefix + "set scenery [mode]** ― To change the map scenery.\n**" + settings.bot.prefix + "reload** ― To apply every **settings** changes done in database.\n", false)
        .addField('Statistics [Moderators]', "**" + settings.bot.prefix + "stat copsdestroyed** ― Displays how much cops has been **destroyed** in total.\n**" + settings.bot.prefix + "stat copsrammed** ― Displays how much cops has been **rammed** in total.\n**" + settings.bot.prefix + "stat playersbusted** ― Displays how much **players** has been **busted** in total.\n**" + settings.bot.prefix + "stat airtime** ― Displays how much time **players** spent in **air** in total.\n**" + settings.bot.prefix + "stat eventstoday** ― Displays how much **players** did **races** today.\n**" + settings.bot.prefix + "stat eventsthisweek** ― Displays how much **players** did **races** this week.\n**" + settings.bot.prefix + "stat onlineplayers** ― Displays how much **players** are on **server**.\n**" + settings.bot.prefix + "stat registeredplayers** ― Displays how much **players** are **registered** on **server**.\n**" + settings.bot.prefix + "stat forgedpartsinv** ― Displays how much **forged parts** are **owned** in **inventory**.\n**" + settings.bot.prefix + "stat forgedpartsinstalled** ― Displays how much **forged parts** are **installed** on all **cars**.\n", true)
        .addField('Player info [Everyone]', "**" + settings.bot.prefix + "player [value]** ― To display multiple **informations** about a **player**.\n", false)
        .addField('Player manager [Moderators]', "**" + settings.bot.prefix + "add [amount] [currency] [persona]** ― Add an amount of **$** or **SB** to a **player**.\n**" + settings.bot.prefix + "del [amount] [currency] [persona]** ― Del an amount of **$** or **SB** to a **player**.\n**" + settings.bot.prefix + "lock [email]** ― Lock the **account** of a **player**.\n**" + settings.bot.prefix + "unlock [email]** ― Unlock the **account** of a **player**.\n**" + settings.bot.prefix + "ban [driver] [reason]** ― Definitively ban a driver from the game. Reason is optional.\n**" + settings.bot.prefix + "tempban [driver] [duration] [reason]** ― Temporarily ban a driver from the game. Reason is optional.\n**" + settings.bot.prefix + "unban [driver] [reason]** ― Unban a driver from the game. Reason is optional.", false)
        .addField('Launcher filters [Launcher developer]', "**" + settings.bot.prefix + "add [sha]** ― Add a launcher **hash** to the allowed launcher build list.\n**" + settings.bot.prefix + "add [hwid]** ― Add a user **hash** to the whitelist so they can bypass **build** filter.\n**" + settings.bot.prefix + "del [sha]** ― Delete a launcher **hash** from the allowed launcher build list.\n**" + settings.bot.prefix + "del [hwid]** ― Delete a user **hash** to the whitelist so they can bypass **build** filter.\n**" + settings.bot.prefix + "list sha** ― To show whitelisted launcher builds.\n**" + settings.bot.prefix + "list hwid** ― To show whitelisted users.\n")
        .addField('URL shortner [Moderators]', "**" + settings.bot.prefix + "shorturl add [url]** ― Shortner a requested URL.\n**" + settings.bot.prefix + "shorturl del [url]** ― Remove the requested URL from database.\n")
        .setFooter("Requested at")
        .setTimestamp()
    message.channel.send({embeds:[embed]})
};

module.exports.help = {
    name: "help"
};