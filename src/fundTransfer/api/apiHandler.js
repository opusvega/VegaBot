const stubResponse = require("../stubResponse/stubResponse");
const mongoHandler = require("../mongoDb/mongoHandler");
const log = console.log;
const Client = require("node-rest-client").Client;
const client = new Client();
const hostUrl = "https://apisandbox.openbankproject.com/"
const nodeMailer = require("../../node-mailer/index");
async function generateOpenBankToken(sessionId){

	try{
		log("inside generateOpenBankToken=======?>");
		let token;
		let result = await mongoHandler.getUserDetails(sessionId);
		let password = result.password;
		let username = result.username;
		log("DirectLogin username = "+username+", password = "+password+", consumer_key = 0zexlchainswyghkpfvsk0jk3w2rica1s5yjv1rg");
		let args = {
			data : {},
			headers : {
				"Content-Type" : "application/json",
				"Authorization" : "DirectLogin username = "+username+", password = "+password+", consumer_key = 0zexlchainswyghkpfvsk0jk3w2rica1s5yjv1rg"
			}
		}
		return new Promise(function(resolve,reject){
			client.post(hostUrl+"my/logins/direct",args, async function (data, response){
				token = data.token;
				log(token);
				await mongoHandler.updateToken(username, token);
				resolve(token);
			});
		});	

	}catch(error){
		log(error);
	}
}

module.exports.apiHandlerForWelcomeIntent  = async (req,res) =>{

	try{
		let result = await mongoHandler.isUserLogedIn(req);
		if(result === true){
			let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForWelcomeIntent));
			res.json(returnJsonObject);
		}
		else{
			let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForLoginIntent));
			res.json(returnJsonObject);
		}
	}
	catch(error){
		let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForError));
		res.json(returnJsonObject);
	}
}

module.exports.apiHandlerForUserLoginIntent = async (req,res) =>{

	try{
		log("inside apiHandlerForUserLoginIntent");
		let result = await mongoHandler.isUserValid(req);
		if(result ===true){
			let sessionId = req.body.sessionId;
			await mongoHandler.userLogin(req);
			let token = await generateOpenBankToken(sessionId);
			let username = req.body.result.parameters.username;
			let user = await mongoHandler.getUsername(username);
			let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForLoginIntent(user)));
			res.json(returnJsonObject);
		}
	}
	catch(error){
		log(error);
		let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForError));
		res.json(returnJsonObject);
	}
	
}

module.exports.apiHandlerForUserLogoutIntent = async (req,res) =>{
	try{
		let sessionId = req.body.sessionId;
		let user = await mongoHandler.getUserDetails(sessionId);
		let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForLogoutIntent));
		let contextArray = req.body.result.contexts;
		let transactionsArray = await transactionGetRequest(user.token, user.bankDetails[0].bank, user.bankDetails[0].account);
		log("logout transactionsArray==========>",transactionsArray)
		let sessionTransaction = transactionsArray.filter( (transaction) =>{
			log("inside filter ========>transaction.details.completed ",transaction.details.completed , user.sessionStartTime);
			log(typeof  transaction.details.completed);
			log(typeof user.sessionStartTime);
			return transaction.details.completed > user.sessionStartTime;
		});
		let transactionHistory = `Transaction summary of current session : 
		`;
		log(sessionTransaction);
		sessionTransaction.forEach(async (eachTransaction, index) =>{
			let userName = await mongoHandler.getUsername(eachTransaction.other_account.holder.name);
			transactionHistory += `${index+1} : 
				Account Holder Name : ${userName}
				Bank Name : ${eachTransaction.other_account.bank_routing.scheme}
				Bank Account Number: ${eachTransaction.other_account.account_routing.address}
				Transaction Amount : ${eachTransaction.details.value.currency} ${eachTransaction.details.value.amount}
				`
		});
		for(let i=0 ; i<contextArray.length; i++){
			let newObj = contextArray[i];
			newObj.lifespan = 0;
			returnJsonObject.contextOut.push(newObj);
		}
		await mongoHandler.userLogout(req);
		//returnJsonObject.speech = transactionHistory + returnJsonObject.speech;
		//returnJsonObject.displayText = returnJsonObject.speech;
		res.json(returnJsonObject);
	}
	catch(error){
		log(error);
		let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForError));
		res.json(returnJsonObject);
	}
	
}

async function transactionGetRequest (token, bankName, account){
	let args = {
		headers : {
				"Content-Type" : "application/json",
				"Authorization" : "DirectLogin token = "+token
			}
	}
	return new Promise((resolve,reject) => {
		client.get(hostUrl+"obp/v3.0.0/my/banks/"+bankName+"/accounts/"+account+"/transactions", args, function (data, response){
			log("transactionGetRequest=========>",data)
			resolve (data.transactions);
		});
	});
}
module.exports.apiHandlerForFundTransferGetBalanceIntent = async (req,res) => {
	log("inside apiHandlerForFundTransferGetBalanceIntent-=====>");
	let sessionId = req.body.sessionId;
	let result = await mongoHandler.getUserDetails(sessionId);
	let token = result.token;
	let bankName = result.bankDetails[0].bank;
	let account = result.bankDetails[0].account;
	let balance = await getBalance(token, bankName, account);
	let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForUserBalance(balance)));
	res.json(returnJsonObject)

}

