'use strict';

console.log('Entering apiHandler...before require apihandler');

var mysql = require('mysql');
var wait = require('wait.for');
var express = require('express');
var bodyParser = require('body-parser');
var conversationHistory = require('../../../history/LogHandler.js');
var stubResponse = require("../../responsestubs/StubResponse.js");
var config = require("../../../config.js");
var MysqlFunctions = require("../../dao/mysql/MysqlFunctions.js");
var PaymentCloudFunctions = require("../../dao/paymentcloud/getATMTicketAssignment.js")
var restService = express();
restService.use(bodyParser.json());

//mysql connection
function createMysqlConnection(){
    var con = mysql.createConnection({
        host: config.mysqlUrl,
        user: config.mysqlUser,
        password: config.mysqlPassword,
        database : config.mysqldb
    });
    return con;
}

//insert into mysql
function insertMysql(req){
    var ATMID = req.body.result.parameters.atmId.atmId;
    var ISSUE = req.body.result.parameters.issues;
    var CUSTOMERNAME = req.body.result.parameters.customerName.customerName;
    var CONTACT = req.body.result.parameters.contact.contact;
    createMysqlConnection().connect(function(err) {
        if (err) throw err;
        else{
            console.log("Connected!");
            var sql = "INSERT INTO incidentlog (incid, atmid, issue, status,username, usercontact, inctime, restime) VALUES"+
                      " (DEFAULT, "+ATMID+", '"+ISSUE+"','In-progress','"+CUSTOMERNAME+"','"+CONTACT+"',NOW(), NOW());";
            createMysqlConnection().query(sql, function (err, result) {
                    if (err) throw err;
                    else console.log("1 record inserted");
            });
        }

    });
}

//
function selectMysql(req,callback){
    var ATMID = req.body.result.parameters.atmId.atmId;
    var USERNAME = req.body.result.parameters.customerName.customerName;
    var CONTACT = req.body.result.parameters.contact.contact;
    var query = "SELECT incid FROM incidentlog WHERE atmid = '"+ATMID+"' AND username = '"+USERNAME+"'"+
                " AND usercontact = '"+CONTACT+"'";
    createMysqlConnection().connect(function(err) {
        if (err) throw err;
        else{
            createMysqlConnection().query(query, function (err, rows) {
                if (err) throw err;
                else {
                    console.log(rows);
                    callback(rows[0].incid);
                }
            });
        }

    });
}
//convo log
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

//ReportingAtmIncident
function apiHandlerForReportAtmIncident(req,res){
    console.log("Entering apiHandlerForReportAtmIncident ------>")
    //var incId = Math.floor(Math.random()*(100000-100)+100);
    var returnJsonObj = stubResponse.ReportAtmIncident;
    JSON.stringify(returnJsonObj);
    var speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForReportAtmIncident ------>")
    var mongoResponse = logConversationHistory(req, speech);
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

//report-atm-incident-get-issue
function apiHandlerForReportAtmIncidentGetIssue(req,res){
    console.log("Entering apiHandlerForReportAtmIncidentGetIssue ------>");
    // Now connect to the AI helpdesk and get the Technician to be assigned
    // to the ticket
    wait.for(PaymentCloudFunctions.getTechnicianDetails, req, function(response){
    console.log("Inside wait.for...");
    console.log(response);
    var technicianName = response;
      MysqlFunctions.insertIncidentLog(req, technicianName);
    });

    var INCID;
    wait.for(selectMysql, req, function(incid){
        INCID = incid;
        console.log("incid ...: " + INCID);
        var returnJsonObj = stubResponse.ReportAtmIncidentGetIssue(req,INCID);
        JSON.stringify(returnJsonObj);
        var speech = returnJsonObj.speech;
        console.log("Exiting apiHandlerForReportAtmIncidentGetIssue ------>")
        var mongoResponse = logConversationHistory(req, speech);
        return res.json(returnJsonObj);
    });

   /* selectMysql(req, function(err,incid){
        if (err) console.log(err);
        else{
            INCID = incid;
        }
    });
    console.log("incid ...: " + INCID);
    var returnJsonObj = stubResponse.ReportAtmIncidentGetIssue(req,INCID);
    JSON.stringify(returnJsonObj);
    var speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForReportAtmIncidentGetIssue ------>")
    var mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);*/
}

//track-atm-incident
function apiHandlerForTrackAtmIncident(req,res){
    console.log("Entering apiHandlerForTrackAtmIncident ------>")
    var returnJsonObj = stubResponse.TrackAtmIncident;
    JSON.stringify(returnJsonObj);
    var speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForTrackAtmIncident ------>")
    var mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

//
function apiHandlerForATMIncidentTicketAssignment(req, res) {

}

function selectStatusMysql(req,callback){
    var INCID = req.body.result.parameters.incid;
    var query = "SELECT atmid, issue, DATE_FORMAT(inctime, '%a %d %b %Y %T' ) inctime, status FROM incidentlog WHERE incid = "+INCID;
    createMysqlConnection().connect(function(err) {
        if (err) throw err;
        else{
            createMysqlConnection().query(query, function (err, rows) {
                if (err) throw err;
                else {
                    console.log(rows);
                    callback(rows);
                }
            });
        }

    });
}

//track-atm-incident-get-incid
function apiHandlerForTrackAtmIncidentGetIncId(req,res){
    console.log("Entering apiHandlerForTrackAtmIncidentGetIncId ------>");
    var INCID = req.body.result.parameters.incid;

    console.log("Requested INCID status----->"+INCID);
    wait.for(selectStatusMysql, req, function(rows){
        console.log("got rows from callback---->"+rows);
        var returnJsonObj = stubResponse.TrackAtmIncidentGetIncId(rows);
        JSON.stringify(returnJsonObj);
        var speech = returnJsonObj.speech;
        console.log("Exiting apiHandlerForTrackAtmIncidentGetIncId ------>")
        var mongoResponse = logConversationHistory(req, speech);
        return res.json(returnJsonObj);
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
