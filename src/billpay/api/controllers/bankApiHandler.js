'use strict';

console.log('Entering apiHandler...before require apihandler');

//let mysql = require('mysql');
let express = require('express');
let bodyParser = require('body-parser');
let conversationHistory = require('../../../history/LogHandler.js');
let stubResponse = require("../../responsestubs/StubResponse.js");
let config = require("../../../config.js");
let MysqlFunctions = require("../../dao/mysql/MysqlFunctions.js");
let context = require("../../../context/contextHandler.js");
let globalMysqlFunctions = require("../../../mysql-functions/mysqlFunctions.js");
let numToWords = require("../../../reflookup/numToWords.js");
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

async function checkBillerExistSpeech(req,username){
  console.log("INSIDE checkBillerExistSpeech=========>");
    let billertype = req.body.result.parameters.billertype;
    let speech= "";
    //check if biller exists
    let response ;
    let billerExist = await MysqlFunctions.checkBillers(req,username);
    if(billerExist.length == 0){
      response = {
        "speech" : "You have no biller registered. To Proceed you need to add a biller.",
        "displayText" : "You have no biller registered. To Proceed you need to add a biller.",
        "source" : "Opus NLP"
      }
      
      return response;
    }
    let isBillerTypeExist = await MysqlFunctions.isBillerTypeExist(req,username);
    console.log("isBillerTypeExist.length====>",isBillerTypeExist)
    if (isBillerTypeExist.length !=0 )
    {
        let rows = await MysqlFunctions.selectBillersToPay(req,username);
        if(rows.length == 0){
            //add new biller
            response = {
              "speech" : "You have no bills pending.",
              "displayText" : "You have no bills pending.",
              "source" : "Opus NLP"
            }
            
            return response;
        }
        else{
          let billertype = req.body.result.parameters.billertype;
          //list
          if(rows.length == 1){
            response = JSON.parse(JSON.stringify(await stubResponse.cardTemplateResponse));  
            console.log("INSIDE cardTemplateResponse=======>",rows.length);
          }
          else{
            response = JSON.parse(JSON.stringify(await stubResponse.listTemplateResponse));  

            console.log("INSIDE listTemplateResponse=======>",rows.length);
          }
          //push result row to elements
          response.messages[1].payload.facebook.attachment.payload.elements = [];
          response.messages[0].speech = `I have found following billers for ${billertype} whose bills are pending. Select your biller.`;
          response.speech = `I have found following billers for ${billertype} whose bills are pending.`;
          for(let i=0;i<4 && i<rows.length ;i++){
            response.speech += `${numToWords.numToWords[i+1]} is ${rows[i].billername} whose customer I.D. is ${rows[i].custbillerid} with amount due ${rows[i].amtdue}. `;
            let elementsObj = {};
            elementsObj.buttons = [];
            let button = {
                "title": "Proceed",
                "type": "postback",
                "payload": rows[i].custbillerid
                }
            elementsObj.title = rows[i].billername;
            elementsObj.subtitle = `CID : ${rows[i].custbillerid}
            Biller Type : ${rows[i].billertype}
            Amount Due : ${rows[i].amtdue}`;
            elementsObj.buttons.push(button);
            response.messages[1].payload.facebook.attachment.payload.elements.push(elementsObj);
            console.log(elementsObj);
          }
          response.speech += `Please state the customer I.D. whose bill you want to pay.`
          response.displayText = response.speech;
          console.log(response);
          return response;
        }
    }
    else{
      response = {
              "speech" : "You have no "+billertype+" biller registered. Please add one to proceed.",
              "displayText" : "You have no "+billertype+" biller registered. Please add one to proceed.",
              "source" : "Opus NLP"
            }
            
            return response;
    }
    
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
    //  get username for session id
    let username = await globalMysqlFunctions.getUsername(req);
    console.log("inside apiHandlerForGasBillInit========>",username);

    returnJsonObj = await checkBillerExistSpeech(req,username); //call functin to find exact speech
    console.log("inside apiHandlerForGasBillInit========>",returnJsonObj);    
    console.log("Exiting apiHandlerForGasBillInit ------>")
    let mongoResponse = logConversationHistory(req, returnJsonObj.speech); // save coversation to mongoDB
    context.insertContextLog(req,"select-biller-pay-bill");
    return res.json(returnJsonObj); //send response json back to client
}
//init light bill payrequest; pay for light bill - start context
async function apiHandlerForPowerBillInit(req,res){
    console.log("Entering apiHandlerForPowerBillInit ------>")
    let returnJsonObj = stubResponse.LightBillInitResponse;
    JSON.stringify(returnJsonObj);
    let username = await globalMysqlFunctions.getUsername(req);
    returnJsonObj = await checkBillerExistSpeech(req,username);
    console.log("Exiting apiHandlerForPowerBillInit ------>")
    let mongoResponse = logConversationHistory(req,returnJsonObj.speech);
    context.insertContextLog(req,"select-biller-pay-bill");
    return res.json(returnJsonObj);
}

