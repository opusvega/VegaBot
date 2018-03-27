module.exports.stubResponseForWelcomeIntent = {
		"speech" : "Hi there. My name is Ailene. Could you please help me with your username?",
		"displayText" : "Hi there. My name is Ailene. Could you please help me with your username?",
		"source" : "OPUS-NLP"
}

module.exports.stubResponseForLoginIntent = (user) => {
	// let response = {
	// 	"speech" : `Welcome to Opus ${user}. How can I help you? You may choose any one of the following options! Show balance, show payee, send money/fund transfer.`,
	// 	"displayText" : `Welcome to Opus ${user}. How can I help you? You may choose any one of the following options! Show balance, show payee, send money/fund transfer.`,
	// 	"source" : "OPUS-NLP"	
	// }
	let response = {
		"speech" : `Hi ${user}. I can help you with fund transfer, balance enquiry, payee details, block/unblock card. What do you want to do?`,
		"displayText" : `Hi ${user}. I can help you with fund transfer, balance enquiry, payee details, block/unblock card. What do you want to do?`,
		"source" : "OPUS-NLP"	
	}

	return response;
}

module.exports.stubResponseForLogoutIntent = {
		"speech" : "You are successfully logged out. Thank you! If you want to continue using the Vega Bot, please key in your username.",
		"displayText" : "You are successfully logged out. Thank you! If you want to continue using the Vega Bot, please key in your username.",
		"contextOut" : [],
		"source" : "OPUS-NLP"	
}

module.exports.stubResponseForError = {
		"speech" : "We are facing some techincal issues. Please try again later.",
		"displayText" : "We are facing some techincal issues. Please try again later.",
		"source" : "OPUS-NLP"		
}

module.exports.stubResponseForUserBalance = (balance) => {
	let response = {
		"speech" : `Your account balance is ${balance.currency} ${balance.amount}.`,
		"displayText" : `Your account balance is ${balance.currency} ${balance.amount}.`,
		"source" : "OPUS-NLP"
	}
	return response;
}

module.exports.stubResponseForTransferInitCounterpartyExist = {
		"speech" : `Who do you want to transfer money to?`,
		"displayText" : `Who do you want to transfer money to?`,
		"source" : "OPUS-NLP"
}

module.exports.stubResponseForTransferInitCounterpartyNotExist = {
		"speech" : `You don't have any payee to transfer fund. You can add payee by stating 'Add Payee / Add Beneficiary'.`,
		"displayText" : `You don't have any payee to transfer fund. You can add payee by stating 'Add Payee / Add Beneficiary'.`,
		"source" : "OPUS-NLP"		
}

module.exports.stubResponseForShowCounterparty = (result) => {
	let speech = `You have Following Payees.`
	let displayText = `You have Following Payees.`
	result.forEach( (payee,index) => {
		let digits = (""+payee["other_account_routing_address"]).split("").join(" ").toString();
		speech += ` ${index+1}) Name: ${payee.name}
		Bank: ${payee["other_bank_routing_address"]}
		Account: ${digits}
		`;
		displayText += ` ${index+1}) Name: ${payee.name}
		Bank: ${payee["other_bank_routing_address"]}
		Account: ${payee["other_account_routing_address"]}
		`;
	});
	console.log(speech);
	let response = {
		"speech" : speech,
		"displayText": displayText,
		"source": "OPUS-NLP"
	}
	return response;
}

module.exports.stubResponseForGetPayeeOnlyOne = (result) => {
	let digits = (""+result[0]["other_account_routing_address"]).split("").join(" ").toString();
	let speech = `I have found ${result[0].name} in Bank ${result[0]["other_bank_routing_address"]} with Bank Account ${digits}.
	Could you please help me with the transfer amount?`;
	let displayText  = `I have found ${result[0].name} in Bank ${result[0]["other_bank_routing_address"]} with Bank Account ${result[0]["other_account_routing_address"]}.
	Could you please help me with the transfer amount?`;
	let response = {
		"speech" : speech,
		"displayText": displayText,
		"contextOut" : [
			{
				"name" : "fundtransfergetpayeenameintent-followup",
				"lifespan" : 0
			},
			{
				"name" : "fundtransferinitintent-followup",
				"lifespan" : 0
			},
			{
				"name" : "welcomeintent-followup",
				"lifespan" : 0
			},
			{
				"name" : "fundtransfergetuidintent-followup",
				"parameters" : {
					"transferTo.original" : result[0].name,
					"transferTo" : result[0].name
				},
				"lifespan" : 2
			}
		],
		"source": "OPUS-NLP"
	}
	console.log(response);
	return response;
}

