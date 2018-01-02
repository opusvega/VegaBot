'use strict';

console.log('Entering apiInquiryFunctionsController...before require apihandler');
//******************Remikttance usecase**********************
// let apihandler = require('../apihandler.js');
let statusTrackTransferNew = require('../../responsestubs/statusTrackTransferStubResponse.js');
let feeInquiryNew = require('../../responsestubs/FeeInquiryStubResponse.js');
let currency = require('../../../reflookup/country-currency-code-mapping.js');
let express = require('express');
let bodyParser = require('body-parser');
let conversationHistory = require('../../../history/LogHandler.js');
let agentLocator_GetCityNew = require('../../responsestubs/AgentLocator-GetCityStubResponse.js');
let stubResponse = require("../../responsestubs/StubResponse.js")
let mysqlFunctions = require("../../../mysql-functions/mysqlFunctions.js");

let restService = express();
restService.use(bodyParser.json());
let statusTrackTransfer = statusTrackTransferNew.sampleResponseForMTCN;
let feeInquiry = feeInquiryNew.FeeInquiryStubResponse;
let agentLocator_GetCity = agentLocator_GetCityNew.agentLocator_GetCity;
//let welcomeResponse = stubResponse.WelcomeStubResponse;
let agentLocator = stubResponse.AgentLocator;
let feeEstimate = stubResponse.FeeEstimate;
let feeEstimateBillPay = stubResponse.FeeEstimateBillPay;
let feeEstimateMoneyTransferGetCountry = stubResponse.FeeEstimateMoneyTransferGetCountry;
let feeEstimateMoneyTransferGetZipCode = stubResponse.FeeEstimateMoneyTransferGetZipCode;
let feeEstimateMoneyTransferGetAmount = stubResponse.FeeEstimateMoneyTransferGetAmount;
let otp = require("../../../one-time-password/otp.js");

console.log('Inside apiInquiryFunctionsController...');
console.log("Printing statusTrackTransfer1: " + statusTrackTransfer);
//let restService = express();
//restService.use(bodyParser.json());

console.log('Inside apiInquiryFunctionsController... after restService.use');