//init phone bill pay request; pay for phone bill - start of context
async function apiHandlerForPhoneBillInit(req,res){
    console.log("Entering apiHandlerForPhoneBillInit ------>")
    let returnJsonObj = stubResponse.PhoneBillInitResponse;
    JSON.stringify(returnJsonObj);
    let username = await globalMysqlFunctions.getUsername(req);
    let response = await checkBillerExistSpeech(req,username);
    console.log("Exiting apiHandlerForPhoneBillInit ------>");
    console.log(response);
    let speech = response.speech;
    let mongoResponse = logConversationHistory(req, speech);
    context.insertContextLog(req,"select-biller-pay-bill");
    return res.json(response);
}

async function apiHandlerForAddBillerGasPower(req,res){
  console.log("Entering apiHandlerForAddBillerGasPower ------>")
  let returnJsonObj = stubResponse.AddBillerGasPowerResponse;
  JSON.stringify(returnJsonObj);
  console.log("Exiting apiHandlerForAddBillerGasPower ------>")
  let speech = returnJsonObj.speech;
  let mongoResponse = logConversationHistory(req, speech);
  return res.json(returnJsonObj);
}

async function apiHandlerForAddBillerGetState(req,res){
  console.log("Entering apiHandlerForAddBillerGetState ------>");
  let state = req.body.result.parameters.state;
  let billertype = req.body.result.parameters.billertype;
  let returnJsonObj = await stubResponse.AddBillerGetStateResponse(req);
  JSON.stringify(returnJsonObj);
  let response;
  //show list of available billers
  let result = await MysqlFunctions.getBillers(req);
  if(result.length == 1){
      response = stubResponse.cardTemplateResponse;
      response.speech = `I have found a ${result[0].billername} for ${billertype} in ${state}. Please state the biller name to proceed.`;
      response.displayText = response.speech;

      //push result row to elements
      response.messages[0].speech = `I have found a biller for ${billertype} in ${state}`;
      let elementsObj = {};
      elementsObj.buttons =[];
      elementsObj.title = result[0].billername; // BILLERNAME
      let button = {
          "title": "Proceed",
          "type": "postback",
          "payload": result[0].billername
          }
      elementsObj.buttons.push(button);
      response.messages[1].payload.facebook.attachment.payload.elements.push(elementsObj);
    }

    if(result.length > 1){
      response = stubResponse.listTemplateResponse;
      response.speech = `I have found following billers for ${billertype} in ${state}.`;
      //push result row to elements
      response.messages[1].payload.facebook.attachment.payload.elements = [];
      response.messages[0].speech = `I have found following billers for ${billertype} in ${state}. Select your biller.`;
      for(let i=0;i<4 && i< result.length;i++){
        response.speech += `${numToWords.numToWords[i+1]} is ${result[i].billername}.`;
        let elementsObj = {};
        elementsObj.buttons = [];
        let button = {
            "title": "Proceed",
            "type": "postback",
            "payload": result[i].billername
            }
        elementsObj.title = result[i].billername;
        elementsObj.buttons.push(button);
        response.messages[1].payload.facebook.attachment.payload.elements.push(elementsObj);
        console.log(elementsObj);
      }
      response.speech += `Please state the biller name to proceed.`;
      response.displayText = response.speech;
    }
  console.log("Exiting apiHandlerForAddBillerGetState ------>")
  let mongoResponse = logConversationHistory(req,  response.messages[0].speech);
  return res.json(response);
}
async function apiHandlerForAddBillerGetBiller(req,res){
  console.log("Entering apiHandlerForAddBillerGetBiller ------>")
  let returnJsonObj = stubResponse.AddBillerGetBillerResponse(req);//get response from stub : empty rt now
  JSON.stringify(returnJsonObj);
  console.log("Exiting apiHandlerForAddBillerGetBiller ------>")
  let mongoResponse = logConversationHistory(req, returnJsonObj.speech); // save coversation to mongoDB
  return res.json(returnJsonObj); //send response json back to client
}

