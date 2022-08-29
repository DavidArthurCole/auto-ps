const http = require('http');
const https = require('https');
const fs = require('fs');
const app = require('./app');
const constants = require('./lib/util/other/constants');
const logger = require('./lib/util/other/logger');

//Can overrwite port with an ENV var, otherwise will use 3000
const port = process.env.PORT || 3000;

//Load SSL cert and key for HTTPS config
const serverOptions = constants.protocol == 'https' ? {
    key: fs.readFileSync(__dirname + '/certs/autodymo.key'),
    cert: fs.readFileSync(__dirname + '/certs/autodymo.crt')
} : {};

//Create a server using app.js
const server = (constants.protocol == 'http' ? http.createServer(app) : https.createServer(serverOptions, app));

const ConsoleWindow = require("node-hide-console-window");

//Listen on port (3000)
logger.log('info', "\n----------------------------------------------------------------".repeat(2));
logger.log('info', "\n\nServer (" + (constants.protocol.toString().toUpperCase()) + ") started" + /*(constants.testing ? " [IN TESTING MODE]" : "")  +*/ " and listening on port " + port + ":");
server.listen(port);

if(!constants.testing) ConsoleWindow.hideConsole();
else ConsoleWindow.showConsole();