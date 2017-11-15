'use strict';
console.log('Entering router.js...');
var config = require('./config.js');
var wait = require('wait.for');
var apiRemittanceFunctionController = require('./remit/api/controllers/apiInquiryFunctionsController.js');
var apiAtmFunctionController = require('./atm/api/controllers/apiHandler.js');


var appRouter = function(app) {

// Configuration and Property Lookup type requests
app.get("/PaymentType", function(req, res) {
    //res.send("Hello World");
    var PaymentType = config.PaymentType;
	res.send(PaymentType);
});

app.get("/RemitProducts", function(req, res) {
	 var RemitProducts = config.RemitProducts;
	 res.send(RemitProducts);
});
	
app.get("/DaysOfWeek", function(req, res) {
	 var DaysOfWeek = config.DaysOfWeek;
	 res.send(DaysOfWeek);
});

app.get("/ErrorMessages", function(req, res) {
	 var ErrorMessages = config.ErrorMessages;
	 res.send(ErrorMessages);
});

// Fetching BE data or response type requests

app.post('/hook', function(req, res) {
    console.log("inside router app.post: "+ JSON.stringify(req.result));
    
    //All remittance cases
    if (req.body.result.metadata.intentName == "TrackTransfer") {

        //console.log("inside router app.post: TrackTransfer..." + req.body.result.metadata.intentName);
        wait.launchFiber(apiRemittanceFunctionController.handleTrackTransferPost, req, res); //handle in a fiber, keep node spinning
        //handleTrackTransferPost(req, res);
    }
    if(req.body.result.metadata.intentName.includes("FeeEstimate-MoneyTransfer-Channel")){
        console.log("Entering router FeeEstimate-MoneyTransfer-Channel------>");
    	wait.launchFiber(apiRemittanceFunctionController.apiHandlerForFeeInquiry, req, res);
        console.log("Exiting router FeeEstimate-MoneyTransfer-Channel------>");
    }
    if(req.body.result.metadata.intentName == "AgentLocator"){
        console.log("Entering router AgentLocator------>");
        wait.launchFiber(apiRemittanceFunctionController.apiHandlerForAgentLocator, req, res);
        console.log("Exiting router AgentLocator-GetCity------>");
    }
    if(req.body.result.metadata.intentName.includes("AgentLocator-GetCity")){
        console.log("Entering router AgentLocator-GetCity------>");
        wait.launchFiber(apiRemittanceFunctionController.apiHandlerForAgentLocatorGetCity, req, res);
        console.log("Exiting router AgentLocator-GetCity------>");
    }
    if(req.body.result.metadata.intentName.includes("DefaultWelcomeIntent")){
        console.log("Entering router DefaultWelcomeIntent------>");
        wait.launchFiber(apiRemittanceFunctionController.apiDefaultWelcomeIntent, req, res);
        console.log("Exiting router DefaultWelcomeIntent------>");
    }
    if(req.body.result.metadata.intentName == "FeeEstimate"){
        console.log("Entering router FeeEstimate------>");
        wait.launchFiber(apiRemittanceFunctionController.apiHandlerForFeeEstimate, req, res);
        console.log("Exiting router FeeEstimate------>");
    }
    if(req.body.result.metadata.intentName == "FeeEstimate-BillPay"){
        console.log("Entering router FeeEstimate-BillPay------>");
        wait.launchFiber(apiRemittanceFunctionController.apiHandlerForFeeEstimateBillPay, req, res);
        console.log("Exiting router FeeEstimate-BillPay------>");
    }
    if(req.body.result.metadata.intentName == "FeeEstimate-MoneyTransfer-GetCountry"){
        console.log("Entering router FeeEstimate-MoneyTransfer-GetCountry------>");
        wait.launchFiber(apiRemittanceFunctionController.apiHandlerForFeeEstimateMoneyTransferGetCountry, req, res);
        console.log("Exiting router FeeEstimate-MoneyTransfer-GetCountry------>");
    }
    if(req.body.result.metadata.intentName == "FeeEstimate-MoneyTransfer-GetZipCode"){
        console.log("Entering router FeeEstimate-MoneyTransfer-GetZipCode------>");
        wait.launchFiber(apiRemittanceFunctionController.apiHandlerForFeeEstimateMoneyTransferGetZipCode, req, res);
        console.log("Exiting router FeeEstimate-MoneyTransfer-GetZipCode------>");
    }
    if(req.body.result.metadata.intentName == "FeeEstimate-MoneyTransfer-GetAmount"){
        console.log("Entering router FeeEstimate-MoneyTransfer-GetAmount------>");
        wait.launchFiber(apiRemittanceFunctionController.apiHandlerForFeeEstimateMoneyTransferGetAmount, req, res);
        console.log("Exiting router FeeEstimate-MoneyTransfer-GetAmount------>");
    }

    //All ATM cases
    if(req.body.result.metadata.intentName.includes("welcome-intent")){
        console.log("Entering router DefaultWelcomeIntent------>");
        wait.launchFiber(apiAtmFunctionController.apiDefaultWelcomeIntent, req, res);
        console.log("Exiting router DefaultWelcomeIntent------>");
    }
    if(req.body.result.metadata.intentName.includes("smalltalk")){
        console.log("Entering router AgentLocator-GetCity------>");
        wait.launchFiber(apiHandler.apiHandlerForSmallTalk, req, res);
        console.log("Exiting router AgentLocator-GetCity------>");
    }
    if(req.body.result.metadata.intentName == "report-atm-incident"){
        console.log("Entering router report-atm-incident------>");
        wait.launchFiber(apiAtmFunctionController.apiHandlerForReportAtmIncident, req, res);
        console.log("Exiting router report-atm-incident------>");
    }
    if(req.body.result.metadata.intentName == "report-atm-incident-get-atmid"){
        console.log("Entering router report-atm-incident-get-atmid------>");
        wait.launchFiber(apiAtmFunctionController.apiHandlerForReportAtmIncidentGetAtmId, req, res);
        console.log("Exiting router report-atm-incident-get-atmid------>");
    }
    if(req.body.result.metadata.intentName == "report-atm-incident-get-name"){
        console.log("Entering router report-atm-incident-get-name------>");
        wait.launchFiber(apiAtmFunctionController.apiHandlerForReportAtmIncidentGetName, req, res);
        console.log("Exiting router report-atm-incident-get-name------>");
    }
    if(req.body.result.metadata.intentName == "report-atm-incident-get-contact"){
        console.log("Entering router report-atm-incident-get-contact------>");
        wait.launchFiber(apiAtmFunctionController.apiHandlerForReportAtmIncidentGetContact, req, res);
        console.log("Exiting router report-atm-incident-get-contact------>");
    }
    if(req.body.result.metadata.intentName == "report-atm-incident-get-issue"){
        console.log("Entering router report-atm-incident-get-issue------>");
        wait.launchFiber(apiAtmFunctionController.apiHandlerForReportAtmIncidentGetIssue, req, res);
        console.log("Exiting router report-atm-incident-get-issue------>");
    }
    if(req.body.result.metadata.intentName == "track-atm-incident"){
        console.log("Entering router track-atm-incident------>");
        wait.launchFiber(apiAtmFunctionController.apiHandlerForTrackAtmIncident, req, res);
        console.log("Exiting router track-atm-incident------>");
    }
    if(req.body.result.metadata.intentName == "track-atm-incident-get-incid"){
        console.log("Entering router track-atm-incident-get-incid------>");
        wait.launchFiber(apiAtmFunctionController.apiHandlerForTrackAtmIncidentGetIncId, req, res);
        console.log("Exiting router track-atm-incident-get-incid------>");
    }
    if(req.body.result.metadata.intentName == "report-atm-incident-get-atmid-loop"){
        console.log("Entering router report-atm-incident-get-atmid-loop------>");
        wait.launchFiber(apiAtmFunctionController.apiHandlerForReportAtmIncidentGetAtmIdLoop, req, res);
        console.log("Exiting router report-atm-incident-get-atmid-loop------>");
    }
}); 

}

module.exports = appRouter;
console.log('Exiting router.js...');
