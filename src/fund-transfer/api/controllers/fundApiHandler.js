'use strict'
const mysqlFunctions = require('../../dao/mysql/mysqlFunctions.js');
const stubResponse = require('../../responsestub/stubResponse.js');
const conversationHistory = require('../../../history/LogHandler.js');
const util = require('../../utility/util.js');

//log conversation history
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

//api handler for "transfer-init" intent
async function apiHandlerForTransferInit(req,res){
	console.log('Entering apiHandlerForTransferInit=============>');
	var returnJsonObj = await stubResponse.TransferInit;
	JSON.stringify(returnJsonObj);

	//Check if user has any registered payee
	const flag = await mysqlFunctions.isCustomerPayeeListNull(req); // username shall be fetched from FACEBOOK
	if (flag == false){
		returnJsonObj.speech = 'You have no payee registered in your account. Please add one for initiating the fund transfer';
		returnJsonObj.displayText = returnJsonObj.speech;
	}
    const speech = returnJsonObj.speech;
	const mongoResponse = logConversationHistory(req, returnJsonObj.speech);
    console.log('Exiting apiHandlerForTransferInit=============>');
    return res.json(returnJsonObj);
}

//api handler for "transfer-get-payee" iutent 
async function apiHandlerForTransferGetPayee(req,res){
	const payee = req.body.result.parameters.payee;
	console.log('Entering apiHandlerForTransferGetPayee==========>');
	const returnJsonObj = await stubResponse.TransferGetPayee(req);
	JSON.stringify(returnJsonObj);
	var result = await mysqlFunctions.isGetPayeeExist(req);
	if(result.length == 0){
		returnJsonObj.speech = returnJsonObj.displayText = `There is no ${payee} registered in your account.
															Make sure you have entered correctly or go for adding new payee.` ;
	}
	if(result.length >= 1){
		const fbResponse = await util.payeeList(result);
		returnJsonObj.messages.push(fbResponse);
	}
	console.log("response >>>> " + JSON.stringify(returnJsonObj));
	const speech = returnJsonObj.speech;
	const mongoResponse = logConversationHistory(req, returnJsonObj.speech);
	console.log('Exiting apiHandlerForTransferGetPayee==========>');
	return res.json(returnJsonObj);
}

//api handler for "transfer-get-amount" intent
async function apiHandlerForTransferGetAmount(req,res){
	console.log("Entering apiHandlerForTransferGetAmount========>");
	const returnJsonObj = await stubResponse.TransferGetAmount(req);
	JSON.stringify(returnJsonObj);
	const speech = returnJsonObj.speech;
	const mongoResponse = logConversationHistory(req, returnJsonObj.speech);
	console.log("Exiting apiHandlerForTransferGetAmount========>");
	return res.json(returnJsonObj);
}

//api handler for "transfer-get-otp" intent
async function apiHandlerForTransferGetOtp(req,res){
	console.log("Entering apiHandlerForTransferGetOtp==========>");
	const returnJsonObj = await stubResponse.TransferGetOtp(req);
	JSON.stringify(returnJsonObj);
	const speech = returnJsonObj.speech;
	const mongoResponse = logConversationHistory(req, returnJsonObj.speech);
	console.log("Exiting apiHandlerForTransferGetOtp==========>");
	return res.json(returnJsonObj);
}

//api handler for "transfer-get-payee-amount" intent
async function apiHandlerForTransferGetPayeeAmount(req,res){
	console.log("Entering apiHandlerForTransferGetPayeeAmount==========>");
	const returnJsonObj = await stubResponse.TransferGetAmount(req);
	JSON.stringify(returnJsonObj);
	const speech = returnJsonObj.speech;
	const mongoResponse = logConversationHistory(req, returnJsonObj.speech);
	console.log("Exiting apiHandlerForTransferGetPayeeAmount==========>");
	return res.json(returnJsonObj);
}

//api handler for "add-payee-init" intent
async function apiHandlerForAddPayeeInit(req,res){
	console.log("Entering apiHandlerForAddPayeeInit==========>");
	const returnJsonObj = await stubResponse.AddPayeeInit;
	JSON.stringify(returnJsonObj);
	const speech = returnJsonObj.speech;
	const mongoResponse = logConversationHistory(req, returnJsonObj.speech);
	console.log("Exiting apiHandlerForAddPayeeInit==========>");
	return res.json(returnJsonObj);
}

