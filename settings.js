const settings = require("./settings.json")
const localSettings = require("./local.settings.json")
module.exports = {...settings,...localSettings}