function logConversationHistory(req, speech) {

    console.log("Entering logConversationHistory ---->" + req);
    console.log("Printing req.body.metadata.intentName in logConversationHistory : " + req.body.result.metadata.intentName);
    console.log(" speech : " + speech);

    let logResponse = "";

    let usersaysValue = req.body.result.resolvedQuery;
        console.log("usersaysValue in logConversationHistory : " + usersaysValue);
    let responseValue = speech;
    let intentValue = req.body.result.metadata.intentName;
        console.log("Printing req.body.metadata.intentName in logConversationHistory : " + req.body.result.metadata.intentName);
    let timestampValue = req.body.timestamp;

    let historyLogger = {
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
        let speech = 'empty speech';
//        let returnJsonObj = apihandler.apiHandlerForTrackTransfer(req,res);
        console.log("Printing statusTrackTransfer2: " + statusTrackTransfer);
        let returnJsonObj = statusTrackTransfer;
        JSON.stringify(returnJsonObj);

        let speech = returnJsonObj.speech;

        console.log("before calling logConversationHistory ...");

        console.log("Printing req : " + req.body.result.metadata.intentName);

        let mongoResponse = logConversationHistory(req, speech);

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

    let speech = 'empty speech';
    let speechAudio;
    let priceData;
    let requestBody = req.body;
    let paramObj = {};
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
    
    let agentList = agentLocator_GetCity.messages[0].payload.facebook.attachment.payload.elements[0].title+'\n'+
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

    let returnJsonObj = agentLocator_GetCity;
    
    console.log('Final returnJsonObj--->'+JSON.stringify(returnJsonObj));
    
    //agentLocator_GetCity.speech = speech;
    //agentLocator_GetCity.displayText = speech;
    //agentLocator_GetCity.messages[4].speech = speech;
    //agentLocator_GetCity.data.google.rich_response.items[0].simpleResponse.textToSpeech = agentLocator_GetCity.data.google.rich_response.items[0].simpleResponse.displayText = speech;

    JSON.stringify(returnJsonObj);
    //let speech = returnJsonObj.speech;
    console.log("before calling logConversationHistory ... speech : " + speech);

    console.log("Printing req : " + req.body.result.metadata.intentName);
    let mongoResponse = logConversationHistory(req, speech);

    return res.json(returnJsonObj);

    
}


//Fee Inquiry
function apiHandlerForFeeInquiry(req, res) {

    let speech = 'empty speech';
    let speechAudio;
    let priceData;

    let requestBody = req.body;

    let paramObj = {};
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

    let intentValue = requestBody.result.metadata.intentName;
    if(intentValue == 'FeeEstimate-MoneyTransfer-Channel-AGT'){
        feeInquiry.messages[3].speech = "\nDo want to see nearby agents? (Yes/No)";
    }
    else{
        feeInquiry.messages[3].speech = "";
    }
    let returnJsonObj = feeInquiry;

    JSON.stringify(returnJsonObj);

    let speech = returnJsonObj.speech;

    console.log("before calling logConversationHistory ... speech : " + speech);

    console.log("Printing req : " + req.body.result.metadata.intentName);
    let mongoResponse = logConversationHistory(req, speech);
    
    return res.json(returnJsonObj);

    
}



//Welcome Intent
async function apiDefaultWelcomeIntent(req,res){
    console.log("Entering apiDefaultWelcomeIntent ------>")
    let returnJsonObj = {
        "speech": "Welcome to Opus. My name is Vega. How can I help you?",
        "displayText": "Welcome to Opus. My name is Vega. How can I help you?",
        "messages": [
            {
                "type" : 0,
                "platform" : "facebook",
                "speech" : "Welcome to Opus. My name is Vega. How can I help you?"
            },
            {
                "type" : 0,
                "platform" : "facebook",
                "speech" : "Choose any one of the following options!"
            },
            {
                "type": 4,
                "platform": "facebook",
                "payload": {
                  "facebook": {
                    "attachment": {
                        "payload": {
                          "template_type": "list",
                          "top_element_style" : "compact",
                          "elements": [ 
                            {
                                "title" : "Fund Transfer",
                                "buttons" : [
                                    {
                                        "title": "Proceed",
                                        "type": "postback",
                                        "payload": "Fund transfer"   
                                    }
                                ]
                            },
                            {
                                "title" : "Pay Utility Bill",
                                "buttons" : [
                                    {
                                        "title": "Proceed",
                                        "type": "postback",
                                        "payload": "Pay Bill"   
                                    }
                                ]  
                            },
                            {
                                "title" : "Report ATM Issue",
                                "buttons" : [
                                    {
                                        "title": "Proceed",
                                        "type": "postback",
                                        "payload": "Report atm issue"   
                                    } 
                                ] 
                            },
                            {
                                "title" : "Track ATM Incident",
                                "buttons" : [
                                    {
                                        "title": "Proceed",
                                        "type": "postback",
                                        "payload": "Track atm incident"   
                                    }  
                                ]
                            }
                          ]
                        },
                      "type": "template"
                    }
                  }
                }
              }
            ],
        "source": "Opus-NLP",
    }
    //let returnJsonObj = stubResponse.WelcomeStubResponse;
    // let returnJsonObj = {
    //     "speech": "Welcome to Opus. My name is Vega. How can I help you?",
    //     "displayText": "Welcome to Opus. My name is Vega. How can I help you?",
    //     "messages": [
    //         {
    //             "type" : 0,
    //             "platform" : "facebook",
    //             "speech" : "Welcome to Opus. My name is Vega. How can I help you?"
    //         },
    //         {
    //             "type" : 0,
    //             "platform" : "facebook",
    //             "speech" : "Choose any one of the following options!"
    //         },
    //         {
    //             "type": 4,
    //             "platform": "facebook",
    //             "payload": {
    //               "facebook": {
    //                 "attachment": {
    //                     "payload": {
    //                       "template_type": "list",
    //                       "top_element_style" : "compact",
    //                       "elements": [ 
    //                         {
    //                             "title" : "Fund Transfer",
    //                             "buttons" : [
    //                                 {
    //                                     "title": "Proceed",
    //                                     "type": "postback",
    //                                     "payload": "Fund transfer"   
    //                                 }
    //                             ]
    //                         },
    //                         {
    //                             "title" : "Pay Utility Bill",
    //                             "buttons" : [
    //                                 {
    //                                     "title": "Proceed",
    //                                     "type": "postback",
    //                                     "payload": "Pay Bill"   
    //                                 }
    //                             ]  
    //                         },
    //                         {
    //                             "title" : "Report ATM Issue",
    //                             "buttons" : [
    //                                 {
    //                                     "title": "Proceed",
    //                                     "type": "postback",
    //                                     "payload": "Report atm issue"   
    //                                 } 
    //                             ] 
    //                         },
    //                         {
    //                             "title" : "Track ATM Incident",
    //                             "buttons" : [
    //                                 {
    //                                     "title": "Proceed",
    //                                     "type": "postback",
    //                                     "payload": "Track atm incident"   
    //                                 }  
    //                             ]
    //                         }
    //                       ]
    //                     },
    //                   "type": "template"
    //                 }
    //               }
    //             }
    //           },
    //           {
    //             "type": 4,
    //             "platform": "facebook",
    //             "payload": {
    //               "facebook": {
    //                 "attachment": {
    //                     "payload": {
    //                       "template_type": "list",
    //                       "top_element_style" : "compact",
    //                       "elements": [ 
    //                         {
    //                             "title" : "Estimate Fee For Rermittace",
    //                             "buttons" : [
    //                                 {
    //                                     "title": "Proceed",
    //                                     "type": "postback",
    //                                     "payload": "Estimate fee"   
    //                                 }
    //                             ]
    //                         },
    //                         {
    //                             "title" : "Find Remittance Agent",
    //                             "buttons" : [
    //                                 {
    //                                     "title": "Proceed",
    //                                     "type": "postback",
    //                                     "payload": "find an agent"   
    //                                 }
    //                             ]  
    //                         }
    //                       ]
    //                     },
    //                   "type": "template"
    //                 }
    //               }
    //             }
    //           }
    //         ],
    //     "source": "Opus-NLP",
    // }
    JSON.stringify(returnJsonObj);
    console.log(returnJsonObj);
    let result = await mysqlFunctions.checkIfSessionIdPresent(req);
    if(result.length == 0){
        returnJsonObj = {
            "speech": "Hi there! Please tell me your username to proceed further.",
            "displayText": "Welcome to Opus. My name is Vega. How can I help you?",
            "source": "Opus-NLP"
        }
        returnJsonObj.displayText = returnJsonObj.speech;
    }
    let speech = returnJsonObj.speech;
    console.log("Exiting apiDefaultWelcomeIntent ------>");
    console.log(returnJsonObj);
    let mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

//forgot username intent apiHandler
async function apiDefaultWelcomeIntentForgotUsername(req,res){
    console.log("Entering apiDefaultWelcomeIntentForgotUsername=========>");
    let returnJsonObj = {
        "speech" : "I can help you with that. Please confirm your registered Email ID.",
        "displayText" : "I can help you with that. Please confirm your registered Email ID.",
        "source" : "Opus-NLP"
    }
    JSON.stringify(returnJsonObj);
    let speech = returnJsonObj.speech;
    console.log("Exiting apiDefaultWelcomeIntentForgotUsername=======>");
    console.log(returnJsonObj);
    let mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

async function apiDefaultWelcomeIntentForgotUsernameGetEmail(req,res){
    console.log("Entering apiDefaultWelcomeIntentForgotUsernameGetEmail");
    let result = await mysqlFunctions.checkEmailId(req);
    let returnJsonObj = {
        "speech" : "",
        "displayText" : "",
        "source" : "Opus-NLP"
    };
    JSON.stringify(returnJsonObj);
    if(result.length != 0){

        let contactDetails = await mysqlFunctions.getContact(req);
        let contact = contactDetails.contact;
        let mailId = contactDetails.email;
        let otpCode = await otp.sendOtp(contact,mailId);
        await mysqlFunctions.updateOTPCode(otpCode,req);
        returnJsonObj.speech = "I have sent an OTP to your registered Email ID. Enter it when you receive it.";
        returnJsonObj.displayText = returnJsonObj.speech;
    }
    else{
        returnJsonObj = {
            "speech" : "It seems you have entered unregistered Email ID. Please try again.",
            "displayText" : "It seems you have entered unregistered Email ID. Please try again.",
            "source" : "Opus-NLP"
        }
    }
    let speech = returnJsonObj.speech;
    let mongoResponse = logConversationHistory(req, returnJsonObj.speech);
    console.log("Exiting apiDefaultWelcomeIntentForgotUsernameGetEmail");
    return res.json(returnJsonObj);
}

async function apiDefaultWelcomeIntentForgotUsernameGetOtp(req,res){
    console.log("Entering apiDefaultWelcomeIntentForgotUsernameGetOtp==========>");

    let resultOtpValid = await mysqlFunctions.isOTPValid(req);
    let returnJsonObj = {
        "speech" : "Your OTP was incorrect. Please try again.",
        "displayText" : "Your OTP was incorrect. Please try again.",
        "source" : "Opus-NLP"
    };
    JSON.stringify(returnJsonObj);
    if(resultOtpValid == true){
        let username = await mysqlFunctions.getUsernameFromEmailId(req);
        await otp.sendUsername(req,username);
        await mysqlFunctions.insertSessionIdByEmail(req);
        returnJsonObj = {
            "speech": "Welcome to Opus. My name is Vega. How can I help you?",
            "displayText": "Welcome to Opus. My name is Vega. How can I help you?",
            "messages": [
                {
                    "type" : 0,
                    "platform" : "facebook",
                    "speech" : "Please check your Email for your username."
                },
                {
                    "type" : 0,
                    "platform" : "facebook",
                    "speech" : "How can I help you today?Choose any one of the following options!"
                },
                {
                    "type": 4,
                    "platform": "facebook",
                    "payload": {
                      "facebook": {
                        "attachment": {
                            "payload": {
                              "template_type": "list",
                              "top_element_style" : "compact",
                              "elements": [ 
                                {
                                    "title" : "Fund Transfer",
                                    "buttons" : [
                                        {
                                            "title": "Proceed",
                                            "type": "postback",
                                            "payload": "Fund transfer"   
                                        }
                                    ]
                                },
                                {
                                    "title" : "Pay Utility Bill",
                                    "buttons" : [
                                        {
                                            "title": "Proceed",
                                            "type": "postback",
                                            "payload": "Pay Bill"   
                                        }
                                    ]  
                                },
                                {
                                    "title" : "Report ATM Issue",
                                    "buttons" : [
                                        {
                                            "title": "Proceed",
                                            "type": "postback",
                                            "payload": "Report atm issue"   
                                        } 
                                    ] 
                                },
                                {
                                    "title" : "Track ATM Incident",
                                    "buttons" : [
                                        {
                                            "title": "Proceed",
                                            "type": "postback",
                                            "payload": "Track atm incident"   
                                        }  
                                    ]
                                }
                              ]
                            },
                          "type": "template"
                        }
                      }
                    }
                  }
                ],
            "source": "Opus-NLP",
        }
        // returnJsonObj.speech = "I have sent your username to your registered Email ID. Please check for it.";
        // returnJsonObj.displayText = returnJsonObj.speech;
    }
    else{
        returnJsonObj = {
            "speech" : "Your OTP was incorrect. Please try again.",
            "displayText" : "Your OTP was incorrect. Please try again.",
            "source" : "Opus-NLP"
        };
        // returnJsonObj.speech = `Your OTP was incorrect. Please try again.`;
        // returnJsonObj.displayText = returnJsonObj.speech;
    }

    let speech = returnJsonObj.speech;
    let mongoResponse = logConversationHistory(req, returnJsonObj.speech);
    //add end context code
    console.log("Exiting apiDefaultWelcomeIntentForgotUsernameGetOtp==========>");
    return res.json(returnJsonObj);
}

async function apiDefaultWelcomeIntentGetUsername(req,res){
    console.log("Entering apiDefaultWelcomeIntentGetUsername ------>")
    let result = await mysqlFunctions.insertSessionId(req);
    let returnJsonObj;
    if(result[0].affectedRows == 0){
        returnJsonObj = {
            "speech" : "It seems you have entered worng username. Please try again.",
            "displayText" : "It seems you have entered worng username. Please try again.",
            "source" : "Opus-NLP"
        }
    }
    else{
        returnJsonObj = {
        "speech": "Welcome to Opus. My name is Vega. How can I help you?",
        "displayText": "Welcome to Opus. My name is Vega. How can I help you?",
        "messages": [
            {
                "type" : 0,
                "platform" : "facebook",
                "speech" : "Welcome to Opus. My name is Vega. How can I help you?"
            },
            {
                "type" : 0,
                "platform" : "facebook",
                "speech" : "Choose any one of the following options!"
            },
            {
                "type": 4,
                "platform": "facebook",
                "payload": {
                  "facebook": {
                    "attachment": {
                        "payload": {
                          "template_type": "list",
                          "top_element_style" : "compact",
                          "elements": [ 
                            {
                                "title" : "Fund Transfer",
                                "buttons" : [
                                    {
                                        "title": "Proceed",
                                        "type": "postback",
                                        "payload": "Fund transfer"   
                                    }
                                ]
                            },
                            {
                                "title" : "Pay Utility Bill",
                                "buttons" : [
                                    {
                                        "title": "Proceed",
                                        "type": "postback",
                                        "payload": "Pay Bill"   
                                    }
                                ]  
                            },
                            {
                                "title" : "Report ATM Issue",
                                "buttons" : [
                                    {
                                        "title": "Proceed",
                                        "type": "postback",
                                        "payload": "Report atm issue"   
                                    } 
                                ] 
                            },
                            {
                                "title" : "Track ATM Incident",
                                "buttons" : [
                                    {
                                        "title": "Proceed",
                                        "type": "postback",
                                        "payload": "Track atm incident"   
                                    }  
                                ]
                            }
                          ]
                        },
                      "type": "template"
                    }
                  }
                }
              }
            ],
        "source": "Opus-NLP",
    }
    //let returnJsonObj = stubResponse.WelcomeStubResponseGetUsername;
    // let returnJsonObj = {
    //     "speech": "Welcome to Opus. My name is Vega. How can I help you?",
    //     "displayText": "Welcome to Opus. My name is Vega. How can I help you?",
    //     "messages": [
    //         {
    //             "type" : 0,
    //             "platform" : "facebook",
    //             "speech" : "Welcome to Opus. My name is Vega. How can I help you?"
    //         },
    //         {
    //             "type" : 0,
    //             "platform" : "facebook",
    //             "speech" : "Choose any one of the following options!"
    //         },
    //         {
    //             "type": 4,
    //             "platform": "facebook",
    //             "payload": {
    //               "facebook": {
    //                 "attachment": {
    //                     "payload": {
    //                       "template_type": "list",
    //                       "top_element_style" : "compact",
    //                       "elements": [ 
    //                         {
    //                             "title" : "Fund Transfer",
    //                             "buttons" : [
    //                                 {
    //                                     "title": "Proceed",
    //                                     "type": "postback",
    //                                     "payload": "Fund transfer"   
    //                                 }
    //                             ]
    //                         },
    //                         {
    //                             "title" : "Pay Utility Bill",
    //                             "buttons" : [
    //                                 {
    //                                     "title": "Proceed",
    //                                     "type": "postback",
    //                                     "payload": "Pay Bill"   
    //                                 }
    //                             ]  
    //                         },
    //                         {
    //                             "title" : "Report ATM Issue",
    //                             "buttons" : [
    //                                 {
    //                                     "title": "Proceed",
    //                                     "type": "postback",
    //                                     "payload": "Report atm issue"   
    //                                 } 
    //                             ] 
    //                         },
    //                         {
    //                             "title" : "Track ATM Incident",
    //                             "buttons" : [
    //                                 {
    //                                     "title": "Proceed",
    //                                     "type": "postback",
    //                                     "payload": "Track atm incident"   
    //                                 }  
    //                             ]
    //                         }
    //                       ]
    //                     },
    //                   "type": "template"
    //                 }
    //               }
    //             }
    //           },
    //           {
    //             "type": 4,
    //             "platform": "facebook",
    //             "payload": {
    //               "facebook": {
    //                 "attachment": {
    //                     "payload": {
    //                       "template_type": "list",
    //                       "top_element_style" : "compact",
    //                       "elements": [ 
    //                         {
    //                             "title" : "Estimate Fee For Rermittace",
    //                             "buttons" : [
    //                                 {
    //                                     "title": "Proceed",
    //                                     "type": "postback",
    //                                     "payload": "Estimate fee"   
    //                                 }
    //                             ]
    //                         },
    //                         {
    //                             "title" : "Find Remittance Agent",
    //                             "buttons" : [
    //                                 {
    //                                     "title": "Proceed",
    //                                     "type": "postback",
    //                                     "payload": "find an agent"   
    //                                 }
    //                             ]  
    //                         }
    //                       ]
    //                     },
    //                   "type": "template"
    //                 }
    //               }
    //             }
    //           }
    //         ],
    //     "source": "Opus-NLP"
    // }
    }
    
    JSON.stringify(returnJsonObj);
    console.log(returnJsonObj);
    
    let speech = returnJsonObj.speech;
    console.log("Exiting apiDefaultWelcomeIntentGetUsername ------>")
    console.log(returnJsonObj);
    let mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

//Agent Locator
function apiHandlerForAgentLocator(req,res){
    console.log("Entering apiHandlerForAgentLocator ------>")
    let returnJsonObj = agentLocator;
    JSON.stringify(returnJsonObj);
    let speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForAgentLocator ------>")
    let mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

//FeeEstimate
function apiHandlerForFeeEstimate(req,res){
    console.log("Entering apiHandlerForFeeEstimate ------>")
    let returnJsonObj = feeEstimate;
    JSON.stringify(returnJsonObj);
    let speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForFeeEstimate ------>")
    let mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

//FeeEstimate-BillPay
function apiHandlerForFeeEstimateBillPay(req,res){
    console.log("Entering apiHandlerForFeeEstimateBillPay ------>")
    let returnJsonObj = feeEstimateBillPay;
    JSON.stringify(returnJsonObj);
    let speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForFeeEstimateBillPay ------>")
    let mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

//FeeEstimate-MoneyTransfer-GetCountry
function apiHandlerForFeeEstimateMoneyTransferGetCountry(req,res){
    console.log("Entering apiHandlerForFeeEstimateMoneyTransferGetCountry ------>")
    let returnJsonObj = feeEstimateMoneyTransferGetCountry;
    returnJsonObj.speech = "From which zip code do you want to send the money to "+req.body.result.parameters.destCountry.name+"?";
    returnJsonObj.displayText = "From which zip code do you want to send the money to "+req.body.result.parameters.destCountry.name+"?";
    returnJsonObj.data.facebook[0].text = "From which zip code do you want to send the money to "+req.body.result.parameters.destCountry.name+"?";
    JSON.stringify(returnJsonObj);
    let speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForFeeEstimateMoneyTransferGetCountry ------>")
    let mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

//FeeEstimate-MoneyTransfer-GetZipCode
function apiHandlerForFeeEstimateMoneyTransferGetZipCode(req,res){
    console.log("Entering apiHandlerForFeeEstimateMoneyTransferGetZipCode ------>")
    let returnJsonObj = feeEstimateMoneyTransferGetZipCode;
    JSON.stringify(returnJsonObj);
    let speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForFeeEstimateMoneyTransferGetZipCode ------>")
    let mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

//FeeEstimate-MoneyTransfer-GetAmount
function apiHandlerForFeeEstimateMoneyTransferGetAmount(req,res){
    console.log("Entering apiHandlerForFeeEstimateMoneyTransferGetAmount ------>")
    let returnJsonObj = feeEstimateMoneyTransferGetAmount;
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
    let speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForFeeEstimateMoneyTransferGetAmount ------>")
    let mongoResponse = logConversationHistory(req, speech);
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
exports.apiDefaultWelcomeIntentGetUsername = apiDefaultWelcomeIntentGetUsername;
exports.apiDefaultWelcomeIntentForgotUsername = apiDefaultWelcomeIntentForgotUsername;
exports.apiDefaultWelcomeIntentForgotUsernameGetOtp = apiDefaultWelcomeIntentForgotUsernameGetOtp;
exports.apiDefaultWelcomeIntentForgotUsernameGetEmail = apiDefaultWelcomeIntentForgotUsernameGetEmail;