async function apiHandlerForAddBillerGasPowerYes(req,res){
  console.log("Entering apiHandlerForAddBillerGasPowerYes ------>")
  let returnJsonObj = stubResponse.AddBillerGasPowerYes(req);
  JSON.stringify(returnJsonObj);
  let username = await globalMysqlFunctions.getUsername(req);
  let result = await MysqlFunctions.insertNewBiller(req,username);
  if(result == false){
    returnJsonObj.speech = "This biller already exists.";
    returnJsonObj.displayText = returnJsonObj.speech;  
  }
  console.log("inside apiHandlerForAddBillerGasPowerYes=============>",result);  
  let speech = returnJsonObj.speech;
  console.log("Exiting apiHandlerForAddBillerGasPowerYes ------>")
  let mongoResponse = logConversationHistory(req, speech);
  let resultContext = await context.selectContextLogFalseIntentComplete(req);
        // console.log("#################");
        // console.log(resultContext);
        // console.log("#################");
        if(resultContext.length==1 ){
            returnJsonObj = await context.cardCreate(returnJsonObj,resultContext);
        }
        if(resultContext.length > 1){
            returnJsonObj = await context.listCreate(returnJsonObj,resultContext);   
        }
  return res.json(returnJsonObj);
}

async function apiHandlerForAddBillerGasPowerNo(req,res){
  console.log("Entering apiHandlerForAddBillerGasPowerNo ------>")
  let returnJsonObj = stubResponse.AddBillerGasPowerNo;
  JSON.stringify(returnJsonObj);
  //show list of available billers
  let speech = returnJsonObj.speech;
  console.log("Exiting apiHandlerForAddBillerGasPowerNo ------>")
  let mongoResponse = logConversationHistory(req, speech);
  let resultContext = await context.selectContextLogFalseIntentComplete(req);
        // console.log("#################");
        // console.log(resultContext);
        // console.log("#################");
        if(resultContext.length==1 ){
            returnJsonObj = await context.cardCreate(returnJsonObj,resultContext);
        }
        if(resultContext.length > 1){
            returnJsonObj = await context.listCreate(returnJsonObj,resultContext);   
        }
  return res.json(returnJsonObj);
}

async function apiHandlerForAddPhoneBiller(req,res){
  console.log("Entering apiHandlerForAddPhoneBiller ------>")
  let returnJsonObj = stubResponse.AddPhoneBiller;
  JSON.stringify(returnJsonObj);
  //show list of available billers
  let speech = returnJsonObj.speech;
  console.log("Exiting apiHandlerForAddPhoneBiller ------>")
  let mongoResponse = logConversationHistory(req, speech);
  return res.json(returnJsonObj);

}

async function apiHandlerForAddPhoneBillerGetProvider(req,res){
  console.log("Entering apiHandlerForAddPhoneBillerGetProvider ------>")
  let returnJsonObj = stubResponse.AddPhoneBillerGetProvider;
  JSON.stringify(returnJsonObj);
  let billertype = req.body.result.parameters.billertype;
  //show list of available billers
  let result = await MysqlFunctions.getPhoneBillers(req);
  var response ;
  response = await stubResponse.listTemplateResponse;
      //push result row to elements
      response.messages[1].payload.facebook.attachment.payload.elements = [];
      response.messages[0].speech = `I have found following billers for ${billertype}. Select your biller.`;
      for(let i=0;i<4;i++){
        let elementsObj = {};
        elementsObj.buttons = [];
        var button = {
            "title": "Proceed",
            "type": "postback",
            "payload": result[i].billername
            }
        elementsObj.title = result[i].billername;
        elementsObj.buttons.push(button);
        response.messages[1].payload.facebook.attachment.payload.elements.push(elementsObj);
        console.log(elementsObj);
        console.log(response.messages[1].payload.facebook.attachment.payload.elements);
      }
  let speech = `I have found following billers for ${billertype}. Select your biller.`;
  console.log("Exiting apiHandlerForAddPhoneBillerGetProvider ------>")
  let mongoResponse = logConversationHistory(req, speech);
  return res.json(response);
}

async function apiHandlerForAddPhoneBillerGetBiller(req,res){
  console.log("Entering apiHandlerForAddPhoneBillerGetBiller ------>");
  console.log(req);
  let returnJsonObj = await stubResponse.AddPhoneBillerGetBiller(req);
  JSON.stringify(returnJsonObj);
  let speech = returnJsonObj.speech;
  console.log("Exiting apiHandlerForAddPhoneBillerGetBiller ------>")
  let mongoResponse = logConversationHistory(req, speech);
  return res.json(returnJsonObj);

}

