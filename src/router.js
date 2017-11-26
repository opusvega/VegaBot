'use strict';
console.log('Entering router.js...');
var config = require('./config.js');
var apiRemittanceFunctionController = require('./remit/api/controllers/remitApiHandler.js');
var apiAtmFunctionController = require('./atm/api/controllers/atmApiHandler.js');
var apiBankFunctionController = require('./bank/api/controllers/bankApiHandler.js');
var fs = require('fs');


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

    

    app.post('/hook', async function(req, res) {
        console.log("inside router app.post: "+ JSON.stringify(req.result));
        
        //All remittance cases
        if (req.body.result.metadata.intentName == "TrackTransfer") {

            console.log("inside router app.post: TrackTransfer..." + req.body.result.metadata.intentName);
            await apiRemittanceFunctionController.handleTrackTransferPost(req, res); //handle in a fiber, keep node spinning
            //handleTrackTransferPost(req, res);
            console.log("Exiting TrackTransfer---->");
        }
        if(req.body.result.metadata.intentName.includes("FeeEstimate-MoneyTransfer-Channel")){
            console.log("Entering router FeeEstimate-MoneyTransfer-Channel------>");
        	await apiRemittanceFunctionController.apiHandlerForFeeInquiry(req, res);
            console.log("Exiting router FeeEstimate-MoneyTransfer-Channel------>");
        }
        if(req.body.result.metadata.intentName == "AgentLocator"){
            console.log("Entering router AgentLocator------>");
            await apiRemittanceFunctionController.apiHandlerForAgentLocator(req, res);
            console.log("Exiting router AgentLocator-GetCity------>");
        }
        if(req.body.result.metadata.intentName.includes("AgentLocator-GetCity")){
            console.log("Entering router AgentLocator-GetCity------>");
            await apiRemittanceFunctionController.apiHandlerForAgentLocatorGetCity(req, res);
            console.log("Exiting router AgentLocator-GetCity------>");
        }
        if(req.body.result.metadata.intentName.includes("DefaultWelcomeIntent")){
            console.log("Entering router DefaultWelcomeIntent------>");
            await apiRemittanceFunctionController.apiDefaultWelcomeIntent(req, res);
            console.log("Exiting router DefaultWelcomeIntent------>");
        }
        if(req.body.result.metadata.intentName == "FeeEstimate"){
            console.log("Entering router FeeEstimate------>");
            await apiRemittanceFunctionController.apiHandlerForFeeEstimate(req, res);
            console.log("Exiting router FeeEstimate------>");
        }
        if(req.body.result.metadata.intentName == "FeeEstimate-BillPay"){
            console.log("Entering router FeeEstimate-BillPay------>");
            await apiRemittanceFunctionController.apiHandlerForFeeEstimateBillPay(req, res);
            console.log("Exiting router FeeEstimate-BillPay------>");
        }
        if(req.body.result.metadata.intentName == "FeeEstimate-MoneyTransfer-GetCountry"){
            console.log("Entering router FeeEstimate-MoneyTransfer-GetCountry------>");
            await apiRemittanceFunctionController.apiHandlerForFeeEstimateMoneyTransferGetCountry(req, res);
            console.log("Exiting router FeeEstimate-MoneyTransfer-GetCountry------>");
        }
        if(req.body.result.metadata.intentName == "FeeEstimate-MoneyTransfer-GetZipCode"){
            console.log("Entering router FeeEstimate-MoneyTransfer-GetZipCode------>");
            await apiRemittanceFunctionController.apiHandlerForFeeEstimateMoneyTransferGetZipCode(req, res);
            console.log("Exiting router FeeEstimate-MoneyTransfer-GetZipCode------>");
        }
        if(req.body.result.metadata.intentName == "FeeEstimate-MoneyTransfer-GetAmount"){
            console.log("Entering router FeeEstimate-MoneyTransfer-GetAmount------>");
            await apiRemittanceFunctionController.apiHandlerForFeeEstimateMoneyTransferGetAmount(req, res);
            console.log("Exiting router FeeEstimate-MoneyTransfer-GetAmount------>");
        }

        //All ATM cases
        if(req.body.result.metadata.intentName.includes("welcome-intent")){
            console.log("Entering router DefaultWelcomeIntent------>");
            await apiAtmFunctionController.apiDefaultWelcomeIntent(req, res);
            console.log("Exiting router DefaultWelcomeIntent------>");
        }
        if(req.body.result.metadata.intentName.includes("smalltalk")){
            console.log("Entering router smalltalk------>");
            await apiAtmFunctionController.apiHandlerForSmallTalk(req, res);
            console.log("Exiting router smalltalk------>");
        }
        if(req.body.result.metadata.intentName == "report-atm-incident"){
            console.log("Entering router report-atm-incident------>");
            await apiAtmFunctionController.apiHandlerForReportAtmIncident(req, res);
            console.log("Exiting router report-atm-incident------>");
        }
        if(req.body.result.metadata.intentName == "report-atm-incident-get-atmid"){
            console.log("Entering router report-atm-incident-get-atmid------>");
            await apiAtmFunctionController.apiHandlerForReportAtmIncidentGetAtmId(req, res);
            console.log("Exiting router report-atm-incident-get-atmid------>");
        }
        if(req.body.result.metadata.intentName == "report-atm-incident-get-name"){
            console.log("Entering router report-atm-incident-get-name------>");
            await apiAtmFunctionController.apiHandlerForReportAtmIncidentGetName(req, res);
            console.log("Exiting router report-atm-incident-get-name------>");
        }
        if(req.body.result.metadata.intentName == "report-atm-incident-get-contact"){
            console.log("Entering router report-atm-incident-get-contact------>");
            await apiAtmFunctionController.apiHandlerForReportAtmIncidentGetContact(req, res);
            console.log("Exiting router report-atm-incident-get-contact------>");
        }
        if(req.body.result.metadata.intentName == "report-atm-incident-get-issue"){
            console.log("Entering router report-atm-incident-get-issue------>");
            await apiAtmFunctionController.apiHandlerForReportAtmIncidentGetIssue(req, res);
            console.log("Exiting router report-atm-incident-get-issue------>");
        }
        if(req.body.result.metadata.intentName == "track-atm-incident"){
            console.log("Entering router track-atm-incident------>");
            await apiAtmFunctionController.apiHandlerForTrackAtmIncident(req, res);
            console.log("Exiting router track-atm-incident------>");
        }
        if(req.body.result.metadata.intentName == "track-atm-incident-get-incid"){
            console.log("Entering router track-atm-incident-get-incid------>");
            await apiAtmFunctionController.apiHandlerForTrackAtmIncidentGetIncId(req, res);
            console.log("Exiting router track-atm-incident-get-incid------>");
        }
        if(req.body.result.metadata.intentName == "report-atm-incident-get-atmid-loop"){
            console.log("Entering router report-atm-incident-get-atmid-loop------>");
            await apiAtmFunctionController.apiHandlerForReportAtmIncidentGetAtmIdLoop(req, res);
            console.log("Exiting router report-atm-incident-get-atmid-loop------>");
        }

        //Bill payment use cases
        if(req.body.result.metadata.intentName == "bill-init-intent"){
        console.log("Entering router bill-init-intent------>");
        await apiBankFunctionController.apiHandlerForBillInit(req, res);
        console.log("Exiting router bill-init-intent------>");
        }
        if(req.body.result.metadata.intentName == "gas-bill-init-pay"){
            console.log("Entering router gas-bill-init-pay------>");
            await apiBankFunctionController.apiHandlerForGasBillInit(req, res);
            console.log("Exiting router gas-bill-init-pay------>");
        }
        if(req.body.result.metadata.intentName == "light-bill-init-pay"){
            console.log("Entering router light-bill-init-pay------>");
            await apiBankFunctionController.apiHandlerForLightBillInit(req, res);
            console.log("Exiting router light-bill-init-pay------>");
        }
        if(req.body.result.metadata.intentName == "phone-bill-init-pay"){
            console.log("Entering router phone-bill-init-pay------>");
            await apiBankFunctionController.apiHandlerForPhoneBillInit(req, res);
            console.log("Exiting router phone-bill-init-pay------>");
        }
        if(req.body.result.metadata.intentName == "add-biller"){
            console.log("Entering router add-biller------>");
            await apiBankFunctionController.apiHandlerForAddBiller(req, res);
            console.log("Exiting router add-biller------>");
        }
        if(req.body.result.metadata.intentName == "add-biller-yes"){
            console.log("Entering add-biller-yes------>");
            await apiBankFunctionController.apiHandlerForAddBillerYes(req, res);
            console.log("Exiting add-biller-yes------>");
        }
        if(req.body.result.metadata.intentName == "add-biller-no"){
            console.log("Entering add-biller-no------>");
            await apiBankFunctionController.apiHandlerForAddBillerNo(req, res);
            console.log("Exiting add-biller-no------>");
        }
        if(req.body.result.metadata.intentName == "select-biller-pay-bill"){
            console.log("Entering select-biller-pay-bill------>");
            await apiBankFunctionController.apiHandlerForSelectBillerPayBill(req, res);
            console.log("Exiting select-biller-pay-bill------>");
        }

        
    }); 

}

module.exports = appRouter;
console.log('Exiting router.js...');
