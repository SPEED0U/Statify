const settings = require("../settings.json");
let x = {}
module.exports = (client, con, member) => {
    if (settings.role.onArrival === true) {
        console.log(member.user.username + " just joined the server.")
        x[member.user.id] = setTimeout(function() {
            try {
                member.roles.add(settings.role.player);
                clearTimeout(x[member.user.id]);
                console.log(`Added player role to ${member.user.username} after cooldown.`);
            } catch (error) {
                console.log(error)
            }
        }, settings.role.countdown);

    }
}