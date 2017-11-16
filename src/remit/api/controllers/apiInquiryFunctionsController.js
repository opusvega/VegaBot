'use strict';

console.log('Entering apiInquiryFunctionsController...before require apihandler');
//******************Remikttance usecase**********************
// var apihandler = require('../apihandler.js');
var statusTrackTransfer = require('../../responsestubs/statusTrackTransferStubResponse.js');
var feeInquiry = require('../../responsestubs/FeeInquiryStubResponse.js');
var currency = require('../../../reflookup/country-currency-code-mapping.js');
var wait = require('wait.for');
var express = require('express');
var bodyParser = require('body-parser');
var conversationHistory = require('../../../history/LogHandler.js');
var agentLocator_GetCity = require('../../responsestubs/AgentLocator-GetCityStubResponse.js');
var stubResponse = require("../../responsestubs/StubResponse.js")

var restService = express();
restService.use(bodyParser.json());
var statusTrackTransfer = statusTrackTransfer.sampleResponseForMTCN;
var feeInquiry = feeInquiry.FeeInquiryStubResponse;
var agentLocator_GetCity = agentLocator_GetCity.agentLocator_GetCity;
var welcomeResponse = stubResponse.WelcomeStubResponse;
var agentLocator = stubResponse.AgentLocator;
var feeEstimate = stubResponse.FeeEstimate;
var feeEstimateBillPay = stubResponse.FeeEstimateBillPay;
var feeEstimateMoneyTransferGetCountry = stubResponse.FeeEstimateMoneyTransferGetCountry;
var feeEstimateMoneyTransferGetZipCode = stubResponse.FeeEstimateMoneyTransferGetZipCode;
var feeEstimateMoneyTransferGetAmount = stubResponse.FeeEstimateMoneyTransferGetAmount;

console.log('Inside apiInquiryFunctionsController...');
console.log("Printing statusTrackTransfer1: " + statusTrackTransfer);
//var restService = express();
//restService.use(bodyParser.json());

console.log('Inside apiInquiryFunctionsController... after restService.use');