module.exports.stubResponseForGetUidIntent = () => {

	let response = {
		"speech" : `How much do you want to transfer?`,
		"displayText": `How much do you want to transfer?`,
		"source" : "OPUS-NLP"
	}
	return response;

}

module.exports.stubResponseForGetAmountLowBalance = (balance) => {
	let response = {
		"speech" : `Your account balance is USD ${balance.amount}. You do not have sufficient balance to execute the transaction. Currently you are not subscribed for Overdraft facility.`,
		"displayText": `Your account balance is USD ${balance.amount}. You do not have sufficient balance to execute the transaction. Currently you are not subscribed for Overdraft facility.`,
		"contextOut" : [
			{
				"name" : "fundtransfergetamountintent-followup ",
				"lifespan" : 0	
			}
		],
		"source" : "OPUS-NLP"
	}
	return response;
}

module.exports.stubResponseForGetAmount = (balance, amount) => {
	let response = {
		"speech" : `Your account balance is USD ${balance.amount}. After this transaction you balance would be USD ${balance.amount - amount}.
		Would you like to confirm this transaction?`,
		"displayText": `Your account balance is USD ${balance.amount}. After this transaction you balance would be USD ${balance.amount - amount}.
		Would you like to confirm this transaction?`,
		"source" : "OPUS-NLP"
	}
	return response;
}

module.exports.stubResponseForGetPayeeMany = (result) => {
	let speech = `You have Following Payees.`;
	let displayText = `You have Following Payees.`;
	result.forEach( (payee,index) => {
		index += 1;
		let digits = (""+payee["other_account_routing_address"]).split("").join(" ").toString();
		speech += " \n"+index+") Name: "+payee.name+"\nBank: "+payee["other_bank_routing_address"]+"\n	Account: "+digits;
		displayText += " \n"+index+") Name: "+payee.name+"\nBank: "+payee["other_bank_routing_address"]+"\nAccount: "+payee["other_account_routing_address"];
	});
	speech += `. Please state the 'Name' to whom you want to send money to.` 
	displayText += `. Please state the 'Name' to whom you want to send money to.` 
	console.log(speech);
	let response = {
		"speech" : speech,
		"displayText": displayText,
		"contextOut" : [
			{
				"name" : "fundtransferinitintent-followup",
				"lifespan" : 0
			},
			{
				"name" : "welcomeintent-followup",
				"lifespan" : 0
			}
		],
		"source": "OPUS-NLP"
	}
	return response;
}

module.exports.stubResponseForGetPayeeNotExist = (payee) => {
	let response = {
		"speech" : `There is no ${payee} registered as payee in your acocunt.`,
		"displayText": `There is no ${payee} registered as payee in your acocunt.`,
		"source" : "OPUS-NLP"
	}
	return response;
}

module.exports.stubResponseForGetPayeeAmountOnlyOne = (result,balance,amount) => {
	// let digits = (""+result[0]["other_account_routing_address"]).split("").join(" ").toString();
	// let speech = `I have found ${result[0].name} in Bank ${result[0]["other_bank_routing_address"]} with Bank Account ${digits}.
	// Your current balance is USD ${balance}. After this transaction your balance would be ${balance-amount}. Do you confirm this transaction?`;
	// let displayText  = `I have found ${result[0].name} in Bank ${result[0]["other_bank_routing_address"]} with Bank Account ${result[0]["other_account_routing_address"]}.
	// Your current balance is USD ${balance}. After this transaction your balance would be ${balance-amount}. Do you confirm this transaction?`;
	let speech = `Ok. After this transaction, your balance would be USD ${balance-amount}. Do you confirm this transaction?`;
	let displayText = `Ok. After this transaction, your balance would be USD ${balance-amount}. Do you confirm this transaction?`;
	let response = {
		"speech": speech,
		"displayText": displayText,
		"contextOut":[
			{
				"name": "fundtransfergetpayeeamountintent-followup",
				"lifespan":0
			},
			{
				"name":"fundtransfergetamountintent-followup",
				"parameters" : {
					"transferTo.original" : result[0].name,
					"transferTo" : result[0].name,
					"amount.original": amount,
					"amount":amount
				},
				"lifespan" : 2

			}
		],
		"source": "OPUS-NLP"
	}
	return response;

}


