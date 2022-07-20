const axios = require('axios');
const settings = require("../settings.js");
const { MessageEmbed } = require('discord.js');

module.exports.run = (bot, message, args, con) => {
    if (message.channel.id === settings.channel.command.admin && (message.member && message.member.roles.cache.find(r => r.id === settings.role.moderator))) {
        axios.get("http://localhost:8087/api/sessions", {headers: {"Authorization": settings.core.token.openfire}})
        .then(function (response) {
            console.log(response.data);
          });
    }
}

module.exports.help = {
    name: "onlineplayers",
    description: ["Output the list of players currently playing."],
    category: "[⚔️] Moderator ",
    args: "",
    roles: [settings.role.moderator]
};