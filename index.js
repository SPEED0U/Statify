const { Client, Intents, Collection } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fs = require('fs');
bot.commands = new Collection();
const mysql = require('mysql');
const settings = require("./settings.js");
var con = mysql.createConnection(settings.sql);

bot.login(settings.bot.token)
bot.on("ready", function() {
    fs.readdir('./Events/', (error, f) => {
        if (error) { return console.error(error); }
        
        f.forEach((f) => {
            let events = require(`./Events/${f}`);
            let event = f.split('.')[0];
            bot.on(event, events.bind(null, bot, con));
            console.log("Loaded " + f + " event.");
            });
        })
    fs.readdir('./Scripts/', (error, f) => {
            if (error) { return console.error(error); }
            console.log("Loaded " + f + " script.");

            f.forEach((f) => {
                let events = require(`./Scripts/${f}`);
                events(bot, con);
            });
        })
    fs.readdir("./Commands/", (error, f) => {
        if (error) { return console.error(error); }
        let commands = f.filter(file => file.endsWith(".js"));
        if (commands.length <= 0) { return console.log("No command found."); }

        commands.forEach((f) => {
            let command = require(`./Commands/${f}`);
            console.log("Loaded " + f + " command.");
            bot.commands.set(command.help.name, command);
        });
    });
})

if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};