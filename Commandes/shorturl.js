const settings = require("../settings.json");
const AmfPhp = async (url) => {
    const request = require("request");
    async function asyncRequest(url) {
        return new Promise((resolve, reject) => {
          request({
            headers: {'content-type' : 'application/json'},
            url:     "http://url.nightriderz.world/yourls-api.php?url=" + encodeURI(url) + "&signature=05e2685fc7&format=json&action=shorturl"
            }, (error, response, body) => resolve({ error, response, body }));
        });
      }
      let response = await asyncRequest(url);
      return  JSON.parse( response.body );
}

module.exports.run = async (bot, message, args, con) => {
    if (message.channel.id === settings.channel.command.admin && (message.member && message.member.roles.cache.find(r => r.id === settings.role.moderator))) {
        if (args[0] == "add") {
            let json = await AmfPhp(args[1])
            message.channel.send("Shortened requested URL to **" + json.shorturl + "**")
        } else if (args[0] == "del") {
            con.query("DELETE FROM yourls.yourls_url WHERE keyword = ?", [args[1].split("/").pop()], err => {
                message.channel.send("Deleted **" + args[1] + "** from database.")
            })
        }
    }
};

module.exports.help = {
    name: "shorturl"
};