module.exports.apiHandlerForFundTransferInitIntent = async (req,res) =>{
	let sessionId = req.body.sessionId;
	let user = await mongoHandler.getUserDetails(sessionId);
	let token = user.token;
	let result = await getCounterParty(token, sessionId);
	if(result.length != 0){
		let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForTransferInitCounterpartyExist));
		res.json(returnJsonObject);
	}
	else{
		let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForTransferInitCounterpartyNotExist));
		res.json(returnJsonObject);
	}
}

module.exports.apiHandlerForTransferGetPayeeIntent = async (req,res) => {
	let payee = req.body.result.parameters.payee;
	let sessionId = req.body.sessionId;
	let user = await mongoHandler.getUserDetails(sessionId);
	let token = user.token;
	let result = await getCounterParty(token, sessionId);
	// let matchedPayee = result.filter( (payeeObj) => payeeObj.name == payee);
	let matchedPayee = result.filter( (payeeObj) => payeeObj["name"].toLowerCase().indexOf(payee.toLowerCase()) > -1);
	log("apiHandlerForTransferGetPayeeIntent ======>matchedPayee==>",matchedPayee);
	let returnJsonObject;
	if(matchedPayee.length == 0){ 
		let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForGetPayeeNotExist(payee)));
		res.json(returnJsonObject);
	}
	else if(matchedPayee.length == 1){
		let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForGetPayeeOnlyOne(matchedPayee)));
		res.json(returnJsonObject);
	}
	else{
		let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForGetPayeeMany(matchedPayee)));
		res.json(returnJsonObject);
	}

}

module.exports.apiHandlerForTransferGetUidIntent = async (req,res) => {
	let transferTo = req.body.result.parameters.transferTo;
	let sessionId = req.body.sessionId;
	let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForGetUidIntent()));
	res.json(returnJsonObject);
}

module.exports.apiHandlerForTransferGetAmountIntent = async (req, res) => {
	let amountToTransfer = req.body.result.parameters.amount;
	let transferTo = req.body.result.parameters.transferTo;
	let sessionId = req.body.sessionId;
	let user = await mongoHandler.getUserDetails(sessionId);
	let balance = await getBalance(user.token, user.bankDetails[0].bank, user.bankDetails[0].account);
	let netBalance = balance.amount - amountToTransfer;
	log("apiHandlerForTransferGetAmountIntent=====>", balance, balance.amount, amountToTransfer, netBalance);

	if (netBalance >= 0){
		log("inside if");
		let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForGetAmount(balance, amountToTransfer)));
		res.json(returnJsonObject);
	}
	else{
		log("inside else");
		nodeMailer.sendOverdraftMail(user);
		let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForGetAmountLowBalance(balance)));
		res.json(returnJsonObject);
	}
}

module.exports.apihandlerForGetConfirmationYesIntent = async (req,res) => {
	let sessionId = req.body.sessionId;
	let transferTo = req.body.result.parameters.transferTo;
	let amount = req.body.result.parameters.amount;
	let user = await mongoHandler.getUserDetails(sessionId);
	let data = await requestSandboxTanTransaction(user, sessionId, transferTo, amount);
	let balance = await getBalance(user.token, user.bankDetails[0].bank, user.bankDetails[0].account);
	let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForGetConfirmationYes(balance)));
	res.json(returnJsonObject);
	
}

module.exports.apihandlerForGetConfirmationNoIntent = async (req,res) => {
	let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForGetConfirmationNo(req)));
	res.json(returnJsonObject);
}

module.exports.apiHandlerForShowCounterpartyIntent = async (req,res) => {
	let sessionId = req.body.sessionId;
	let user = await mongoHandler.getUserDetails(sessionId);
	let token = user.token;
	let result = await getCounterParty(token, sessionId);
	log("result of getCounterParty==>",result);
	let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForShowCounterparty(result)));
	res.json(returnJsonObject);
}

