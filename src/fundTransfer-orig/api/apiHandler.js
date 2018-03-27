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
			let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForLoginIntent(result.name)));
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

// module.exports.apiHandlerForUserLogoutIntent = async (req,res) =>{
// 	try{
// 		let sessionId = req.body.sessionId;
// 		let user = await mongoHandler.getUserDetails(sessionId);
// 		let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForLogoutIntent));
// 		let contextArray = req.body.result.contexts;
// 		let transactionsArray = await transactionGetRequest(user.token, user.bankDetails[0].bank, user.bankDetails[0].account);
// 		log("logout transactionsArray==========>",transactionsArray)
// 		let sessionTransaction = transactionsArray.filter( (transaction) =>{
// 			log("inside filter ========>transaction.details.completed ",transaction.details.completed , user.sessionStartTime);
// 			log(typeof  transaction.details.completed);
// 			log(typeof user.sessionStartTime);
// 			return transaction.details.completed > user.sessionStartTime;
// 		});
// 		let transactionHistory = `Transaction summary of current session : 
// 		`;
// 		log(sessionTransaction);
// 		sessionTransaction.forEach(async (eachTransaction, index) =>{
// 			let userName = await mongoHandler.getUsername(eachTransaction.other_account.holder.name);
// 			transactionHistory += `${index+1} : 
// 				Account Holder Name : ${userName}
// 				Bank Name : ${eachTransaction.other_account.bank_routing.scheme}
// 				Bank Account Number: ${eachTransaction.other_account.account_routing.address}
// 				Transaction Amount : ${eachTransaction.details.value.currency} ${eachTransaction.details.value.amount}
// 				`
// 		});
// 		for(let i=0 ; i<contextArray.length; i++){
// 			let newObj = contextArray[i];
// 			newObj.lifespan = 0;
// 			returnJsonObject.contextOut.push(newObj);
// 		}
// 		await mongoHandler.userLogout(req);
// 		//returnJsonObject.speech = transactionHistory + returnJsonObject.speech;
// 		//returnJsonObject.displayText = returnJsonObject.speech;
// 		res.json(returnJsonObject);
// 	}
// 	catch(error){
// 		log(error);
// 		let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForError));
// 		res.json(returnJsonObject);
// 	}
	
// }

module.exports.apiHandlerForUserLogoutIntent = async (req,res) =>{
	try{
		let sessionId = req.body.sessionId;
		let user = await mongoHandler.getUserDetails(sessionId);
		let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForLogoutIntent));
		let contextArray = req.body.result.contexts;
		// let transactionsArray = await transactionGetRequest(user.token, user.bankDetails[0].bank, user.bankDetails[0].account);
		// log("logout transactionsArray==========>",transactionsArray)
		// let sessionTransaction = transactionsArray.filter( (transaction) =>{
		// 	let userDate = new Date(transaction.details.completed);
		// 	console.log(userDate.getTime(),user.sessionStartTime.getTime(),userDate.getTime()-user.sessionStartTime.getTime())
		// 	return userDate.getTime()>user.sessionStartTime.getTime();
		// });
		// log(sessionTransaction);
		// let transactionHistory = await sessionTransactionLoop(sessionTransaction);
		// log("Transaction outside loop log====>",transactionHistory);
		// for(let i=0 ; i<contextArray.length; i++){
		// 	let newObj = contextArray[i];
		// 	newObj.lifespan = 0;
		// 	returnJsonObject.contextOut.push(newObj);
		// }
		if(user.hasOwnProperty("sessionSummary")){
			let speech =`Session Summary : \n`;
			user.sessionSummary.forEach((sessionObj,index)=> {

			// console.log(`${index+1})`)

			if(sessionObj.intent =="card"){
				speech += 
				`${index+1}) Your
				${sessionObj.type} card ending with
				${sessionObj.id %10000} was
				${sessionObj.action}ed.\n`;
			}

			else{
				speech += `${index +1}) You transferred
				${sessionObj.currency}
				${sessionObj.amount} to
				${sessionObj.to} having account
				${sessionObj.account} in
				${sessionObj.bank}.\n`;
				}
			})

			returnJsonObject.speech = speech + returnJsonObject.speech;
			returnJsonObject.displayText = speech+returnJsonObject.displayText;
		}
		
		await mongoHandler.userLogout(req);
		// returnJsonObject.speech = transactionHistory + returnJsonObject.speech;
		// returnJsonObject.displayText = returnJsonObject.speech;
		// returnJsonObject.speech = `Session Summary: Your card ending with 7884 has been blocked. ${returnJsonObject.speech}`;
		// returnJsonObject.displayText = returnJsonObject.speech;
		res.json(returnJsonObject);
	}
	catch(error){
		log(error);
		let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForError));
		res.json(returnJsonObject);
	}
}