module.exports.stubResponseForGetPayeeAmountMany = (result) =>{
	let speech = `You have Following Payees.`;
	let displayText = `You have Following Payees.`;
	result.forEach( (payee,index) => {
		index += 1;
		let digits = (""+payee["other_account_routing_address"]).split("").join(" ").toString();
		speech += " \n"+index+") Name: "+payee.name+"\nBank: "+payee["other_bank_routing_address"]+"\n	Account: "+digits;
		displayText += " \n"+index+") Name: "+payee.name+"\nBank: "+payee["other_bank_routing_address"]+"\nAccount: "+payee["other_account_routing_address"];
	});
	speech += `. Please state the 'Name' to whom you want to send money to.` 
	displayText += `. Please state the 'Name' to whom you want to send money to.` 
	console.log(speech);
	let response = {
		"speech" : speech,
		"displayText": displayText,
		"contextOut" : [
			{
				"name" : "fundtransferinitintent-followup",
				"lifespan" : 0
			},
			{
				"name" : "welcomeintent-followup",
				"lifespan" : 0
			}
		],
		"source": "OPUS-NLP"
	}
	return response;
}

module.exports.stubResponseForGetPayeeInvalid = (payee) => {
	let response = {
		"speech":"Please enter valid name.",
		"displayText": "Please enter valid payee name",
		"source": "OPUS-NLP",
		"contextOut": [
				{
					"name": "fundtransfergetpayeeamountintent-followup",
					"lifespan" : 2
				},
				{
					"name":"fundtransfergetamountintent-followup",
					"lifespan": 0
				}
			]
		}	
	return response;

}

module.exports.stubResponseForNoCardToProcess = (cardType, cardAction) => {
	let response = {
		"speech" : `You have no ${cardType} card to ${cardAction}.`,
		"displayText" : `You have no ${cardType} card to ${cardAction}.`,
		"source" : `OPUS-NLP`
	}
	return response;
}

module.exports.stubResponseForNoCardExist = (cardType) => {
	let response = {
		"speech" : `Currently you dont own any ${cardType} card. Please call 1 8 0 0 1 0 8 0 1 8 0 0 to apply for new ${cardType} card.`,
		"displayText" : `Currently you dont own any ${cardType} card. Please call 180010801800 to apply for new ${cardType} card.`,
		"source" : `OPUS-NLP`
	}
	return response;
}

// module.exports.stubResponseForOneCardToProcess = (cardType, cardAction, cardDetails) => {
// 	let cardNumber = cardDetails[0].id % 10000;
// 	console.log("stubResponseForOneCardToProcess=>cardNumber=====>",cardNumber);
// 	let speechNumber = cardNumber.toString().split("").join(" ");
// 	let response;
// 	if(cardAction == "block"){
// 		response = {
// 			"speech" : `I have found ${cardType} card ending with ${speechNumber}. Please state the reason of Blocking the card.`,
// 			"displayText" : `I have found ${cardType} card ending with ${cardNumber}. Please state the reason of Blocking the card.`,
// 			"contextOut" : [
// 				{
// 					"name" : "usercardblockgetreason-followup",
// 					"lifespan" : 2,
// 					"parameters" : {
// 							"cardType.original" : cardType,
// 							"cardType" : cardType,
// 							"cardAction.original" : cardAction,
// 							"cardAction" : cardAction,
// 							"cardNumber.original" : cardNumber,
// 							"cardNumber" : cardNumber
// 					}
// 				},
// 				{
// 					"name" : "usercardblockinitintent-followup",
// 					"lifespan" : 0
// 				}
// 			],
// 			"source" : "OPUS-NLP"
// 		}
// 	}
// 	//need to change the contextout (live)
// 	else{
// 		response = {
// 			"speech" : `I have found ${cardType} card ending with ${speechNumber}. Do you confirm to unblock your card?`,
// 			"displayText" : `I have found ${cardType} card ending with ${cardNumber}. Do you confirm to unblock your card?`,
// 			"contextOut" : [
// 				{
// 					"name" : "usercardblockconfirmation-followup",
// 					"lifespan" : 2,
// 					"parameters" : {
// 							"cardType.original" : cardType,
// 							"cardType" : cardType,
// 							"cardAction.original" : cardAction,
// 							"cardAction" : cardAction,
// 							"cardNumber.original" : cardNumber,
// 							"cardNumber" : cardNumber
// 					}
// 				},
// 				{
// 					"name" : "usercardblockinitintent-followup",
// 					"lifespan" : 0
// 				}
// 			],
// 			"source" : "OPUS-NLP"
// 		}
// 	}
	
