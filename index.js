const { Client, Intents, Collection } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fs = require('fs');
bot.commands = new Collection();
const mysql = require('mysql');
const settings = require("./settings.json");
var con = mysql.createConnection({
    host: settings.sql.host,
    user: settings.sql.user,
    password: settings.sql.password,
    database: settings.sql.database
});


// Token du bot pour qu'il se connecte au serveur discord.
bot.login(settings.bot.token)
bot.on("ready", function() {
    // Importation du fichier : Events.
    fs.readdir('./Events/', (error, f) => {
            if (error) { return console.error(error); }
            console.log(`${f.length} events loaded.`);

            f.forEach((f) => {
                let events = require(`./Events/${f}`);
                let event = f.split('.')[0];
                bot.on(event, events.bind(null, bot, con));
            });
        })
        // Importation des scripts
    fs.readdir('./Scripts/', (error, f) => {
            if (error) { return console.error(error); }
            console.log(`${f.length} script loaded.`);

            f.forEach((f) => {
                let events = require(`./Scripts/${f}`);
                events(bot, con);
            });
        })
        /// Importation du fichier : Commandes/.
    fs.readdir("./Commandes/", (error, f) => {
        if (error) { return console.error(error); }
        let commandes = f.filter(f => f.split(".").pop() === "js");
        if (commandes.length <= 0) { return console.log("Aucune commande trouvée !"); }

        commandes.forEach((f) => {
            let commande = require(`./Commandes/${f}`);
            console.log(`${f} command loaded.`);
            bot.commands.set(commande.help.name, commande);
        });
    });
})

if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};