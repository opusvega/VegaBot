'use strict';

console.log('Entering apiHandler...before require apihandler');

let mysql = require('mysql');
let express = require('express');
let bodyParser = require('body-parser');
let conversationHistory = require('../../../history/LogHandler.js');
let stubResponse = require("../../responsestubs/StubResponse.js");
let config = require("../../../config.js");
let MysqlFunctions = require("../../dao/mysql/MysqlFunctions.js");
let context = require("../../../context/contextHandler.js");
//let PaymentCloudFunctions = require("../../dao/paymentcloud/getATMTicketAssignment.js")
let restService = express();
restService.use(bodyParser.json());

//Log Conversation History
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


//check biller exists speech
async function checkBillerExistSpeech(req){
    let speech= "";
    //check if biller exists
    let rows = await MysqlFunctions.selectBillersToPay(req);
    if(rows.length == 0){
        //add new biller
        speech = "You have no biller registered. To Proceed you need to add a biller." 
    }
    else {
        //*******show list of those billers who have amtdue !=0 
        speech = "You have "+rows.length+" billers registered. ";
        for(let i =0;i<rows.length;i++){
            speech = speech + " "+(i+1)+")"+ rows[i].billername + " AMt due : "+ rows[i].amtdue + "Due Date : " + rows[i].duedate;
        }
        speech = speech + ". Which one do you want to pay for? You can also add another biller.";
    }
    return speech ;
}

async function checkSSN(req){
    //if ssn does not exists => add it to db
    let SSN;
    let rows = await MysqlFunctions.findSSN(req);
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
    let returnJsonObj = stubResponse.BillInitResponse;
    JSON.stringify(returnJsonObj);
    let speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForBillInit ------>")
    let mongoResponse = logConversationHistory(req, returnJsonObj.speech);
    return res.json(returnJsonObj);
}

//init gas bill pay request; pay for gas bill - start of context
async function apiHandlerForGasBillInit(req,res){
    console.log("Entering apiHandlerForGasBillInit ------>")
    let returnJsonObj = stubResponse.GasBillInitResponse;//get response from stub : empty rt now
    JSON.stringify(returnJsonObj);
    let SSN = await checkSSN(req);//ADD ssn to db if not exist 
    returnJsonObj.speech = await checkBillerExistSpeech(req) ; //call functin to find exact speech 
    returnJsonObj.displayText = returnJsonObj.speech; // speech and displayText have same values
    console.log("Exiting apiHandlerForGasBillInit ------>")
    let mongoResponse = logConversationHistory(req, returnJsonObj.speech); // save coversation to mongoDB
    context.insertContextLog(req,"select-biller-pay-bill");
    return res.json(returnJsonObj); //send response json back to client
}

//init light bill payrequest; pay for light bill - start context
async function apiHandlerForLightBillInit(req,res){
    console.log("Entering apiHandlerForLightBillInit ------>")
    let returnJsonObj = stubResponse.LightBillInitResponse;
    JSON.stringify(returnJsonObj);
    let SSN = await checkSSN(req);//ADD ssn to db if not exist 
    returnJsonObj.speech =await checkBillerExistSpeech(req) ; //call functin to find exact speech 
    returnJsonObj.displayText = returnJsonObj.speech; // speech and displayText have same values
    console.log("Exiting apiHandlerForLightBillInit ------>")
    let mongoResponse = logConversationHistory(req,returnJsonObj.speech);
    context.insertContextLog(req,"select-biller-pay-bill");
    return res.json(returnJsonObj);
}

//init phone bill pay request; pay for phone bill - start of context
async function apiHandlerForPhoneBillInit(req,res){
    console.log("Entering apiHandlerForPhoneBillInit ------>")
    let returnJsonObj = stubResponse.PhoneBillInitResponse;
    JSON.stringify(returnJsonObj);
    let SSN = await checkSSN(req);//ADD ssn to db if not exist 
    returnJsonObj.speech = await checkBillerExistSpeech(req) ; //call functin to find exact speech 
    returnJsonObj.displayText = returnJsonObj.speech; // speech and displayText have same values
    console.log("Exiting apiHandlerForPhoneBillInit ------>")
    let mongoResponse = logConversationHistory(req, speech);
    context.insertContextLog(req,"select-biller-pay-bill");
    return res.json(returnJsonObj);
}

