'use strict';

console.log('Entering apiHandler...before require apihandler');

let mysql = require('mysql2/promise');
let express = require('express');
let bodyParser = require('body-parser');
let conversationHistory = require('../../../history/LogHandler.js');
let stubResponse = require("../../responsestubs/StubResponse.js");
let config = require("../../../config.js");
let MysqlFunctions = require("../../dao/mysql/MysqlFunctions.js");
let PaymentCloudFunctions = require("../../dao/paymentcloud/getATMTicketAssignment.js");
let chatsummary = require("../../../summary/chatsummary.js");
let MongoFunctions = require("../../dao/mongo/MongoFunctions.js");
let context = require("../../../context/contextHandler.js");
let intentNameLookup = require("../../../reflookup/IntentNames.js");

let restService = express();
restService.use(bodyParser.json());

//inserting current conversation log in mongodb collection-ConversationLog
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
    let sessionId = req.body.sessionId;

    let historyLogger = {
            usersays : usersaysValue,
            response : responseValue,
            intent : intentValue,
            timestamp : timestampValue,
            sessionId : sessionId
        }
        conversationHistory.MongoInsert(historyLogger);

        logResponse = "Your conversational history will be sent to your registered mobile number";
    console.log("Exiting logConversationHistory ---->" + req);
        return logResponse;
}

