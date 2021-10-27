const fs = require("fs");
const mergeJSON = function (target, add) {
    function isObject(obj) {
        if (typeof obj == "object") {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    return true; // search for first object prop
                }
            }
        }
        return false;
    }
    for (var key in add) {
        if (add.hasOwnProperty(key)) {
            if (target[key] && isObject(target[key]) && isObject(add[key])) {
                mergeJSON(target[key], add[key]);
            } else {
                target[key] = add[key];
            }
        }
    }
    return target;
};

if (!fs.existsSync("./local.settings.json")) {
    fs.writeFileSync("./local.settings.json", fs.readFileSync("./settings.json"))
    console.log('The file "local.settings.json" has been created, you must fill the parameters.\nSee the documentation on Github for more informations.')
    process.exit(0)
}
const settings = require("./settings.json")
const localSettings = require("./local.settings.json")
module.exports = mergeJSON(settings,localSettings)