module.exports.apiHandlerForGetPayeeAmountIntent = async (req,res) => {
	let payee = req.body.result.parameters.payee;
	let amount = req.body.result.parameters.amount.amount;
	let currency = req.body.result.parameters.amount.currency;
	let sessionId = req.body.sessionId;

	//validating whether payee exists or not
	let user = await mongoHandler.getUserDetails(sessionId);
	let token = user.token;
	let result = await getCounterParty(token, sessionId); //check if counterParties exists
	if(result.length == 0){
		let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForTransferInitCounterpartyNotExist));
		res.json(returnJsonObject);
	}
	else{
		let matchedPayee = result.filter( (payeeObj) => payeeObj["name"].toLowerCase().indexOf(payee.toLowerCase()) > -1);
		log("apiHandlerForTransferGetPayeeIntent ======>matchedPayee==>",matchedPayee);
		if(matchedPayee.length == 0){
			let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForGetPayeeNotExist(payee)));
			res.json(returnJsonObject);
		}
		else{
			//check balance validity
			let balance = await getBalance(user.token, user.bankDetails[0].bank, user.bankDetails[0].account);
			let netBalance = balance.amount - amount;
			if (netBalance >= 0){
				log("inside if");
				if(matchedPayee.length == 1){
					let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForGetPayeeAmountOnlyOne(matchedPayee,balance.amount,amount)));
					res.json(returnJsonObject);
				}
				else{
					let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForGetPayeeAmountMany(matchedPayee)));
					res.json(returnJsonObject);
				}	
				// let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForGetAmount(balance, amountToTransfer)));
				// res.json(returnJsonObject);
			}
			else{
				log("inside else");
				nodeMailer.sendOverdraftMail(user);
				let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForGetAmountLowBalance(balance)));
				res.json(returnJsonObject);
			}


		 
		}
	}
}

module.exports.apiHandlerForGetPayeeAmountUidIntent = async (req,res) => {
	let payee = req.body.result.parameters.transferTo;
	let amount = req.body.result.parameters.amount;
	let sessionId = req.body.sessionId;

	//validating whether payee exists or not
	let user = await mongoHandler.getUserDetails(sessionId);
	let token = user.token;
	let result = await getCounterParty(token, sessionId); //check if counterParties exists
	if(result.length == 0){
		let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForTransferInitCounterpartyNotExist));
		res.json(returnJsonObject);
	}
	else{
		let matchedPayee = result.filter( (payeeObj) => payeeObj["name"].toLowerCase().indexOf(payee.toLowerCase()) > -1);
		log("apiHandlerForTransferGetPayeeIntent ======>matchedPayee==>",matchedPayee);
		if(matchedPayee.length == 0){
			let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForGetPayeeNotExist(payee)));
			res.json(returnJsonObject);
		}
		else{
			if(matchedPayee.length == 1){
				
					let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForGetPayeeAmountOnlyOne(matchedPayee,balance.amount,amount)));
					res.json(returnJsonObject);	
				}	
			else{
				//enter valid usrname
				let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForGetPayeeInvalid(payee)));
				res.json(returnJsonObject);
				//getpayeeamount followup make it live
				}
			}
			
		}
}

async function getBalance(token, bankName, account){
	let args = {
		headers : {
				"Content-Type" : "application/json",
				"Authorization" : "DirectLogin token = "+token
			}
	}
	return new Promise(function (resolve,reject){
		client.get(hostUrl+"obp/v3.0.0/banks/"+bankName+"/accounts/"+account+"/owner/account", args, function (data, response){
			resolve (data.balance);
		});
	});
}

async function getCounterParty(token, sessionId){
	let args = {
		headers : {
				"Content-Type" : "application/json",
				"Authorization" : "DirectLogin token = "+token
			}
	}
	let result = await mongoHandler.getUserDetails(sessionId);
	let bankName = result.bankDetails[0].bank;
	let account = result.bankDetails[0].account;
	return new Promise((resolve,reject) => {
		client.get(hostUrl+"obp/v3.0.0/banks/"+bankName+"/accounts/"+account+"/owner/counterparties", args, function (data, response){
			resolve (data.counterparties);
		});
	});
	
}

async function requestSandboxTanTransaction(user, sessionId, transferTo, amount){
	try{
		
		let token = user.token;
		let result = await getCounterParty(token, sessionId);
		let matchedPayee = result.filter( (payeeObj) => payeeObj["name"].toLowerCase() === transferTo.toLowerCase() );
		let args = {
			data : {
					"to":
						{    "bank_id": matchedPayee[0]["other_bank_routing_address"],   
							 "account_id": matchedPayee[0]["other_account_routing_address"] 
						}, 
						"value":
							{    "currency":"USD",
							     "amount":amount  
							}, 
					    "description":"Good"
					},
			headers : {
				"Content-Type" : "application/json",
				"Authorization" : "DirectLogin token = "+token
			}
		}
		return new Promise(function(resolve,reject){
			client.post(hostUrl+"obp/v3.0.0/banks/"+user.bankDetails[0].bank+"/accounts/"+user.bankDetails[0].account+"/owner/transaction-request-types/SANDBOX_TAN/transaction-requests",args, async function (data, response){
				log(data);
				resolve(data);
			});
		});	
	}catch(error){

	}
}