//Welcome Intent
function apiDefaultWelcomeIntent(req,res){
    console.log("Entering apiDefaultWelcomeIntent ------>")
    let returnJsonObj = stubResponse.WelcomeStubResponse;
    JSON.stringify(returnJsonObj);
    let speech = returnJsonObj.speech;
    console.log("Exiting apiDefaultWelcomeIntent ------>")
    let mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

//smalltalk
function apiHandlerForSmallTalk(req,res){
    console.log("Entering apiHandlerForSmallTalk ------>")
    let usr = req.body.result.resolvedQuery;
    let speech = req.body.result.fulfillment.messages[0].speech;
    console.log("User say-->"+usr);
    console.log("Reply-->"+speech);
    console.log("Exiting apiHandlerForSmallTalk ------>")
    let mongoResponse = logConversationHistory(req, speech);
    return res.json(null);
}

//ReportingAtmIncident - start of context
function apiHandlerForReportAtmIncident(req,res){
    console.log("Entering apiHandlerForReportAtmIncident ------>")
    //let incId = Math.floor(Math.random()*(100000-100)+100);
    let returnJsonObj = stubResponse.ReportAtmIncident;
    JSON.stringify(returnJsonObj);
    let speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForReportAtmIncident ------>")
    let mongoResponse = logConversationHistory(req, speech);
    context.insertContextLog(req,"report-atm-incident-get-issue");
    return res.json(returnJsonObj);
}

//Reporting Atm Incidint get_atmid
function apiHandlerForReportAtmIncidentGetAtmId(req,res){
    console.log("Entering apiHandlerForReportAtmIncidentGetAtmId ------>")
    let returnJsonObj = stubResponse.ReportAtmIncidentGetAtmId(req);
    JSON.stringify(returnJsonObj);
    let speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForReportAtmIncidentGetAtmId ------>")
    let mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

//report-atm-incident-get-name
function apiHandlerForReportAtmIncidentGetName(req,res){
    console.log("Entering apiHandlerForReportAtmIncidentGetName ------>")
    let returnJsonObj = stubResponse.ReportAtmIncidentGetName(req);
    JSON.stringify(returnJsonObj);
    let speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForReportAtmIncidentGetName ------>")
    let mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

//report-atm-incident-get-contact
function apiHandlerForReportAtmIncidentGetContact(req,res){
    console.log("Entering apiHandlerForReportAtmIncidentGetContact ------>")
    let returnJsonObj = stubResponse.ReportAtmIncidentGetContact(req);
    JSON.stringify(returnJsonObj);
    let speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForReportAtmIncidentGetContact ------>")
    let mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

//report-atm-incident-get-issue - end of context
async function apiHandlerForReportAtmIncidentGetIssue(req,res){
    console.log("Entering apiHandlerForReportAtmIncidentGetIssue ------>");
    // Now connect to the AI helpdesk and get the Technician to be assigned
    // to the ticket
    let INCID;
    PaymentCloudFunctions.getTechnicianDetails(req, async function(err,response){
        if (err) throw err;
        else{
            console.log("Inside wait.for...");
            console.log(response);
            let technicianName = response;
            await MysqlFunctions.insertIncidentLog(req, technicianName);
            INCID = await MysqlFunctions.selectIncidentId(req);
            if(INCID != false){
                console.log("incid ...: " + INCID);
                // let startintentname = 'report-atm-incident';
                // let updateContextLogEndIntentNameValue =  await context.updateContextLogEndIntentName(req,startintentname);
                // if(updateContextLogEndIntentNameValue != false){
                //     console.log("updateContextLogEndIntentName SUCESSFULL");
                // }
                // else{
                //     console.log("ERROR IN UPDATING updateContextLogEndIntentName");
                // }
                let returnJsonObj = stubResponse.ReportAtmIncidentGetIssue(req,INCID,technicianName);
                JSON.stringify(returnJsonObj);
                let speech = returnJsonObj.speech;
                console.log("Exiting apiHandlerForReportAtmIncidentGetIssue ------>")
                let mongoResponse = await logConversationHistory(req, speech);
                let updateContextLogIntentCompleteValue = await context.updateContextLogIntentComplete(req);
                if(updateContextLogIntentCompleteValue != false){
                    console.log("updateContextLogIntentComplete SUCCESSFULL");
                    let result = await context.selectContextLogFalseIntentComplete(req);
                    console.log("#################");
                    console.log(result);
                    console.log("#################");
                    let concat = '';    
                    if(result.length==1 ){
                        returnJsonObj = await context.cardCreate(returnJsonObj,result);
                    }
                    if(result.length > 1){
                        returnJsonObj = await context.listCreate(returnJsonObj,result);   
                    }

                }
                else{
                    console.log("updateContextLogIntentComplete ERROR....");
                }
                return res.json(returnJsonObj);
            }
            else{
                console.log("ERROR in selectIncidentId... CANNOT GET INCID.....");
            }
        }
    });
}

//track-atm-incident - start of context
function apiHandlerForTrackAtmIncident(req,res){
    console.log("Entering apiHandlerForTrackAtmIncident ------>")
    let returnJsonObj = stubResponse.TrackAtmIncident;
    JSON.stringify(returnJsonObj);
    let speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForTrackAtmIncident ------>")
    let mongoResponse = logConversationHistory(req, speech);
    context.insertContextLog(req,"track-atm-incident-get-incid");
    return res.json(returnJsonObj);
}

//track-atm-incident-get-incid - end of context
async function apiHandlerForTrackAtmIncidentGetIncId(req,res){
    console.log("Entering apiHandlerForTrackAtmIncidentGetIncId ------>");
    let INCID = req.body.result.parameters.incid;
    let userchatsummary = '';
    let botchatsummary = '';
    let returnJsonObj;
    console.log("Requested INCID status----->"+INCID);

    let rows = await MysqlFunctions.selectIncidentStatus(req);
    if(rows != false){
        // let startintentname = 'track-atm-incident';
        // await context.updateContextLogEndIntentName(req,startintentname);
        console.log("got rows from callback---->"+rows);
        returnJsonObj = await stubResponse.TrackAtmIncidentGetIncId(rows);
        JSON.stringify(returnJsonObj);
    }
    //ERROR HANDLING
    else{
        console.log("ERROR IN selectIncidentStatus ");
        returnJsonObj = stubResponse.TrackAtmIncidentGetIncId(rows);
        JSON.stringify(returnJsonObj);
        returnJsonObj.speech = `Cannot fetch Incident Status`;
        returnJsonObj.displayText = returnJsonObj.speech;
    }

    console.log("**************************");
    console.log(returnJsonObj);
    console.log("*****************************");
    let speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForTrackAtmIncidentGetIncId ------>")
    let mongoResponse = await logConversationHistory(req, speech);
    await context.updateContextLogIntentComplete(req);
    
    let result = await context.selectContextLogFalseIntentComplete(req);
    console.log("#################");
    console.log(result);
    console.log("#################");
    let concat = '';    
    if(result.length==1 ){
        returnJsonObj = await context.cardCreate(returnJsonObj,result);
    }
    if(result.length > 1){
        returnJsonObj = await context.listCreate(returnJsonObj,result);   
    }
    return res.json(returnJsonObj);
}

function apiHandlerForReportAtmIncidentGetAtmIdLoop(req,res){
    console.log("Entering apiHandlerForReportAtmIncidentGetAtmIdLoop ------>");
    //let incId = Math.floor(Math.random()*(100000-100)+100);
    let returnJsonObj = stubResponse.ReportAtmIncidentGetAtmIdLoop;
    JSON.stringify(returnJsonObj);
    let speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForReportAtmIncidentGetAtmIdLoop ------>")
    let mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

//cancel all intent
async function apiHandlerForCancelAllIntent(req,res){
    console.log("Entering apiHandlerForCancelAllIntent ------>");
    let returnJsonObj = await stubResponse.CancelAllIntent;
    JSON.stringify(returnJsonObj);
    console.log(returnJsonObj);
    let speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForCancelAllIntent ------>")
    await context.updateContextLogEndIntent(req);
    let mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

//exporting all functions
exports.apiHandlerForSmallTalk = apiHandlerForSmallTalk;
exports.apiDefaultWelcomeIntent = apiDefaultWelcomeIntent;
exports.apiHandlerForReportAtmIncident = apiHandlerForReportAtmIncident;
exports.apiHandlerForReportAtmIncidentGetAtmId = apiHandlerForReportAtmIncidentGetAtmId;
exports.apiHandlerForReportAtmIncidentGetName = apiHandlerForReportAtmIncidentGetName;
exports.apiHandlerForReportAtmIncidentGetContact = apiHandlerForReportAtmIncidentGetContact;
exports.apiHandlerForReportAtmIncidentGetIssue = apiHandlerForReportAtmIncidentGetIssue;
exports.apiHandlerForTrackAtmIncident = apiHandlerForTrackAtmIncident;
exports.apiHandlerForTrackAtmIncidentGetIncId = apiHandlerForTrackAtmIncidentGetIncId;
exports.apiHandlerForReportAtmIncidentGetAtmIdLoop = apiHandlerForReportAtmIncidentGetAtmIdLoop;
exports.apiHandlerForCancelAllIntent = apiHandlerForCancelAllIntent;