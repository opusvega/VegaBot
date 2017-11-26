'use strict';

console.log('Entering apiHandler...before require apihandler');

var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var conversationHistory = require('../../../history/LogHandler.js');
var stubResponse = require("../../responsestubs/StubResponse.js");
var config = require("../../../config.js");
var MysqlFunctions = require("../../dao/mysql/MysqlFunctions.js");
var PaymentCloudFunctions = require("../../dao/paymentcloud/getATMTicketAssignment.js");
var chatsummary = require("../../../summary/chatsummary.js");
var MongoFunctions = require("../../dao/mongo/MongoFunctions.js");
var restService = express();
restService.use(bodyParser.json());

//inserting current conversation log in mongodb collection-ConversationLog
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
    var sessionId = req.body.sessionId;

    var historyLogger = {
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
    var returnJsonObj = stubResponse.WelcomeStubResponse;
    JSON.stringify(returnJsonObj);
    var speech = returnJsonObj.speech;
    console.log("Exiting apiDefaultWelcomeIntent ------>")
    var mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

//smalltalk
function apiHandlerForSmallTalk(req,res){
    console.log("Entering apiHandlerForSmallTalk ------>")
    var usr = req.body.result.resolvedQuery;
    var speech = req.body.result.fulfillment.messages[0].speech;
    console.log("User say-->"+usr);
    console.log("Reply-->"+speech);
    console.log("Exiting apiHandlerForSmallTalk ------>")
    var mongoResponse = logConversationHistory(req, speech);
    return res.json(null);
}

//ReportingAtmIncident - start of context
function apiHandlerForReportAtmIncident(req,res){
    console.log("Entering apiHandlerForReportAtmIncident ------>")
    //var incId = Math.floor(Math.random()*(100000-100)+100);
    var returnJsonObj = stubResponse.ReportAtmIncident;
    JSON.stringify(returnJsonObj);
    var speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForReportAtmIncident ------>")
    var mongoResponse = logConversationHistory(req, speech);
    MysqlFunctions.insertContextLog(req);
    return res.json(returnJsonObj);
}

//Reporting Atm Incidint get_atmid
function apiHandlerForReportAtmIncidentGetAtmId(req,res){
    console.log("Entering apiHandlerForReportAtmIncidentGetAtmId ------>")
    var returnJsonObj = stubResponse.ReportAtmIncidentGetAtmId(req);
    JSON.stringify(returnJsonObj);
    var speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForReportAtmIncidentGetAtmId ------>")
    var mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

//report-atm-incident-get-name
function apiHandlerForReportAtmIncidentGetName(req,res){
    console.log("Entering apiHandlerForReportAtmIncidentGetName ------>")
    var returnJsonObj = stubResponse.ReportAtmIncidentGetName(req);
    JSON.stringify(returnJsonObj);
    var speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForReportAtmIncidentGetName ------>")
    var mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

//report-atm-incident-get-contact
function apiHandlerForReportAtmIncidentGetContact(req,res){
    console.log("Entering apiHandlerForReportAtmIncidentGetContact ------>")
    var returnJsonObj = stubResponse.ReportAtmIncidentGetContact(req);
    JSON.stringify(returnJsonObj);
    var speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForReportAtmIncidentGetContact ------>")
    var mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

//report-atm-incident-get-issue - end of context
function apiHandlerForReportAtmIncidentGetIssue(req,res){
    console.log("Entering apiHandlerForReportAtmIncidentGetIssue ------>");
    // Now connect to the AI helpdesk and get the Technician to be assigned
    // to the ticket
    var INCID;
    PaymentCloudFunctions.getTechnicianDetails(req, function(err,response){
        if (err) throw err;
        else{
            console.log("Inside wait.for...");
            console.log(response);
            var technicianName = response;
            // MysqlFunctions.insertIncidentLog(req, technicianName,function(err, result){
            //     if (err) throw err;
            //     else{
            //         wait.launchFiber(MysqlFunctions.selectIncidentId, req, function(incid){
            //             var startintentname = 'report-atm-incident';
            //             MysqlFunctions.updateContextLogEndIntentName(req,startintentname);
            //             INCID = incid;
            //             console.log("incid ...: " + INCID);
            //             var returnJsonObj = stubResponse.ReportAtmIncidentGetIssue(req,INCID);
            //             JSON.stringify(returnJsonObj);
            //             var speech = returnJsonObj.speech;
            //             console.log("Exiting apiHandlerForReportAtmIncidentGetIssue ------>")
            //             var mongoResponse = logConversationHistory(req, speech);
            //             MysqlFunctions.updateContextLogIntentComplete(req);
            //             return res.json(returnJsonObj);
            //         });
            //     }
            // });
        }
    });
    
    // var INCID;
    // wait.for(MysqlFunctions.selectMysql, req, function(incid){
    //     var startintentname = 'report-atm-incident';
    //     MysqlFunctions.updateContextLogEndIntentName(req,startintentname);
    //     INCID = incid;
    //     console.log("incid ...: " + INCID);
    //     var returnJsonObj = stubResponse.ReportAtmIncidentGetIssue(req,INCID);
    //     JSON.stringify(returnJsonObj);
    //     var speech = returnJsonObj.speech;
    //     console.log("Exiting apiHandlerForReportAtmIncidentGetIssue ------>")
    //     var mongoResponse = logConversationHistory(req, speech);
    //     MysqlFunctions.updateContextLogIntentComplete(req);
    //     return res.json(returnJsonObj);
    // });
}

//track-atm-incident - start of context
function apiHandlerForTrackAtmIncident(req,res){
    console.log("Entering apiHandlerForTrackAtmIncident ------>")
    var returnJsonObj = stubResponse.TrackAtmIncident;
    JSON.stringify(returnJsonObj);
    var speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForTrackAtmIncident ------>")
    var mongoResponse = logConversationHistory(req, speech);
    MysqlFunctions.insertContextLog(req);
    return res.json(returnJsonObj);
}

//track-atm-incident-get-incid - end of context
function apiHandlerForTrackAtmIncidentGetIncId(req,res){
    console.log("Entering apiHandlerForTrackAtmIncidentGetIncId ------>");
    var INCID = req.body.result.parameters.incid;
    var userchatsummary = '';
    var botchatsummary = '';

    console.log("Requested INCID status----->"+INCID);
    wait.for(MysqlFunctions.selectIncidentStatus, req, function(rows){
        
        var startintentname = 'track-atm-incident';
        MysqlFunctions.updateContextLogEndIntentName(req,startintentname);
        console.log("got rows from callback---->"+rows);
        var returnJsonObj = stubResponse.TrackAtmIncidentGetIncId(rows);
        JSON.stringify(returnJsonObj);
        chatsummary.summary(req, function(err, chatsummary_bot, chatsummary_user){
            if (err) throw err;
            else{
                userchatsummary = chatsummary_user;
                botchatsummary = chatsummary_bot;
                returnJsonObj.speech = returnJsonObj.speech + " Your chat summary : " + 
                               userchatsummary + " and " + botchatsummary;
                returnJsonObj.displayText = returnJsonObj.speech;
                var speech = returnJsonObj.speech;

                console.log("Exiting apiHandlerForTrackAtmIncidentGetIncId ------>")
                var mongoResponse = logConversationHistory(req, speech);
                MysqlFunctions.updateContextLogIntentComplete(req);
                return res.json(returnJsonObj);
            }
        });
        
        // MongoFunctions.findSummary(function(err,result){
        //     if (err) throw err;
        //     else{
        //         userchatsuammary = result[0].chatsummary_user;
        //         botchatsummary = result[0].chatsummary_bot;
        //     }
        // });
        
        //var speech = returnJsonObj.speech;
        // returnJsonObj.speech = returnJsonObj.speech + " Your chat summary : " + 
        //                        userchatsummary.toString() + " and " + botchatsummary.toString();
        // returnJsonObj.displayText = returnJsonObj.speech;
        // var speech = returnJsonObj.speech;

        // console.log("Exiting apiHandlerForTrackAtmIncidentGetIncId ------>")
        // var mongoResponse = logConversationHistory(req, speech);
        // MysqlFunctions.updateContextLogIntentComplete(req);
        // return res.json(returnJsonObj);
    });
}

function apiHandlerForReportAtmIncidentGetAtmIdLoop(req,res){
    console.log("Entering apiHandlerForReportAtmIncidentGetAtmIdLoop ------>");
    //var incId = Math.floor(Math.random()*(100000-100)+100);
    var returnJsonObj = stubResponse.ReportAtmIncidentGetAtmIdLoop;
    JSON.stringify(returnJsonObj);
    var speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForReportAtmIncidentGetAtmIdLoop ------>")
    var mongoResponse = logConversationHistory(req, speech);
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