// 	return response;
// }

module.exports.stubResponseForBlockOneCardToProcess = (cardType, cardAction, cardDetails) => {
	let cardNumber = cardDetails[0].id % 10000;
	//console.log("stubResponseForOneCardToProcess=>cardNumber=====>",cardNumber);
	let speechNumber = cardNumber.toString().split("").join(" ");
	let response = {
		"speech" : `I have found a ${cardType} card ending with ${speechNumber}. Please state the reason of Blocking the card.`,
		"displayText" : `I have found a ${cardType} card ending with ${cardNumber}. Please state the reason of Blocking the card.`,
		"contextOut" : [
			{
				"name" : "usercardblockgetreason-followup",
				"lifespan" : 2,
				"parameters" : {
						"cardType.original" : cardType,
						"cardType" : cardType,
						"cardAction.original" : cardAction,
						"cardAction" : cardAction,
						"cardNumber.original" : cardNumber,
						"cardNumber" : cardNumber
				}
			},
			{
				"name" : "usercardblockinitintent-followup",
				"lifespan" : 0
			}
		],
		"source" : "OPUS-NLP"
	}
	return response;
}

module.exports.stubResponseForCardGetIdBlock = (cardType, cardAction, cardDetails) => {
	let cardNumber = cardDetails[0].id % 10000;
	//console.log("stubResponseForOneCardToProcess=>cardNumber=====>",cardNumber);
	let speechNumber = cardNumber.toString().split("").join(" ");
	let response = {
		"speech" : `Please state the reason of Blocking the card.`,
		"displayText" : `Please state the reason of Blocking the card.`,
		"contextOut" : [
			{
				"name" : "usercardblockgetreason-followup",
				"lifespan" : 2,
				"parameters" : {
						"cardType.original" : cardType,
						"cardType" : cardType,
						"cardAction.original" : cardAction,
						"cardAction" : cardAction,
						"cardNumber.original" : cardNumber,
						"cardNumber" : cardNumber
				}
			},
			{
				"name" : "usercardblockinitintent-followup",
				"lifespan" : 0
			}
		],
		"source" : "OPUS-NLP"
	}
	return response;
}

module.exports.stubResponseForCardGetIdUnBlock = (cardType, cardAction, cardDetails, question, answerKey) => {
	let cardNumber = cardDetails[0].id % 10000;
	// console.log("stubResponseForOneCardToProcess=>cardNumber=====>",cardNumber);
	let speechNumber = cardNumber.toString().split("").join(" ");
	let response = {
			"speech" : `To unblock you card please tell me ${question}`,
			"displayText" : `To unblock you card please tell me ${question}`,
			"contextOut" : [
				{
					"name" : "usercardunblockgetanswer-followup",
					"lifespan" : 2,
					"parameters" : {
							"cardType.original" : cardType,
							"cardType" : cardType,
							"cardAction.original" : cardAction,
							"cardAction" : cardAction,
							"cardNumber.original" : cardNumber,
							"cardNumber" : cardNumber,
							"answerKey.original" : answerKey,
							"answerKey" : answerKey
					}
				},
				{
					"name" : "usercardblockinitintent-followup",
					"lifespan" : 0
				}
			],
			"source" : "OPUS-NLP"
		}
		return response;
}