function logConversationHistory(req, speech) {

    console.log("Entering logConversationHistory ---->" + req);
    console.log("Printing req.body.metadata.intentName in logConversationHistory : " + req.body.result.metadata.intentName);
    console.log(" speech : " + speech);

    var logResponse = "";

    var usersaysValue = req.body.result.resolvedQuery;
        console.log("usersaysValue in logConversationHistory : " + usersaysValue);
    var responseValue = speech;
    var intentValue = req.body.result.metadata.intentName;
        console.log("Printing req.body.metadata.intentName in logConversationHistory : " + req.body.result.metadata.intentName);
    var timestampValue = req.body.timestamp;

    var historyLogger = {
            usersays : usersaysValue,
            response : responseValue,
            intent : intentValue,
            timestamp : timestampValue
        }
        conversationHistory.MongoInsert(historyLogger);

        logResponse = "Your conversational history will be sent to your registered mobile number";
    console.log("Exiting logConversationHistory ---->" + req);
        return logResponse;
}
// in  a Fiber for MTCN
function handleTrackTransferPost(req, res) {
    console.log("Inside handleTrackTransferPost function...");
    try {
        var speech = 'empty speech';
//        var returnJsonObj = apihandler.apiHandlerForTrackTransfer(req,res);
        console.log("Printing statusTrackTransfer2: " + statusTrackTransfer);
        var returnJsonObj = statusTrackTransfer;
        JSON.stringify(returnJsonObj);

        var speech = returnJsonObj.speech;

        console.log("before calling logConversationHistory ...");

        console.log("Printing req : " + req.body.result.metadata.intentName);

        var mongoResponse = logConversationHistory(req, speech);

        return res.json(returnJsonObj);
    } catch (err) {
        console.error("Can't process request", err);
        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
}

//AgentLocator-GetCity
function apiHandlerForAgentLocatorGetCity(req, res) {

    var speech = 'empty speech';
    var speechAudio;
    var priceData;
    var requestBody = req.body;
    const paramObj = {};
    console.log(JSON.stringify(requestBody.result));
    if(requestBody.result.parameters.latitude && requestBody.result.parameters.longitude){
        paramObj.CityName = 'you';
    }
    else if(requestBody.result.parameters.zipCode){
        paramObj.CityName = requestBody.result.parameters.zipCode;
    }
    else if(requestBody.result.parameters.lat1 && requestBody.result.parameters.lon1){
        paramObj.CityName = 'you';
    }
    else{
        paramObj.CityName = requestBody.result.parameters.CityName[0].Dest;
    }
    
    
    console.log('Creating agentList-------->'+JSON.stringify(agentLocator_GetCity));
    
    var agentList = agentLocator_GetCity.messages[0].payload.facebook.attachment.payload.elements[0].title+'\n'+
                    agentLocator_GetCity.messages[0].payload.facebook.attachment.payload.elements[0].subtitle+'\n'+
                    agentLocator_GetCity.messages[0].payload.facebook.attachment.payload.elements[1].title+'\n'+
                    agentLocator_GetCity.messages[0].payload.facebook.attachment.payload.elements[1].subtitle+'\n';
    speech = 'Agents near '+paramObj.CityName+ ' are \n'+agentList;
    
    console.log('Final agent speech---->'+speech);

    agentLocator_GetCity.speech = speech;
    agentLocator_GetCity.displayText = speech;
    agentLocator_GetCity.data.google.rich_response.items[0].simpleResponse.textToSpeech = agentLocator_GetCity.data.google.rich_response.items[0].simpleResponse.displayText = speech;
    agentLocator_GetCity.messages[1].speech = speech;
    console.log('Final agentLocator_GetCity--->'+JSON.stringify(agentLocator_GetCity));

    var returnJsonObj = agentLocator_GetCity;
    
    console.log('Final returnJsonObj--->'+JSON.stringify(returnJsonObj));
    
    //agentLocator_GetCity.speech = speech;
    //agentLocator_GetCity.displayText = speech;
    //agentLocator_GetCity.messages[4].speech = speech;
    //agentLocator_GetCity.data.google.rich_response.items[0].simpleResponse.textToSpeech = agentLocator_GetCity.data.google.rich_response.items[0].simpleResponse.displayText = speech;

    JSON.stringify(returnJsonObj);
    //var speech = returnJsonObj.speech;
    console.log("before calling logConversationHistory ... speech : " + speech);

    console.log("Printing req : " + req.body.result.metadata.intentName);
    var mongoResponse = logConversationHistory(req, speech);

    return res.json(returnJsonObj);

    
}


//Fee Inquiry
function apiHandlerForFeeInquiry(req, res) {

    var speech = 'empty speech';
    var speechAudio;
    var priceData;

    var requestBody = req.body;

    const paramObj = {};
            paramObj.TO_COUNTRY = requestBody.result.parameters.destCountry["alpha-2"];
            paramObj.FROM_ZIP_CODE = requestBody.result.parameters.zipCode;
            paramObj.AMOUNT = requestBody.result.parameters.amount;
            paramObj.TO_COUNTRY_CURRENCY = currency.countryCurrency[paramObj.TO_COUNTRY];
            paramObj.CHANNEL_TYPE = requestBody.result.parameters.channelType;


    speech = 'Total Fee Estimate to transfer $' + paramObj.AMOUNT +
                    ' from zip code ' + paramObj.FROM_ZIP_CODE + ' to ' +
                    requestBody.result.parameters.destCountry.name + ' is $20 \n';

    feeInquiry.speech = speech;
    feeInquiry.displayText = speech;
    feeInquiry.messages[4].speech = speech;
    feeInquiry.data.google.rich_response.items[0].simpleResponse.textToSpeech = feeInquiry.data.google.rich_response.items[0].simpleResponse.displayText = speech;

    var intentValue = requestBody.result.metadata.intentName;
    if(intentValue == 'FeeEstimate-MoneyTransfer-Channel-AGT'){
        feeInquiry.messages[3].speech = "\nDo want to see nearby agents? (Yes/No)";
    }
    else{
        feeInquiry.messages[3].speech = "";
    }
    var returnJsonObj = feeInquiry;

    JSON.stringify(returnJsonObj);

    var speech = returnJsonObj.speech;

    console.log("before calling logConversationHistory ... speech : " + speech);

    console.log("Printing req : " + req.body.result.metadata.intentName);
    var mongoResponse = logConversationHistory(req, speech);
    
    return res.json(returnJsonObj);

    
}

//Welcome Intent
function apiDefaultWelcomeIntent(req,res){
    console.log("Entering apiDefaultWelcomeIntent ------>")
    var returnJsonObj = welcomeResponse;
    JSON.stringify(returnJsonObj);
    var speech = returnJsonObj.speech;
    console.log("Exiting apiDefaultWelcomeIntent ------>")
    var mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

//Agent Locator
function apiHandlerForAgentLocator(req,res){
    console.log("Entering apiHandlerForAgentLocator ------>")
    var returnJsonObj = agentLocator;
    JSON.stringify(returnJsonObj);
    var speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForAgentLocator ------>")
    var mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

//FeeEstimate
function apiHandlerForFeeEstimate(req,res){
    console.log("Entering apiHandlerForFeeEstimate ------>")
    var returnJsonObj = feeEstimate;
    JSON.stringify(returnJsonObj);
    var speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForFeeEstimate ------>")
    var mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

//FeeEstimate-BillPay
function apiHandlerForFeeEstimateBillPay(req,res){
    console.log("Entering apiHandlerForFeeEstimateBillPay ------>")
    var returnJsonObj = feeEstimateBillPay;
    JSON.stringify(returnJsonObj);
    var speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForFeeEstimateBillPay ------>")
    var mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

//FeeEstimate-MoneyTransfer-GetCountry
function apiHandlerForFeeEstimateMoneyTransferGetCountry(req,res){
    console.log("Entering apiHandlerForFeeEstimateMoneyTransferGetCountry ------>")
    var returnJsonObj = feeEstimateMoneyTransferGetCountry;
    returnJsonObj.speech = "From which zip code do you want to send the money to "+req.body.result.parameters.destCountry.name+"?";
    returnJsonObj.displayText = "From which zip code do you want to send the money to "+req.body.result.parameters.destCountry.name+"?";
    returnJsonObj.data.facebook[0].text = "From which zip code do you want to send the money to "+req.body.result.parameters.destCountry.name+"?";
    JSON.stringify(returnJsonObj);
    var speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForFeeEstimateMoneyTransferGetCountry ------>")
    var mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

//FeeEstimate-MoneyTransfer-GetZipCode
function apiHandlerForFeeEstimateMoneyTransferGetZipCode(req,res){
    console.log("Entering apiHandlerForFeeEstimateMoneyTransferGetZipCode ------>")
    var returnJsonObj = feeEstimateMoneyTransferGetZipCode;
    JSON.stringify(returnJsonObj);
    var speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForFeeEstimateMoneyTransferGetZipCode ------>")
    var mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

//FeeEstimate-MoneyTransfer-GetAmount
function apiHandlerForFeeEstimateMoneyTransferGetAmount(req,res){
    console.log("Entering apiHandlerForFeeEstimateMoneyTransferGetAmount ------>")
    var returnJsonObj = feeEstimateMoneyTransferGetAmount;
    returnJsonObj.speech = "How would you like to transfer" + 
                            req.body.result.parameters.amount.currency +
                            " " + 
                            req.body.result.parameters.amount.amount + 
                            " You can say: \n Send online \n Send by phone \n Send in person \n Send by mobile app";
    returnJsonObj.displayText = "How would you like to transfer" + 
                            req.body.result.parameters.amount.currency +
                            " " + 
                            req.body.result.parameters.amount.amount + 
                            " You can say: \n Send online \n Send by phone \n Send in person \n Send by mobile app";
    JSON.stringify(returnJsonObj);
    var speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForFeeEstimateMoneyTransferGetAmount ------>")
    var mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}


exports.apiHandlerForFeeEstimateMoneyTransferGetAmount = apiHandlerForFeeEstimateMoneyTransferGetAmount;
exports.apiHandlerForFeeEstimateMoneyTransferGetZipCode = apiHandlerForFeeEstimateMoneyTransferGetZipCode;
exports.apiHandlerForFeeEstimateMoneyTransferGetCountry = apiHandlerForFeeEstimateMoneyTransferGetCountry;
exports.apiHandlerForFeeEstimateBillPay = apiHandlerForFeeEstimateBillPay;
exports.apiHandlerForFeeEstimate = apiHandlerForFeeEstimate;
exports.handleTrackTransferPost = handleTrackTransferPost;
exports.apiHandlerForFeeInquiry = apiHandlerForFeeInquiry;
exports.apiHandlerForAgentLocatorGetCity = apiHandlerForAgentLocatorGetCity;
exports.apiDefaultWelcomeIntent = apiDefaultWelcomeIntent;
exports.apiHandlerForAgentLocator = apiHandlerForAgentLocator;
