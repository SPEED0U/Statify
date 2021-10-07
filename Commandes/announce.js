const settings = require("../settings.json");
const axios = require('axios');
const querystring = require('querystring')
module.exports.run = (bot, message, args, con) => {
    if (message.channel.id === settings.channel.command.admin &&
        (message.member.roles.cache.find(r => r.id === settings.role.moderator))) {
        const color = args.shift();
        const prefix = args.shift();
        const announcement = args.join(" ");
        const post = querystring.stringify({
            message: `TXT_${color.toUpperCase()},[${prefix}] ${announcement}`,
            announcementAuth: settings.core.token.server
        })
        const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' } };
        axios.post(settings.core.url + '/Engine.svc/Send/Announcement', post, config).then(res2 => {
            message.channel.send(":" + color.toLowerCase() + "_circle: Sucessfully sent the following **announcement message**:\n`" + "[" + prefix + "] " + announcement + "`")
        }).catch(error => {
            message.reply(error);
        })
    } else {
        message.channel.send("You do not have enough permissions to run this command.")
    }
};

module.exports.help = {
    name: "announce"
};