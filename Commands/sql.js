const settings = require("../settings.js");
const asTable = require('as-table');

const { MessageEmbed } = require('discord.js');

module.exports.run = (bot, message, args, con) => {
    if ((message.channel.id === settings.channel.command.admin) && (message.member && message.member.roles.cache.find(r => r.id === settings.role.admin))) {
        let sqlquery = message.replace(settings.bot.prefix+"sql ", "").replace("```sql", "").replace("```", "");
        con.query(sqlquery, (err, sqlcommand) => {
            if (err) {
                message.channel.send("Failed to execute command: " + err);
            } else {
                if (sqlcommand.length > 0) {
                    let sqlcommandstatement = sqlquery.split(" ")[0];

                    const embed = new MessageEmbed()
                    embed.setColor("#ff6600")

                    switch(sqlcommandstatement.toLowerCase()) {
                        case "update":
                            embed.setDescription("```" + JSON.stringify(sqlcommand) + "```");
                            break;
                        default:
                            asTableResult = asTable(sqlcommand);

                            if(asTableResult.length <= 1950) {
                                embed.setDescription("```" + asTableResult + "```");
                            } else {
                                embed.setDescription("```Result was too large, please LIMIT 1```");
                            }
                            break;
                    }

                    embed.setFooter(bot.user.tag, bot.user.displayAvatarURL())
                    embed.setTimestamp()
                    message.channel.send({embeds:[embed]})
                }
            }
        });
    }
}

module.exports.help = {
    name: "sql",
    description: ["Proceed a SQL request on the database."],
    category: "Administrator",
    args: "[request]",
    roles: [settings.role.admin] 
};