module.exports.stubResponseForUnBlockOneCardToProcess = (cardType, cardAction, cardDetails, question, answerKey) =>{
	let cardNumber = cardDetails[0].id % 10000;
	// console.log("stubResponseForOneCardToProcess=>cardNumber=====>",cardNumber);
	let speechNumber = cardNumber.toString().split("").join(" ");
	let response = {
			"speech" : `I have found a ${cardType} card ending with ${speechNumber}. To unblock you card, please tell me ${question}`,
			"displayText" : `I have found a ${cardType} card ending with ${cardNumber}. To unblock you card, please tell me ${question}`,
			"contextOut" : [
				{
					"name" : "usercardunblockgetanswer-followup",
					"lifespan" : 2,
					"parameters" : {
							"cardType.original" : cardType,
							"cardType" : cardType,
							"cardAction.original" : cardAction,
							"cardAction" : cardAction,
							"cardNumber.original" : cardNumber,
							"cardNumber" : cardNumber,
							"answerKey.original" : answerKey,
							"answerKey" : answerKey
					}
				},
				{
					"name" : "usercardblockinitintent-followup",
					"lifespan" : 0
				}
			],
			"source" : "OPUS-NLP"
		}
		return response;
}

module.exports.stubReponseForInvalidCardGetId = (cardType, cardAction) => {
	let response = {
		"speech" : `You have entered wrong card number. Please enter valid one.`,
		"displayText" : `You have entered wrong card number. Please enter valid one.`,
		"contextOut" : [
			{
				"name" : "usercardblockinitintent-followup",
				"lifespan" : 2,
				"parameters" : {
					"cardType.original" : cardType,
					"cardType" : cardType,
					"cardAction.original" : cardAction,
					"cardAction" : cardAction
				}
			},
			{
				"name" : "usercardblockgetidintent-followup",
				"lifespan" : 0
			}
		],
		"source" : "OPUS-NLP"
	}
	return response;
}

module.exports.stuReponseForCardGetId = (cardType, cardAction, cardDetails) => {
	
	let response = {
		"speech" : `Please confirm that you want to ${cardAction} the ${cardType} ending with ${(cardDetails[0].id % 10000).toString().split("").join(" ")}?`,
		"displayText" : `Please confirm that you want to ${cardAction} the ${cardType} ending with ${cardDetails[0].id % 10000}?`,
		"source" : `OPUS-NLP`
	}
	return response;
}

module.exports.stubResponseForCardGetReason = (cardNumber, cardType, cardAction) => {
	console.log("stubResponseForCardGetReason ===>cardNumber ====>",cardNumber);
	cardNumber = parseInt(cardNumber);
	let response = {
		"speech" : `Okay! Please confirm that you want to block the ${cardType} card ending with ${cardNumber.toString().split("").join(" ")}?`,
		"displayText" : `Okay! Please confirm that you want to block the ${cardType} card ending with ${cardNumber}?`,
		"contextOut" : [
			{
				"name" : "usercardblockconfirmation-followup",
				"lifespan" : 2,
				"parameters" : {
					"cardType.original" : cardType,
					"cardType" : cardType,
					"cardAction.original" : cardAction,
					"cardAction" : cardAction,
					"cardNumber.original" : cardNumber,
					"cardNumber" : cardNumber
				}
			}
		],
		"source" : `OPUS-NLP`
	}
	return response;
}

module.exports.stubResponseForCardUnblockRightAnswer = (cardType, cardAction, cardNumber) => {
	console.log("stubResponseForCardGetReason ===>cardNumber ====>",cardNumber);
	cardNumber = parseInt(cardNumber);
	let response = {
		"speech" : `Okay! Please confirm that you want to unblock the ${cardType} card ending with ${cardNumber.toString().split("").join(" ")}?`,
		"displayText" : `Okay! Please confirm that you want to unblock the ${cardType} card ending with ${cardNumber}?`,
		"contextOut" : [
			{
				"name" : "usercardblockconfirmation-followup",
				"lifespan" : 2,
				"parameters" : {
					"cardType.original" : cardType,
					"cardType" : cardType,
					"cardAction.original" : cardAction,
					"cardAction" : cardAction,
					"cardNumber.original" : cardNumber,
					"cardNumber" : cardNumber
				}
			}
		],
		"source" : `OPUS-NLP`
	}
	return response;
}

