'use strict';
console.log('Entering router.js...');
var config = require('../../config.js');
var wait = require('wait.for');
var apiHandler = require('../controllers/apiHandler.js');


var appRouter = function(app) {

// Fetching BE data or response type requests

app.post('/hook', function(req, res) {
    console.log("inside router app.post: "+ JSON.stringify(req.result));

    if(req.body.result.metadata.intentName.includes("welcome-intent")){
        console.log("Entering router DefaultWelcomeIntent------>");
        wait.launchFiber(apiHandler.apiDefaultWelcomeIntent, req, res);
        console.log("Exiting router DefaultWelcomeIntent------>");
    }
    
    if(req.body.result.metadata.intentName.includes("smalltalk")){
        console.log("Entering router AgentLocator-GetCity------>");
        wait.launchFiber(apiHandler.apiHandlerForSmallTalk, req, res);
        console.log("Exiting router AgentLocator-GetCity------>");
    }
    if(req.body.result.metadata.intentName == "report-atm-incident"){
        console.log("Entering router report-atm-incident------>");
        wait.launchFiber(apiHandler.apiHandlerForReportAtmIncident, req, res);
        console.log("Exiting router report-atm-incident------>");
    }
    if(req.body.result.metadata.intentName == "report-atm-incident-get-atmid"){
        console.log("Entering router report-atm-incident-get-atmid------>");
        wait.launchFiber(apiHandler.apiHandlerForReportAtmIncidentGetAtmId, req, res);
        console.log("Exiting router report-atm-incident-get-atmid------>");
    }
    if(req.body.result.metadata.intentName == "report-atm-incident-get-name"){
        console.log("Entering router report-atm-incident-get-name------>");
        wait.launchFiber(apiHandler.apiHandlerForReportAtmIncidentGetName, req, res);
        console.log("Exiting router report-atm-incident-get-name------>");
    }
    if(req.body.result.metadata.intentName == "report-atm-incident-get-contact"){
        console.log("Entering router report-atm-incident-get-contact------>");
        wait.launchFiber(apiHandler.apiHandlerForReportAtmIncidentGetContact, req, res);
        console.log("Exiting router report-atm-incident-get-contact------>");
    }
    if(req.body.result.metadata.intentName == "report-atm-incident-get-issue"){
        console.log("Entering router report-atm-incident-get-issue------>");
        wait.launchFiber(apiHandler.apiHandlerForReportAtmIncidentGetIssue, req, res);
        console.log("Exiting router report-atm-incident-get-issue------>");
    }
    if(req.body.result.metadata.intentName == "track-atm-incident"){
        console.log("Entering router track-atm-incident------>");
        wait.launchFiber(apiHandler.apiHandlerForTrackAtmIncident, req, res);
        console.log("Exiting router track-atm-incident------>");
    }
    if(req.body.result.metadata.intentName == "track-atm-incident-get-incid"){
        console.log("Entering router track-atm-incident-get-incid------>");
        wait.launchFiber(apiHandler.apiHandlerForTrackAtmIncidentGetIncId, req, res);
        console.log("Exiting router track-atm-incident-get-incid------>");
    }
    if(req.body.result.metadata.intentName == "report-atm-incident-get-atmid-loop"){
        console.log("Entering router report-atm-incident-get-atmid-loop------>");
        wait.launchFiber(apiHandler.apiHandlerForReportAtmIncidentGetAtmIdLoop, req, res);
        console.log("Exiting router report-atm-incident-get-atmid-loop------>");
    }
}); 

}
module.exports = appRouter;
console.log('Exiting router.js...');
