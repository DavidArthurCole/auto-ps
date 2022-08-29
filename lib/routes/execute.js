const express = require('express');
const constants = require('../util/other/constants');
const checkAuth = require('../util/http/checkAuth');
const returnCode = require('../util/http/returnCode');
const logger = require('../util/other/logger');
const router = express.Router();
const fs = require('fs');
var spawn = require('child_process').spawn, child;

router.put('/', (req, res) => {

    //Log the IP of invalid requests - skimmer catching
    logger.log('info', "\n\nNew PUT (execute) request from " + req.socket.remoteAddress.replace("::ffff", '') + ":");

    //Grab basic execution information
    const executionInfo = {
        scriptName: req.body.scriptName,
        asRoot: Boolean(req.body.asRoot),
        authKey: req.body.authKey ? req.body.authKey : null,
        params: req.body.params ? req.body.params : null
    }

    //Make sure the passed script exists
    if (!fs.existsSync(constants.scriptsPath + executionInfo.scriptName)) {
        logger.log("info", "Did not find script: " + constants.scriptsPath + executionInfo.scriptName);
        return returnCode(400, res, executionInfo, "Script does not exist");
    }

    //Auth check
    if (!checkAuth(res, req, executionInfo.authKey)) return;

    var options = [constants.scriptsPath + executionInfo.scriptName, executionInfo.params.map(param => `"${param}"`).join(" ")];
    if(executionInfo.asRoot){
        options = [
            "Start-Process powershell -ArgumentList '-File " + constants.scriptsPath + executionInfo.scriptName + " " + executionInfo.params.map(param => `\"${param}\"`) + "' -Verb RunAs"
        ]
    }

    logger.log('info', options)

    child = spawn("powershell.exe", options);
    child.stdout.on("data", function (data) {
        logger.log('info', "Powershell Data: " + data);
        returnCode(200, res, executionInfo, "Script executed with no errors.");
    });
    child.stderr.on("data", function (data) {
        logger.log('error', "Powershell Errors: " + data);
        returnCode(500, res, executionInfo, "Script executed with errors, see logs for more details.");
    });
    child.on("exit", function () {
        logger.log('info', "Powershell Script finished");
        returnCode(200, res, executionInfo, "Script executed with no errors.");
    });
    child.stdin.end();
});

module.exports = router;