async function sessionTransactionLoop(sessionTransaction){
	// let userName;
	let transactionHistory = `Session Summary : 
		`;
	let i=0;
	for (const eachTransaction of sessionTransaction){
			let userName = await mongoHandler.getUsername(eachTransaction.other_account.holder.name);
			transactionHistory += `${i+1} : 
				Account Holder Name : ${userName}
				Bank Name : ${eachTransaction.other_account.bank_routing.scheme}
				Bank Account Number: ${eachTransaction.other_account.account_routing.address}
				Transaction Amount : ${eachTransaction.details.value.currency} ${eachTransaction.details.value.amount}
				`;
				i++;
	}
	log("Transaction loop log====>",transactionHistory);
	return transactionHistory;
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

async function getTransactionDataAndUpdateSession(req){
	let sessionId = req.body.sessionId;
	let user = await mongoHandler.getUserDetails(sessionId);
	
	let transactionsArray = await transactionGetRequest(user.token, user.bankDetails[0].bank, user.bankDetails[0].account);
	let lastTransaction = transactionsArray[0];
	let userName = await mongoHandler.getUsername(lastTransaction.other_account.holder.name);

	await mongoHandler.updateTransactionSessionSummary(sessionId, 
														userName,
														lastTransaction.other_account.bank_routing.scheme,
														lastTransaction.other_account.account_routing.address,
														lastTransaction.details.value.currency,
														lastTransaction.details.value.amount);
	//log("logout transactionsArray==========>",transactionsArray)
	// let sessionTransaction = transactionsArray.filter( (transaction) =>{
	// 	let userDate = new Date(transaction.details.completed);
	// 	console.log(userDate.getTime(),user.sessionStartTime.getTime(),userDate.getTime()-user.sessionStartTime.getTime())
	// 	return userDate.getTime()>user.sessionStartTime.getTime();
	// });
}

module.exports.apihandlerForGetConfirmationYesIntent = async (req,res) => {
	let sessionId = req.body.sessionId;
	let transferTo = req.body.result.parameters.transferTo;
	let amount = req.body.result.parameters.amount;
	let user = await mongoHandler.getUserDetails(sessionId);
	let data = await requestSandboxTanTransaction(user, sessionId, transferTo, amount);
	await getTransactionDataAndUpdateSession(req);
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

module.exports.apiHandlerForUserCardBlockInitIntent = async (req, res) => {
	let cardType = req.body.result.parameters.cardType;
	let cardAction = req.body.result.parameters.cardAction;
	let sessionId = req.body.sessionId;
	let userDetails = await mongoHandler.getUserDetails(sessionId)
	let cardDetails = userDetails.bankDetails[0].cards; // currrently bakDetails only has 1 element in array
	
	let qaLength = userDetails.bankDetails[0].qa.length;
	console.log("apiHandlerForUserCardBlockInitIntent====>qa length======>",qaLength);

	let randIndex = Math.floor(Math.random()*qaLength);
	let que = userDetails.bankDetails[0].qa[randIndex].q;
	// log("question=====>",que);
	let ans = userDetails.bankDetails[0].qa[randIndex].a;
	// log("answer======>",ans);
	console.log("apiHandlerForUserCardBlockInitIntent===>q & a ===>",que,ans);
	let checkCardType = cardDetails.filter((card) => card.type === cardType);
	if(checkCardType && checkCardType.length >0){
		if(cardAction === 'block'){
			//fetch all unblock cards and ask which one to block
			let unBlockedCards = checkCardType.filter((card) => card.isBlocked === false  && card.type === cardType);
			console.log("All unblocked cards=>",unBlockedCards);
			if(unBlockedCards.length === 0){
				//no cards to block
				let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForNoCardToProcess(cardType, cardAction)));
				res.json(returnJsonObject);
			}
			else if(unBlockedCards.length === 1){
				//single speech
				let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForBlockOneCardToProcess(cardType, cardAction, unBlockedCards)));
				res.json(returnJsonObject);
			}
			else{
				//multiple cards display speech
				let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForManyCardToProcess(cardType, cardAction, unBlockedCards)));
				res.json(returnJsonObject);
			}
		}
		else{
			let blockedCards = checkCardType.filter((card) => card.isBlocked === true && card.type === cardType);

			let answerKey = 1965;//fetch from db
			
				console.log("All unblocked cards=>",blockedCards);
			if(blockedCards.length === 0){
				//no cards to unblock
				let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForNoCardToProcess(cardType, cardAction)));
				res.json(returnJsonObject);
			}
			else if(blockedCards.length === 1){
				//single speech
				let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForUnBlockOneCardToProcess(cardType, cardAction, blockedCards, que, ans)));
				res.json(returnJsonObject);
			}	
			else{
				//multiple cards display speech
				let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForManyCardToProcess(cardType, cardAction, unBlockedCards)));
				res.json(returnJsonObject);
			}
		}
	}
	else{
		
		let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForNoCardExist(cardType)));
		res.json(returnJsonObject);
	}
	
}

