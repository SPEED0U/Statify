const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const settings = require("../settings.json");
module.exports.run = (bot, message, args, con) => {
    if (message.channel.id === settings.channel.command.public ||
        (message.member && message.member.roles.cache.find(r => r.id === settings.role.moderator))) {
        con.query("SELECT PERSONA.ID AS personaid, PERSONA.name AS personaname, streak, iconIndex, PERSONA.motto AS personamotto, PERSONA.level AS personalevel, cash, score, boost, prestige, isStreakBroken, (SELECT COUNT(ID) FROM CAR WHERE CAR.personaId = PERSONA.ID) AS nbcar, (SELECT COUNT(ID) FROM EVENT_DATA WHERE EVENT_DATA.personaId = PERSONA.ID AND finishReason IN(22,512)) AS eventsdone, premium, K_CREW.name AS crewname, K_CREW.tag AS crewtag FROM `PERSONA` INNER JOIN TREASURE_HUNT ON PERSONA.ID = TREASURE_HUNT.personaId INNER JOIN USER ON PERSONA.USERID = USER.ID LEFT JOIN K_CREW_MEMBER ON PERSONA.ID = K_CREW_MEMBER.personaID LEFT JOIN K_CREW ON K_CREW_MEMBER.crewID = K_CREW.ID WHERE PERSONA.name = ?", [args[0]], (err, result) => {
            if (result.length > 0) {
                let description = !!result[0].personamotto ? result[0].personamotto : "Motto not set."
                const embed = new MessageEmbed()
                    .setAuthor(result[0].personaname, "", settings.url.website + "/player/driver/" + result[0].personaid, true)
                    .setThumbnail(settings.url.avatarEndpoint + result[0].iconIndex + '.jpg', true)
                    .addField("<:rep:814916853318025227> • __Level__", result[0].personalevel + " (Prestige: " + result[0].prestige + ")", true)
                    .addField("<:cash:814916853595766784> • __Cash__", Number(result[0].cash).toLocaleString('en-GB') + " $", true)
                    .addField("<:speedboost:815940388937269269> • __Speedboost__", Number(result[0].boost).toLocaleString('en-GB') + " SB", true)
                if (result[0].streak <= 1) {
                    embed.addField("💎 • __Treasure hunt__", (result[0].streak + " day " + ((result[0].isStreakBroken[0] === 1 ? " <:thbroken:815945367115137054>" : " <:thok:815945367110549504>"))), true)
                } else {
                    embed.addField("💎 • __Treasure hunt__", (result[0].streak + " days " + ((result[0].isStreakBroken[0] === 1 ? " <:thbroken:815945367115137054>" : " <:thok:815945367110549504>"))), true)
                }
                embed.addField("<:driverscore:815363448086986754> • __Driver score__", Number(result[0].score).toLocaleString('en-GB') + " D", true)
                    .addField("🚘 • __Cars owned__", result[0].nbcar + "", true)
                    .addField("🎖️ • __Membership__", (result[0].premium[0] === 1 ? "Premium" : "Freemium"), true)
                    .addField("👨‍👨‍👧 • __Crew__", (result[0].crewtag ? "[" + result[0].crewtag + "] " + result[0].crewname : "Not in a crew"), true)
                    .addField("🏁 • __Races completed__", Number(result[0].eventsdone).toLocaleString('en-GB'), true)
                    .setColor("#6600ff")
                    .setDescription("Motto: " + "`" + description + "`")
                const messagebutton = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel('View full profile on website')
                            .setStyle('LINK')
                            .setURL(settings.url.website + "/player/driver/" + result[0].personaid)
                    );

                message.channel.send({ embeds: [embed], components: [messagebutton] })


            } else {
                message.channel.send("Unable to find **" + args[0] + "** driver in database.")
            }
        })
    } else {
        message.channel.send("You do not have enough permissions to run this command.")
    }
}

module.exports.help = {
    name: "player"
};