//api handler for "add-payee-get-payeename" intent
async function apiHandlerForAddPayeeGetPayeename(req,res){
	console.log("Entering apiHandlerForAddPayeeGetPayeename==========>");
	const returnJsonObj = await stubResponse.AddPayeeGetPayeename(req);
	JSON.stringify(returnJsonObj);
	const speech = returnJsonObj.speech;
	const mongoResponse = logConversationHistory(req, returnJsonObj.speech);
	console.log("Exiting apiHandlerForAddPayeeGetPayeename==========>");
	return res.json(returnJsonObj);
}

//api handler for "add-payee-get-nickname" intent
async function apiHandlerForAddPayeeGetNickname(req,res){
	console.log("Entering apiHandlerForAddPayeeGetNickname==========>");
	const returnJsonObj = await stubResponse.AddPayeeGetNickname(req);
	JSON.stringify(returnJsonObj);
	const speech = returnJsonObj.speech;
	const mongoResponse = logConversationHistory(req, returnJsonObj.speech);
	console.log("Exiting apiHandlerForAddPayeeGetNickname==========>");
	return res.json(returnJsonObj);
}

//api handler for "add-payee-get-bankname" intent
async function apiHandlerForAddPayeeGetBankname(req,res){
	console.log("Entering apiHandlerForAddPayeeGetBankname==========>");
	const returnJsonObj = await stubResponse.AddPayeeGetBankname(req);
	JSON.stringify(returnJsonObj);
	const speech = returnJsonObj.speech;
	const mongoResponse = logConversationHistory(req, returnJsonObj.speech);
	console.log("Exiting apiHandlerForAddPayeeGetBankname==========>");
	return res.json(returnJsonObj);
}

//api handler for "add-payee-get-accountnumber" intent
async function apiHandlerForAddPayeeGetAccountnumber(req,res){
	console.log("Entering apiHandlerForAddPayeeGetAccountnumber==========>");
	const returnJsonObj = await stubResponse.AddPayeeGetAccountnumber(req);
	JSON.stringify(returnJsonObj);
	const speech = returnJsonObj.speech;
	const mongoResponse = logConversationHistory(req, returnJsonObj.speech);
	console.log("Exiting apiHandlerForAddPayeeGetAccountnumber==========>");
	return res.json(returnJsonObj);
}

//api handler for "add-payee-get-routingnumber" intent
async function apiHandlerForAddPayeeGetRoutingnumber(req,res){
	console.log("Entering apiHandlerForAddPayeeGetRoutingnumber==========>");
	const returnJsonObj = await stubResponse.AddPayeeGetRoutingnumber(req);
	JSON.stringify(returnJsonObj);
	const speech = returnJsonObj.speech;
	const mongoResponse = logConversationHistory(req, returnJsonObj.speech);
	console.log("Exiting apiHandlerForAddPayeeGetRoutingnumber==========>");
	return res.json(returnJsonObj);
}

//exporing all apiHandler functions
exports.apiHandlerForTransferInit = apiHandlerForTransferInit;
exports.apiHandlerForTransferGetPayee = apiHandlerForTransferGetPayee;
exports.apiHandlerForTransferGetAmount = apiHandlerForTransferGetAmount;
exports.apiHandlerForTransferGetOtp = apiHandlerForTransferGetOtp;
exports.apiHandlerForAddPayeeInit = apiHandlerForAddPayeeInit;
exports.apiHandlerForAddPayeeGetPayeename = apiHandlerForAddPayeeGetPayeename;
exports.apiHandlerForAddPayeeGetNickname = apiHandlerForAddPayeeGetNickname;
exports.apiHandlerForAddPayeeGetBankname = apiHandlerForAddPayeeGetBankname;
exports.apiHandlerForAddPayeeGetAccountnumber = apiHandlerForAddPayeeGetAccountnumber;
exports.apiHandlerForAddPayeeGetRoutingnumber = apiHandlerForAddPayeeGetRoutingnumber;