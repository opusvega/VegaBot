'use strict'
let mysqlFunctions = require('../../dao/mysql/mysqlFunctions.js');
let stubResponse = require('../../responsestub/stubResponse.js');
let conversationHistory = require('../../../history/LogHandler.js');
let util = require('../../utility/util.js');
let config = require("../../../config.js");

let context = require("../../../context/contextHandler.js");
let intentNameLookup = require("../../../reflookup/IntentNames.js");

let otp = require("../../../one-time-password/otp.js");

//log conversation history
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

//api handler for "transfer-init" intent - start of context
async function apiHandlerForTransferInit(req,res){
	console.log('Entering apiHandlerForTransferInit=============>');
	let returnJsonObj = await stubResponse.TransferInit;
	JSON.stringify(returnJsonObj);
	console.log(returnJsonObj);
	//Check if user has any registered payee
	let flag = await mysqlFunctions.isCustomerPayeeListNull(req); // username shall be fetched from FACEBOOK
	console.log("FLAG--------->",flag);
	//ERROR HANDLING
	if(flag === false){
		returnJsonObj.speech = "We are facing some techinal issue. Please try again after some time.";
		returnJsonObj.displayText = returnJsonObj.speech;
	
	}
	else{
		if (flag === 0){
			returnJsonObj.speech = 'You have no payee registered in your account. Please add one for initiating the fund transfer';
			returnJsonObj.displayText = returnJsonObj.speech;
		}
	}
	
    let speech = returnJsonObj.speech;
	let mongoResponse = logConversationHistory(req, returnJsonObj.speech);
    console.log('Exiting apiHandlerForTransferInit=============>');
    await context.insertContextLog(req,"transfer-get-otp");
    return res.json(returnJsonObj);
}

//api handler for "transfer-get-payee" intent 
async function apiHandlerForTransferGetPayee(req,res){
	let payee = req.body.result.parameters.payee;
	console.log('Entering apiHandlerForTransferGetPayee==========>');
	let returnJsonObj = await stubResponse.TransferGetPayee(req);
	JSON.stringify(returnJsonObj);
	let result = await mysqlFunctions.isGetPayeeExist(req);
	if(result != false){
		if(result.length == 0){
			returnJsonObj.speech = returnJsonObj.displayText = `There is no ${payee} registered in your account.
																Make sure you have entered correctly or go for adding new payee.` ;
		}
		if(result.length == 1){
			returnJsonObj = await util.payeeList(result,returnJsonObj);
			returnJsonObj.messages[0].payload.facebook.attachment.payload.template_type = "generic";
			console.log("Length of payee list is equal to 1");
		}
		if(result.length >1){
			returnJsonObj = await util.payeeList(result,returnJsonObj);
			returnJsonObj.messages[0].payload.facebook.attachment.payload.template_type = "list";
			returnJsonObj.messages[0].payload.facebook.attachment.payload.top_element_style = "compact";
			console.log("Length of payee list is greater than 1");
		}
	}
	//ERROR HANDLING
	else{
		returnJsonObj.speech = "We are facing some techinal issue. Please try again after some time.";
		returnJsonObj.displayText = returnJsonObj.speech;
	}

	console.log("response >>>> " + JSON.stringify(returnJsonObj));
	let speech = returnJsonObj.speech;
	let mongoResponse = logConversationHistory(req, returnJsonObj.speech);
	console.log('Exiting apiHandlerForTransferGetPayee==========>');
	return res.json(returnJsonObj);
}

//api handler for "transfer-get-uid" intent
async function apiHandlerForTransferGetUid(req,res){
	console.log("Entering apiHandlerForTransferGetUid========>");
	let result = await mysqlFunctions.getTransferDetails(req);
	let returnJsonObj = await stubResponse.TransferGetUid(result.payeename);
	JSON.stringify(returnJsonObj);
	let speech = returnJsonObj.speech;
	let mongoResponse = logConversationHistory(req, returnJsonObj.speech);
	console.log("Exiting apiHandlerForTransferGetUid========>");
	return res.json(returnJsonObj);
}