async function apiHandlerForAddPhoneBillerGetBillerYes(req,res){
  //Insert
  console.log("Entering apiHandlerForAddBillerGasPowerYes ------>")
  let returnJsonObj = stubResponse.AddPhoneBillerGetBillerYes(req);
  JSON.stringify(returnJsonObj);
  let username = await globalMysqlFunctions.getUsername(req);
  let result = await MysqlFunctions.insertNewBiller(req,username);
  if(result == false){
    returnJsonObj.speech = "This biller already exists.";
    returnJsonObj.displayText = returnJsonObj.speech;  
  }
  console.log("inside apiHandlerForAddPhoneBillerGetBillerYes=============>",result);  
  let speech = returnJsonObj.speech;
  console.log("Exiting apiHandlerForAddPhoneBillerGetBillerYes ------>")
  let mongoResponse = logConversationHistory(req, speech);
  return res.json(returnJsonObj);

}

async function apiHandlerForAddPhoneBillerGetBillerNo(req,res){
  console.log("Entering apiHandlerForAddPhoneBillerGetBillerNo ------>")
  let returnJsonObj = stubResponse.AddPhoneBillerGetBillerNo;
  JSON.stringify(returnJsonObj);
  let speech = returnJsonObj.speech;
  console.log("Exiting apiHandlerForAddPhoneBillerGetBillerNo ------>")
  let mongoResponse = logConversationHistory(req, speech);
  return res.json(returnJsonObj);
}

async function apiHandlerForSelectBillerPayBill(req,res){
  console.log("Entering apiHandlerForSelectBillerPayBill ------>")
  let returnJsonObj = JSON.parse(JSON.stringify(await stubResponse.selectBillerPayBill));
  let result = await MysqlFunctions.getDetailsOfCustomer(req);
  console.log(result);
  let username = await globalMysqlFunctions.getUsername(req);
  let balance = await MysqlFunctions.getBalanceOfCustomer(username);
  console.log(balance);
  if(result.amount > balance){
    returnJsonObj.speech = "You don't have the balance to pay the bill. Your current account balance is $"+balance+".";
    returnJsonObj.displayText = returnJsonObj.speech;
  }
  else{
    await MysqlFunctions.updateCustomerBalance(result.amtdue, username);
    await MysqlFunctions.updateAmountDue(req);
    returnJsonObj.speech = "Your bill towards "+result.billername+" of amount $"+result.amtdue+" has been paid successfully.";
    returnJsonObj.displayText = returnJsonObj.speech; 
  }
  let speech = returnJsonObj.speech;
  console.log("Exiting apiHandlerForAddPhoneBillerGetBillerNo ------>")
  let mongoResponse = logConversationHistory(req, speech);

  let updateContextLogIntentCompleteValue = await context.updateContextLogIntentComplete(req);

  if(updateContextLogIntentCompleteValue != false){
      console.log("updateContextLogIntentComplete SUCCESSFULL");
      let result = await context.selectContextLogFalseIntentComplete(req);
      // console.log("#################");
      // console.log(result);
      // console.log("#################");
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

exports.apiHandlerForBillInit = apiHandlerForBillInit;
exports.apiHandlerForPhoneBillInit = apiHandlerForPhoneBillInit;
exports.apiHandlerForPowerBillInit = apiHandlerForPowerBillInit;
exports.apiHandlerForGasBillInit = apiHandlerForGasBillInit;
exports.apiHandlerForAddBillerGasPower = apiHandlerForAddBillerGasPower;
exports.apiHandlerForAddBillerGetState = apiHandlerForAddBillerGetState;
exports.apiHandlerForAddBillerGetBiller = apiHandlerForAddBillerGetBiller;
exports.apiHandlerForAddBillerGasPowerYes = apiHandlerForAddBillerGasPowerYes;
exports.apiHandlerForAddBillerGasPowerNo = apiHandlerForAddBillerGasPowerNo;
exports.apiHandlerForAddPhoneBillerGetProvider = apiHandlerForAddPhoneBillerGetProvider;
exports.apiHandlerForAddPhoneBiller = apiHandlerForAddPhoneBiller;
exports.apiHandlerForAddPhoneBillerGetBiller = apiHandlerForAddPhoneBillerGetBiller;
exports.apiHandlerForAddPhoneBillerGetBillerYes = apiHandlerForAddPhoneBillerGetBillerYes;
exports.apiHandlerForAddPhoneBillerGetBillerNo = apiHandlerForAddPhoneBillerGetBillerNo;
exports.apiHandlerForSelectBillerPayBill = apiHandlerForSelectBillerPayBill;