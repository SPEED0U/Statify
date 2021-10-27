const axios = require('axios');
const settings = require("../settings.js");
module.exports.run = (bot, message, args, con) => {
    if (message.channel.id === settings.channel.command.admin && (message.member && message.member.roles.cache.find(r => r.id === settings.role.admin || settings.role.launcher))) {
        axios.post(settings.core.url + '/Engine.svc/ReloadParameters', "adminAuth=" + settings.core.token.server, null).then(() => {
            message.channel.send("Reloaded database **parameters** !")
        })
    } else {
        message.channel.send("You do not have enough permissions to run this command.")
    }
}
module.exports.help = {
    name: "reload"
};