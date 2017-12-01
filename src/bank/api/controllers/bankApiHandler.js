'use strict';

console.log('Entering apiHandler...before require apihandler');

var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var conversationHistory = require('../../../history/LogHandler.js');
var stubResponse = require("../../responsestubs/StubResponse.js");
var config = require("../../../config.js");
var MysqlFunctions = require("../../dao/mysql/MysqlFunctions.js");
//var PaymentCloudFunctions = require("../../dao/paymentcloud/getATMTicketAssignment.js")
var restService = express();
restService.use(bodyParser.json());

//Log Conversation History
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


//check biller exists speech
async function checkBillerExistSpeech(req){
    var speech= "";
    //check if biller exists
    var rows = await MysqlFunctions.selectBillersToPay(req);
    if(rows.length == 0){
        //add new biller
        speech = "You have no biller registered. To Proceed you need to add a biller." 
    }
    else {
        //*******show list of those billers who have amtdue !=0 
        speech = "You have "+rows.length+" billers registered. ";
        for(var i =0;i<rows.length;i++){
            speech = speech + " "+(i+1)+")"+ rows[i].billername + " AMt due : "+ rows[i].amtdue + "Due Date : " + rows[i].duedate;
        }
        speech = speech + ". Which one do you want to pay for? You can also add another biller.";
    }
    return speech ;
}

async function checkSSN(req){
    //if ssn does not exists => add it to db
    var SSN;
    var rows = await MysqlFunctions.findSSN(req);
    console.log("back rows are-------->");
    console.log(rows)
    console.log(rows.length);
    if(rows.length == 0){
       SSN = MysqlFunctions.addSSN(req);
    }
    return SSN;
}

//Bill Init handler; pay bill request;opens door to options of utilities that can be paid
function apiHandlerForBillInit(req,res){
    console.log("Entering apiHandlerForBillInit ------>")
    var returnJsonObj = stubResponse.BillInitResponse;
    JSON.stringify(returnJsonObj);
    var speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForBillInit ------>")
    var mongoResponse = logConversationHistory(req, returnJsonObj.speech);
    return res.json(returnJsonObj);
}

//init gas bill pay request; pay for gas bill
async function apiHandlerForGasBillInit(req,res){
    console.log("Entering apiHandlerForGasBillInit ------>")
    var returnJsonObj = stubResponse.GasBillInitResponse;//get response from stub : empty rt now
    JSON.stringify(returnJsonObj);
    var SSN = await checkSSN(req);//ADD ssn to db if not exist 
    returnJsonObj.speech = await checkBillerExistSpeech(req) ; //call functin to find exact speech 
    returnJsonObj.displayText = returnJsonObj.speech; // speech and displayText have same values
    console.log("Exiting apiHandlerForGasBillInit ------>")
    var mongoResponse = logConversationHistory(req, returnJsonObj.speech); // save coversation to mongoDB
    return res.json(returnJsonObj); //send response json back to client
}

//init light bill payrequest; pay for light bill
async function apiHandlerForLightBillInit(req,res){
    console.log("Entering apiHandlerForLightBillInit ------>")
    var returnJsonObj = stubResponse.LightBillInitResponse;
    JSON.stringify(returnJsonObj);
    var SSN = await checkSSN(req);//ADD ssn to db if not exist 
    returnJsonObj.speech =await checkBillerExistSpeech(req) ; //call functin to find exact speech 
    returnJsonObj.displayText = returnJsonObj.speech; // speech and displayText have same values
    console.log("Exiting apiHandlerForLightBillInit ------>")
    var mongoResponse = logConversationHistory(req,returnJsonObj.speech);
    return res.json(returnJsonObj);
}

