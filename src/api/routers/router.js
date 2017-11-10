'use strict';
console.log('Entering router.js...');
var config = require('../../config.js');
var wait = require('wait.for');
var apiInquiryFunctionsController = require('../controllers/apiInquiryFunctionsController.js');


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
    if (req.body.result.metadata.intentName == "TrackTransfer") {

        //console.log("inside router app.post: TrackTransfer..." + req.body.result.metadata.intentName);
        wait.launchFiber(apiInquiryFunctionsController.handleTrackTransferPost, req, res); //handle in a fiber, keep node spinning
        //handleTrackTransferPost(req, res);
    }
    if(req.body.result.metadata.intentName.includes("FeeEstimate-MoneyTransfer-Channel")){
        console.log("Entering router FeeEstimate-MoneyTransfer-Channel------>");
    	wait.launchFiber(apiInquiryFunctionsController.apiHandlerForFeeInquiry, req, res);
        console.log("Exiting router FeeEstimate-MoneyTransfer-Channel------>");
    }
    if(req.body.result.metadata.intentName == "AgentLocator"){
        console.log("Entering router AgentLocator------>");
        wait.launchFiber(apiInquiryFunctionsController.apiHandlerForAgentLocator, req, res);
        console.log("Exiting router AgentLocator-GetCity------>");
    }
    if(req.body.result.metadata.intentName.includes("AgentLocator-GetCity")){
        console.log("Entering router AgentLocator-GetCity------>");
        wait.launchFiber(apiInquiryFunctionsController.apiHandlerForAgentLocatorGetCity, req, res);
        console.log("Exiting router AgentLocator-GetCity------>");
    }
    if(req.body.result.metadata.intentName.includes("DefaultWelcomeIntent")){
        console.log("Entering router DefaultWelcomeIntent------>");
        wait.launchFiber(apiInquiryFunctionsController.apiDefaultWelcomeIntent, req, res);
        console.log("Exiting router DefaultWelcomeIntent------>");
    }
    if(req.body.result.metadata.intentName == "FeeEstimate"){
        console.log("Entering router FeeEstimate------>");
        wait.launchFiber(apiInquiryFunctionsController.apiHandlerForFeeEstimate, req, res);
        console.log("Exiting router FeeEstimate------>");
    }
    if(req.body.result.metadata.intentName == "FeeEstimate-BillPay"){
        console.log("Entering router FeeEstimate-BillPay------>");
        wait.launchFiber(apiInquiryFunctionsController.apiHandlerForFeeEstimateBillPay, req, res);
        console.log("Exiting router FeeEstimate-BillPay------>");
    }
    if(req.body.result.metadata.intentName == "FeeEstimate-MoneyTransfer-GetCountry"){
        console.log("Entering router FeeEstimate-MoneyTransfer-GetCountry------>");
        wait.launchFiber(apiInquiryFunctionsController.apiHandlerForFeeEstimateMoneyTransferGetCountry, req, res);
        console.log("Exiting router FeeEstimate-MoneyTransfer-GetCountry------>");
    }
    if(req.body.result.metadata.intentName == "FeeEstimate-MoneyTransfer-GetZipCode"){
        console.log("Entering router FeeEstimate-MoneyTransfer-GetZipCode------>");
        wait.launchFiber(apiInquiryFunctionsController.apiHandlerForFeeEstimateMoneyTransferGetZipCode, req, res);
        console.log("Exiting router FeeEstimate-MoneyTransfer-GetZipCode------>");
    }
    if(req.body.result.metadata.intentName == "FeeEstimate-MoneyTransfer-GetAmount"){
        console.log("Entering router FeeEstimate-MoneyTransfer-GetAmount------>");
        wait.launchFiber(apiInquiryFunctionsController.apiHandlerForFeeEstimateMoneyTransferGetAmount, req, res);
        console.log("Exiting router FeeEstimate-MoneyTransfer-GetAmount------>");
    }
}); 

}

module.exports = appRouter;
console.log('Exiting router.js...');