function apiHandlerForAddBiller(req,res){
    console.log("Entering apiHandlerForAddBiller ------>")
    let returnJsonObj = stubResponse.AddBillerResponse(req);
    JSON.stringify(returnJsonObj);
    let speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForAddBiller ------>")
    let mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}
//if user confirms to add biller => insert biller to db 
async function apiHandlerForAddBillerYes(req,res){
    let speech ='';
    let BILLERNAME = req.body.result.parameters.Billers;
    console.log("Entering apiHandlerForAddBillerYes ------>")
    let returnJsonObj = await stubResponse.AddBillerYesResponse(req);
    JSON.stringify(returnJsonObj);
    let result = await MysqlFunctions.insertBiller(req);//insert biller to db
    if(result === 1){ // EARLIER was TRUE
        speech = returnJsonObj.speech;
    }
    else{
        speech = `Cannot Add biller ${BILLERNAME} , Already exists !`;
        returnJsonObj.speech = speech;
        returnJsonObj.displayText = speech ;
    }
    console.log("Exiting apiHandlerForAddBillerYes ------>")
    let mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

//if user cancels biller registration 
function apiHandlerForAddBillerNo(req,res){
    console.log("Entering apiHandlerForAddBillerNo ------>")
    let returnJsonObj = stubResponse.AddBillerNoResponse;
    JSON.stringify(returnJsonObj);
    let speech = returnJsonObj.speech;
    console.log("Exiting apiHandlerForAddBillerNo ------>")
    let mongoResponse = logConversationHistory(req, speech);
    return res.json(returnJsonObj);
}

//Select particular biller and pay his bill depending on balance
async function apiHandlerForSelectBillerPayBill(req,res){
    console.log("Entering apiHandlerForSelectBillerPayBill ------>")
    let returnJsonObj = stubResponse.SelectBillerPayBillResponse;
    JSON.stringify(returnJsonObj);
    let speech = "";
    let AMT;
    //check for balance in db 
    let BALANCE = await MysqlFunctions.checkBalance(req);
    let amount = await MysqlFunctions.getAmt(req); // returns amount object containg amtdue and limitamt values
    if(BALANCE != false || amount!= false){
        if(amount.limitamt == 0 || (amount.limitamt > amount.amtdue)){
            AMT = amount.amtdue; // 0 means no upperlimit=> pay full due amount OR pay if limit is greater than due amount
        }
        else{
            AMT = amount.limitamt;
        }
        if(BALANCE > AMT){
            let result1 = await MysqlFunctions.updateBalance(req, AMT);
            if(result1 != false){
                speech = "Your Bill has been paid successfully.";   
                returnJsonObj.speech =speech;
                returnJsonObj.displayText = speech;
            }
            else{
                speech = "We are facing some techinal issue. Please try again after some time.";
                returnJsonObj.speech =speech;
                returnJsonObj.displayText = speech;
            }
        }
        else{
            speech = "Oops..Cannot Pay bill due to Low Balance! ";
            returnJsonObj.speech =speech;
            returnJsonObj.displayText = speech;
        }

        await context.updateContextLogIntentComplete(req);
    
        let result2 = await context.selectContextLogFalseIntentComplete(req);
        console.log("#################");
        console.log(result2);
        console.log("#################");
        let concat = '';    
        if(result2.length==1 ){
            returnJsonObj = await context.cardCreate(returnJsonObj,result2);
        }
        if(result2.length > 1){
            returnJsonObj = await context.listCreate(returnJsonObj,result2);   
        }

            returnJsonObj.speech = speech;
            returnJsonObj.displayText = returnJsonObj.speech; // speech and displayText have same values
        }
   
    //ERROR HANDLING
    else{
        returnJsonObj.speech = "We are facing some techinal issue. Please try again after some time.";
        returnJsonObj.displayText = returnJsonObj.speech;
    }
        
        
    console.log("Exiting apiHandlerForSelectBillerPayBill ------>")
    let mongoResponse = logConversationHistory(req, speech);
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