//api handler for "transfer-get-amount" intent
async function apiHandlerForTransferGetAmount(req,res){
	console.log("Entering apiHandlerForTransferGetAmount========>");
	let sendAmount = req.body.result.parameters.amount.currency.amount;
	let returnJsonObj = await stubResponse.TransferGetAmount(req);
	JSON.stringify(returnJsonObj);
	let balance = await mysqlFunctions.checkBalance(req);
	if (balance!=false){
		if(balance<sendAmount){
			returnJsonObj.speech = "You have insufficient balance to do this transaction. Your current account balance is $"+balance;
			returnJsonObj.displayText = returnJsonObj.speech;
		}
		else{
			let contact = await mysqlFunctions.getContact(req);
			let otpCode = await otp.sendOtp(contact);
			await mysqlFunctions.updateOTPCode(otpCode,req);
			let lastDigit = String(contact).substr(-4);
			returnJsonObj.speech = `We have sent an OTP to your registered mobile ******${lastDigit}. Enter it when you receive it`;
			returnJsonObj.displayText = returnJsonObj.speech;
		}
	}
	//ERROR HANDLING
	else{
		returnJsonObj.speech = "We are facing some techinal issue. Please try again after some time.";
		returnJsonObj.displayText = returnJsonObj.speech;
	}
	let speech = returnJsonObj.speech;
	let mongoResponse = logConversationHistory(req, returnJsonObj.speech);
	console.log("Exiting apiHandlerForTransferGetAmount========>");
	return res.json(returnJsonObj);
}