module.exports.apiHandlerForUserCardBlockGetReasonIntent = async (req, res) => {
	let reason = req.body.result.parameters.reason;
	let cardNumber = req.body.result.parameters.cardNumber;
	let cardType = req.body.result.parameters.cardType;
	let cardAction = req.body.result.parameters.cardAction;
	console.log("apiHandlerForUserCardBlockGetReasonIntent=======>cardNumber======>",cardNumber);
	let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForCardGetReason(cardNumber, cardType, cardAction)));
	res.json(returnJsonObject);
}

module.exports.apiHandlerForUserCardBlockGetIdIntent = async (req, res) => {
	let cardType = req.body.result.parameters.cardType;
	let cardAction = req.body.result.parameters.cardAction;
	let cardNumber = req.body.result.parameters.cardNumber;
	let sessionId = req.body.sessionId;
	let userDetails = await mongoHandler.getUserDetails(sessionId)
	let cardDetails = userDetails.bankDetails[0].cards;
	let resultantCard = cardDetails.filter((card) => (card.id % 10000) == cardNumber  && card.type === cardType && card.isBlocked != (cardAction === 'block' ? true:false));
	log("resulantCard =========>",resultantCard);
	
	let qaLength = userDetails.bankDetails[0].qa.length;
	console.log("apiHandlerForUserCardBlockGetIdIntent====>qa length======>",qaLength);

	let randIndex = Math.floor(Math.random()*qaLength);
	let que = userDetails.bankDetails[0].qa[randIndex].q;
	// log("question=====>",que);
	let ans = userDetails.bankDetails[0].qa[randIndex].a;
	// log("answer======>",ans);
	console.log("apiHandlerForUserCardBlockGetIdIntent===>q & a ===>",que,ans);

	if(resultantCard.length === 0){
		//card number wronng
		let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubReponseForInvalidCardGetId(cardType, cardAction)));
		res.json(returnJsonObject);
	}
	else{
		//let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stuReponseForCardGetId(cardType, cardAction, resultantCard)));
		// res.json(returnJsonObject);
		if(cardAction == "block"){
			let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForCardGetIdBlock(cardType, cardAction, resultantCard)));
			res.json(returnJsonObject);
		}
		else{
			let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForCardGetIdUnBlock(cardType, cardAction, resultantCard, que, ans)));
			res.json(returnJsonObject);
		}
	}
}

module.exports.apiHandlerForCardBlockConfirmationNoIntent = async (req,res) => {
	let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForCardBlockConfirmationNo(req)));
	res.json(returnJsonObject);
}

module.exports.apiHandlerForCardBlockConfirmationYesIntent = async (req, res) => {
	let cardType = req.body.result.parameters.cardType;
	let cardAction = req.body.result.parameters.cardAction;
	let cardNumber = req.body.result.parameters.cardNumber;
	let sessionId = req.body.sessionId;
	let userDetails = await mongoHandler.getUserDetails(sessionId)
	let cardDetails = userDetails.bankDetails[0].cards;
	let resultantCard = cardDetails.filter((card) => (card.id % 10000) == cardNumber  && card.type === cardType && card.isBlocked != (cardAction === 'block' ? true:false));
	log("resulantCard =========>",resultantCard, resultantCard[0].id);
	let result = await mongoHandler.updateCardStatus(sessionId, cardType, cardAction, resultantCard[0].id); 
	await mongoHandler.updateCardSessionSummary(sessionId, cardType, cardAction, resultantCard[0].id);
	let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForCardBlockConfirmationYes(req)));
	res.json(returnJsonObject);
}

module.exports.apiHandlerForUserCardUnblockGetAnswerIntent = async (req, res) => {
	let cardType = req.body.result.parameters.cardType;
	let cardAction = req.body.result.parameters.cardAction;
	let cardNumber = req.body.result.parameters.cardNumber;
	let answer = req.body.result.parameters.answer;
	let answerKey = req.body.result.parameters.answerKey;
	answerKey = parseInt(answerKey);
	log("apiHandlerForUserCardUnblockGetAnswerIntent===>answer====>answerKey====>",answer, answerKey);
	if(answer == answerKey){
		let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForCardUnblockRightAnswer(cardType, cardAction, cardNumber)));
		res.json(returnJsonObject);
	}
	else{
		let returnJsonObject = JSON.parse(JSON.stringify(await stubResponse.stubResponseForCardUnblockWrongAnswer(cardType, cardAction, cardNumber, answerKey)));
		res.json(returnJsonObject);
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
