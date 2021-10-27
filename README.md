# Statify
With this Discord bot you can easily manage your **Need for Speed: World** server and get **stats** of course!
As this project is **open-source** you're free to do modifications and pull requests.

The bot is for the moment working only with [Soapbox Reloaded Core](https://github.com/SBRW-Reloaded/reloaded-sbrw-core).

### Configuration
Duplicate the `settings.example.json` file and rename it to `settings.json` then fill **every** parameters (details below).

```JSON
{
    "bot" : {
        "prefix" : "s!",
        "token" : "",
        "serverid" : "",
        "embed" : {
            "hexColor" : "#6600ff",
            "logo" : "https://image.url/logo.png"
        }
    },

    "channel" : {
        "announcement" : "",
        "support" : {
            "needhelp" : "",
            "bugreport" : ""
        },
        "banlogs" : "",
        "serverlogs" : "",
        "status" : "",
        "command" : {
            "admin" : "",
            "moderator" : "",
            "public" : ""
        }
    },

    "role" : {
        "admin" : "",
        "moderator" : "",
        "launcher" : "",
        "player" : "",
        "onArrival" : false,
        "countdown" : 600000
    },

    "url" : {
        "website" : "https://your.website",
        "pathToProfile" : "/player/driver/",
        "profileFormat" : "ID",
        "avatarFormat" : ".jpg",
        "avatarEndpoint" : "https://avatar.endpoint.url/"
    },

    "core" : {
        "serverName" : "",
        "url" : "http://url.ofyour.core:8080",
        "maxPlayerAnnounceLobby" : "",
        "announceLobbies" : true,
        "token" : {
            "server" : "",
            "openfire" : ""
        }
    },

    "sql" : {
        "host" : "",
        "user" : "",
        "password" : "",
        "database" : ""
    },

    "antispam" : {
        "maxDuplicate" : 3,
        "delay" : 5 
    }
}
```

Bot configuration
- `bot.prefix`, the command prefix of the bot.
- `bot.token`, the bot token.
- `bot.serverid`, the id of your discord server.
- `bot.embed.hexColor`, the hexadecimal color of the embed color.

Channels configuration
- `channel.announcement`, the id of the announcement channel.
- `channel.support.needhelp`, the id of the need help channel.
- `channel.support.bugreport`, the id of the bug report channel.
- `channel.banlogs`, the id of the ban logs channel.
- `channel.serverlogs`, the id of the server logs channel.
- `channel.command.admin`, the id of the channel for admin commands.
- `channel.command.moderator`, the id of the channel for moderator commands.
- `channel.command.public`, the id of the channel for public commands.

Role configuration
- `role.admin`, the id of the administrator role.
- `role.moderator`, the id of the moderator role.
- `role.launcher`, the id of the launcher maintainer role.
- `role.player`, the id of the player role.
- `role.onArrival`, the role given on arrival, set to `disabled` if you don't want that function.
- `role.countdown`, the delay to give the `onArrival` role when someone join if not disabled.

URL configuration
- `url.website`, the URL of the server's website.
- `url.avatarEndpoint`, the URL of the path containing avatar images. Example: `21.jpg` is the 21th avatar in-game.
- `url.pathToProfile`, the path to the user profile on website.
- `url.avatarFormat`, the format of images hosted on the avatar endpoint.

Core configuration
- `core.serverName`, the name of your NFS:W server.
- `core.url`, the URL of your server's core, example in `settings.json`.
- `core.maxPlayerAnnounceLobby`, the max player count where the "search for player" information on chat is enabled.
- `core.token.server`, the admin token of your server.
- `core.token.openfire`, the openfire token of your server.

Database configuration
- `sql.host`, the host IP of your mysql server.
- `sql.user`, the user that have access and modification rights of the database.
- `sql.password`, the password of the user.
- `sql.database`, the database name of your NFS:W server, generally `SOAPBOX`.

Antispam configuration
- `antispam.maxDuplicate`, the number of times someone can send duplicated text.
- `antispam.delay`, the maximum watch delay between duplicated messages.

### How to install

To use the project correctly you will need some tools.
- [Node JS](https://nodejs.org/en/) (v16.X.X).

Run the following commands into your terminal.
- `git clone https://github.com/SPEED0U/Statify/`
- `npm install`


### How to run

Go to the folder where the bot files are located and run the following commands.
- `node index.js`

### How to update

Use the following command to update the bot when there is a new version.
- `git pull`
- `npm install`

### All-in-one (update & run)

Type the following command to use the easiest way to update the bot and run it.
- `./Start.sh`

*This command apply updates available from this repo, installs the required node packages and then run the bot.*


#
Realized with ❤️ by [Speedou](https://github.com/SPEED0U), [Floruzus](https://github.com/Floruzus) and [MeTonaTOR](https://github.com/MeTonaTOR).

Please do not withdraw the license and keep the credits on this project.