//api handler for "transfer-get-otp" intent - end of context
async function apiHandlerForTransferGetOtp(req,res){
	let otp =req.body.result.parameters.otp;
	console.log("Entering apiHandlerForTransferGetOtp==========>");
	let payeeDetails = await mysqlFunctions.getTransferDetails(req); 
	let resultOtpValid = await mysqlFunctions.isOTPValid(otp,req);
	let returnJsonObj = await stubResponse.TransferGetOtp(req,payeeDetails.payeename);
	JSON.stringify(returnJsonObj);
	if(resultOtpValid == true){
		await mysqlFunctions.insertFundTransfer(req);
		await mysqlFunctions.updateBalance(req);
	}
	else{
		returnJsonObj.speech = `Your OTP was incorrect. Please try again.`;
		returnJsonObj.displayText = returnJsonObj.speech;
	}
	let speech = returnJsonObj.speech;
	let mongoResponse = logConversationHistory(req, returnJsonObj.speech);
	//add end context code
	let updateContextLogIntentCompleteValue = await context.updateContextLogIntentComplete(req);

	if(updateContextLogIntentCompleteValue != false){
        console.log("updateContextLogIntentComplete SUCCESSFULL");
        let result = await context.selectContextLogFalseIntentComplete(req);
        console.log("#################");
        console.log(result);
        console.log("#################");
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
	console.log("Exiting apiHandlerForTransferGetOtp==========>");
	return res.json(returnJsonObj);
}

//api handler for "transfer-get-payee-amount" intent
async function apiHandlerForTransferGetPayeeAmount(req,res){
	console.log("Entering apiHandlerForTransferGetPayeeAmount==========>");
	let contact = await mysqlFunctions.getContact(req);
	let lastDigit = String(contact).substr(-4);
	let returnJsonObj = await stubResponse.TransferGetAmount(lastDigit);
	JSON.stringify(returnJsonObj);
	let speech = returnJsonObj.speech;
	let mongoResponse = logConversationHistory(req, returnJsonObj.speech);
	console.log("Exiting apiHandlerForTransferGetPayeeAmount==========>");
	return res.json(returnJsonObj);
}

//api handler for "add-payee-init" intent - start of context
async function apiHandlerForAddPayeeInit(req,res){
	console.log("Entering apiHandlerForAddPayeeInit==========>");
	let returnJsonObj = await stubResponse.AddPayeeInit;
	JSON.stringify(returnJsonObj);
	let speech = returnJsonObj.speech;
	let mongoResponse = logConversationHistory(req, returnJsonObj.speech);
	console.log("Exiting apiHandlerForAddPayeeInit==========>");
	context.insertContextLog(req,"add-payee-get-routingnumber");
	return res.json(returnJsonObj);
}

//api handler for "add-payee-get-payeename" intent
async function apiHandlerForAddPayeeGetPayeename(req,res){
	console.log("Entering apiHandlerForAddPayeeGetPayeename==========>");
	let returnJsonObj = await stubResponse.AddPayeeGetPayeename(req);
	JSON.stringify(returnJsonObj);
	let speech = returnJsonObj.speech;
	let mongoResponse = logConversationHistory(req, returnJsonObj.speech);
	console.log("Exiting apiHandlerForAddPayeeGetPayeename==========>");
	return res.json(returnJsonObj);
}

//api handler for "add-payee-get-nickname" intent
async function apiHandlerForAddPayeeGetNickname(req,res){
	console.log("Entering apiHandlerForAddPayeeGetNickname==========>");
	let returnJsonObj = await stubResponse.AddPayeeGetNickname(req);
	JSON.stringify(returnJsonObj);
	let speech = returnJsonObj.speech;
	let mongoResponse = logConversationHistory(req, returnJsonObj.speech);
	console.log("Exiting apiHandlerForAddPayeeGetNickname==========>");
	return res.json(returnJsonObj);
}

//api handler for "add-payee-get-bankname" intent
async function apiHandlerForAddPayeeGetBankname(req,res){
	console.log("Entering apiHandlerForAddPayeeGetBankname==========>");
	let returnJsonObj = await stubResponse.AddPayeeGetBankname(req);
	JSON.stringify(returnJsonObj);
	let speech = returnJsonObj.speech;
	let mongoResponse = logConversationHistory(req, returnJsonObj.speech);
	console.log("Exiting apiHandlerForAddPayeeGetBankname==========>");
	return res.json(returnJsonObj);
}

//api handler for "add-payee-get-accountnumber" intent
async function apiHandlerForAddPayeeGetAccountnumber(req,res){
	console.log("Entering apiHandlerForAddPayeeGetAccountnumber==========>");
	let returnJsonObj = await stubResponse.AddPayeeGetAccountnumber(req);
	JSON.stringify(returnJsonObj);
	let speech = returnJsonObj.speech;
	let mongoResponse = logConversationHistory(req, returnJsonObj.speech);
	console.log("Exiting apiHandlerForAddPayeeGetAccountnumber==========>");
	return res.json(returnJsonObj);
}

//api handler for "add-payee-get-routingnumber" intent - end of context
async function apiHandlerForAddPayeeGetRoutingnumber(req,res){
	console.log("Entering apiHandlerForAddPayeeGetRoutingnumber==========>");
	let returnJsonObj = await stubResponse.AddPayeeGetRoutingnumber(req);
	JSON.stringify(returnJsonObj);
	//INSERT QUERY
	let result = await mysqlFunctions.insertPayee(req);
	if (result ==  false){
		returnJsonObj.speech = "This payee already exists.";
		returnJsonObj.displayText = returnJsonObj.speech;
	}

	let speech = returnJsonObj.speech;
	let mongoResponse = logConversationHistory(req, returnJsonObj.speech);

	//add end context code
	let updateContextLogIntentCompleteValue = await context.updateContextLogIntentComplete(req);

	if(updateContextLogIntentCompleteValue != false){
        console.log("updateContextLogIntentComplete SUCCESSFULL");
        let result = await context.selectContextLogFalseIntentComplete(req);
        console.log("#################");
        console.log(result);
        console.log("#################");
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
exports.apiHandlerForTransferGetUid = apiHandlerForTransferGetUid;