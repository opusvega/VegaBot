let mysqlFunctions = require("../../../mysql-functions/mysqlFunctions.js");
let conversationHistory = require('../../../history/LogHandler.js');
let nodeMailer = require("../../../node-mailer/index.js");

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
        // let otpCode = await otp.sendOtp(contact,mailId);
        let otpCode = await nodeMailer.sendOtp(mailId);
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
        await nodeMailer.sendUsername(req,username);
        await mysqlFunctions.insertSessionIdByEmail(req);
        returnJsonObj = {
            "speech": "Welcome to Opus. My name is Vega. How can I help you?\nChoose any one of the following options!\nFund Transfer\nPay Utility Bill\nReport ATM Incident\nTrack ATM Incident",
            "displayText": "Welcome to Opus. My name is Vega. How can I help you?\nChoose any one of the following options!\nFund Transfer\nPay Utility Bill\nReport ATM Incident\nTrack ATM Incident",
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

async function apiDefaultWelcomeIntent(req,res){
    console.log("Entering apiDefaultWelcomeIntent ------>")
    let returnJsonObj = {
        "speech": "How can I help you?\nChoose any one of the following options!\nFund Transfer\nPay Utility Bill\nReport ATM Incident\nTrack ATM Incident",
        "displayText": "How can I help you?\nChoose any one of the following options!\nFund Transfer\nPay Utility Bill\nReport ATM Incident\nTrack ATM Incident",
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
    JSON.stringify(returnJsonObj);
    console.log(returnJsonObj);
    let result = await mysqlFunctions.checkIfSessionIdPresent(req);
    if(result.length == 0){
        returnJsonObj = {
            "speech": "Welcome to Opus. My name is Vega. Please tell me your username to proceed further.",
            "displayText": "Welcome to Opus. My name is Vega. Please tell me your username to proceed further.",
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
        "speech": "How can I help you?\nChoose any one of the following options!\nFund Transfer\nPay Utility Bill\nReport ATM Incident\nTrack ATM Incident",
        "displayText": "How can I help you?\nChoose any one of the following options!\nFund Transfer\nPay Utility Bill\nReport ATM Incident\nTrack ATM Incident",
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
    }
    
    JSON.stringify(returnJsonObj);
    console.log(returnJsonObj);
    
    let speech = returnJsonObj.speech;
    console.log("Exiting apiDefaultWelcomeIntentGetUsername ------>")
    console.log(returnJsonObj);
    let mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

exports.apiDefaultWelcomeIntent = apiDefaultWelcomeIntent;
exports.apiDefaultWelcomeIntentGetUsername = apiDefaultWelcomeIntentGetUsername;
exports.apiDefaultWelcomeIntentForgotUsername = apiDefaultWelcomeIntentForgotUsername;
exports.apiDefaultWelcomeIntentForgotUsernameGetEmail = apiDefaultWelcomeIntentForgotUsernameGetEmail;
exports.apiDefaultWelcomeIntentForgotUsernameGetOtp = apiDefaultWelcomeIntentForgotUsernameGetOtp;