//init phone bill pay request; pay for phone bill
async function apiHandlerForPhoneBillInit(req,res){
    console.log("Entering apiHandlerForPhoneBillInit ------>")
    var returnJsonObj = stubResponse.PhoneBillInitResponse;
    JSON.stringify(returnJsonObj);
    var SSN = await checkSSN(req);//ADD ssn to db if not exist 
    returnJsonObj.speech = await checkBillerExistSpeech(req) ; //call functin to find exact speech 
    returnJsonObj.displayText = returnJsonObj.speech; // speech and displayText have same values
    console.log("Exiting apiHandlerForPhoneBillInit ------>")
    var mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

function apiHandlerForAddBiller(req,res){
    console.log("Entering apiHandlerForAddBiller ------>")
    var returnJsonObj = stubResponse.AddBillerResponse(req);
    JSON.stringify(returnJsonObj);
    var speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForAddBiller ------>")
    var mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}
//if user confirms to add biller => insert biller to db 
async function apiHandlerForAddBillerYes(req,res){
    var BILLERNAME = req.body.result.parameters.Billers;
    console.log("Entering apiHandlerForAddBillerYes ------>")
    var returnJsonObj = await stubResponse.AddBillerYesResponse(req);
    JSON.stringify(returnJsonObj);
    var result = await MysqlFunctions.insertBiller(req);//insert biller to db
    if(result === true){
        var speech = returnJsonObj.speech;
    }
    else{
        let speech = `Cannot Add biller ${BILLERNAME} , Already exists !`;
        returnJsonObj.speech = speech;
        returnJsonObj.displayText = speech ;
    }
    console.log("Exiting apiHandlerForAddBillerYes ------>")
    var mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

//if user cancels biller registration 
function apiHandlerForAddBillerNo(req,res){
    console.log("Entering apiHandlerForAddBillerNo ------>")
    var returnJsonObj = stubResponse.AddBillerNoResponse;
    JSON.stringify(returnJsonObj);
    var speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForAddBillerNo ------>")
    var mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

//Select particular biller and pay his bill depending on balance
async function apiHandlerForSelectBillerPayBill(req,res){
    console.log("Entering apiHandlerForSelectBillerPayBill ------>")
    var returnJsonObj = stubResponse.SelectBillerPayBillResponse;
    JSON.stringify(returnJsonObj);
    var speech = "";
    var AMT;
    //check for balance in db 
    var BALANCE = await MysqlFunctions.checkBalance(req);
    var amount = await MysqlFunctions.getAmt(req); // returns amount object containg amtdue and limitamt values
    if(amount.limitamt == 0 || (amount.limitamt > amount.amtdue)){
        AMT = amount.amtdue; // 0 means no upperlimit=> pay full due amount OR pay if limit is greater than due amount
    }
    else{
        AMT = amount.limitamt;
    }
    if(BALANCE > AMT){
        var result = await MysqlFunctions.updateBalance(req, AMT);
        speech = "Your Bill has been paid successfully.";
    }
    else{
        speech = "Oops..Cannot Pay bill due to Low Balance! ";
    }
    returnJsonObj.speech = speech;
    returnJsonObj.displayText = returnJsonObj.speech; // speech and displayText have same values
    console.log("Exiting apiHandlerForSelectBillerPayBill ------>")
    var mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}


exports.logConversationHistory = logConversationHistory;
exports.checkBillerExistSpeech = checkBillerExistSpeech;
exports.checkSSN = checkSSN;
exports.apiHandlerForBillInit = apiHandlerForBillInit;
exports.apiHandlerForGasBillInit = apiHandlerForGasBillInit;
exports.apiHandlerForLightBillInit = apiHandlerForLightBillInit;
exports.apiHandlerForPhoneBillInit = apiHandlerForPhoneBillInit;
exports.apiHandlerForAddBiller = apiHandlerForAddBiller;
exports.apiHandlerForAddBillerYes = apiHandlerForAddBillerYes;
exports.apiHandlerForAddBillerNo = apiHandlerForAddBillerNo;
exports.apiHandlerForSelectBillerPayBill = apiHandlerForSelectBillerPayBill;