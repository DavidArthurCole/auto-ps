require('dotenv').config();

//Define vars used for program wide use
function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
}

//Powershell constants
define("scriptsPath", process.env.SCRIPTS_PATH ? process.env.SCRIPTS_PATH : process.cwd() + "/scripts/");

// Server constants
define("protocol", process.env.AUTODYMO_PROTOCOL ? process.env.AUTODYMO_PROTOCOL : "http");
define("testing", process.env.TEST_MODE === "true");
define("authKey", process.env.AUTODYMO_AUTH_KEY ? process.env.AUTODYMO_AUTH_KEY : "default");
define("whitelist", process.env.AUTODYMO_IP_WHITELIST)
define("loggerUrl", process.env.LOGGER_URL)
define("loggerPort", process.env.LOGGER_PORT)