module.exports.stubResponseForCardUnblockWrongAnswer = (cardType, cardAction, cardNumber, answerKey) => {
	let response = {
		"speech" : `You have entered wrong answer. Please try again with right one.`,
		"displayText" : `You have entered wrong answer. Please try again with right one.`,
		"contextOut" : [
			{
				"name" : "usercardunblockgetanswer-followup",
				"lifespan" : 2,
				"parameters" : {
						"cardType.original" : cardType,
						"cardType" : cardType,
						"cardAction.original" : cardAction,
						"cardAction" : cardAction,
						"cardNumber.original" : cardNumber,
						"cardNumber" : cardNumber,
						"answerKey.original" : answerKey,
						"answerKey" : answerKey
				}
			},
			{
				"name" : "usercardblockinitintent-followup",
				"lifespan" : 0
			}
		],
		"source" : `OPUS-NLP`
	}
	return response;
}

module.exports.stubResponseForManyCardToProcess = (cardType, cardAction, cardDetails) => {
	let speechText = `I have found ${cardDetails.length} ${cardType} cards. ending with number `;
	let displayText = `I have found ${cardDetails.length} ${cardType} cards. ending with number `;;
	cardDetails.forEach((card,index) => {
		let cardNumber = card.id % 10000;
		if(index === cardDetails.length-1){
			speechText += `and ${cardNumber.toString().split("").join(" ")}.`;
			displayText += `and ${cardNumber}.`;
		}
		else if(index < cardDetails.length-2 && index != 0){
			speechText += `${cardNumber.toString().split("").join(" ")}, `
			displayText += `${cardNumber}, `
		}
		else{
			speechText += `${cardNumber.toString().split("").join(" ")}, `
			displayText += `${cardNumber} `
		}


	});
	speechText += ` Please state the card ending number which you want to ${cardAction}.`;
	displayText += ` Please state the card ending number which you want to ${cardAction}.`;
	let response = {
		"speech" : speechText,
		"displayText" : displayText,
		"source" : "OPUS-NLP"
	}
	return response;
}

module.exports.stubResponseForGetConfirmationNo = (req) => {
	let response = {
		"speech" : "Your transaction has been cancelled successfully.",
		"displayText" : "Your transaction has been cancelled successfully.",
		"contextOut" : [],
		"source" : "OPUS-NLP"	
	}
	let contextArray = req.body.result.contexts;
	for(let i=0 ; i<contextArray.length; i++){
		let newObj = contextArray[i];
		newObj.lifespan = 0;
		response.contextOut.push(newObj);
	}
	return response;
}

module.exports.stubResponseForCardBlockConfirmationNo = (req) => {
	let cardAction = req.body.result.parameters.cardAction;
	let response = {
		"speech" : `Your request to ${cardAction} your card has been cancelled successfully.`,
		"displayText" : `Your request to ${cardAction} your card has been cancelled successfully.`,
		"contextOut" : [],
		"source" : "OPUS-NLP"	
	}
	let contextArray = req.body.result.contexts;
	for(let i=0 ; i<contextArray.length; i++){
		let newObj = contextArray[i];
		newObj.lifespan = 0;
		response.contextOut.push(newObj);
	}
	return response;
}

module.exports.stubResponseForCardBlockConfirmationYes = (req) => {
	let cardAction = req.body.result.parameters.cardAction;
	let response = {
		"speech" : `Your request to ${cardAction} your card has been processed successfully.`,
		"displayText" : `Your request to ${cardAction} your card has been processed successfully.`,
		"contextOut" : [],
		"source" : "OPUS-NLP"	
	}
	let contextArray = req.body.result.contexts;
	for(let i=0 ; i<contextArray.length; i++){
		let newObj = contextArray[i];
		newObj.lifespan = 0;
		response.contextOut.push(newObj);
	}
	return response;
}

module.exports.stubResponseForGetConfirmationYes = (balance) => {

	let response = {
		"speech" : "Your transaction is successful. Your account balance is now USD "+balance.amount,
		"displayText" : "Your transaction is successful. Your account balance is now USD "+balance.amount,
		"contextOut" : [],
		"source" : "OPUS-NLP"	
	}
	return response;
}