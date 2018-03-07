module.exports.stubResponseForWelcomeIntent = {
		"speech" : "Hi there. My name is Vega. Could you please help me with your username?",
		"displayText" : "Hi there. My name is Vega. Could you please help me with your username?",
		"source" : "OPUS-NLP"
}

module.exports.stubResponseForLoginIntent = (user) => {
	// let response = {
	// 	"speech" : `Welcome to Opus ${user}. How can I help you? You may choose any one of the following options! Show balance, show payee, send money/fund transfer.`,
	// 	"displayText" : `Welcome to Opus ${user}. How can I help you? You may choose any one of the following options! Show balance, show payee, send money/fund transfer.`,
	// 	"source" : "OPUS-NLP"	
	// }
let response = {
		"speech" : `Hi ${user}. I can help you with fund transfer, balance enquiry, payee details`,
		"displayText" : `Hi ${user}. I can help you with fund transfer, balance enquiry, payee details`,
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
		"speech" : `Whom do you want to send money to?`,
		"displayText" : `Whom do you want to send money to?`,
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
		"speech" : `How much do you want to send?`,
		"displayText": `How much do you want to send?`,
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
	let speech = `Ok. After this transaction your balance would be USD ${balance-amount}. Do you confirm this transaction?`;
	let displayText = `Ok. After this transaction your balance would be USD ${balance-amount}. Do you confirm this transaction?`;
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

module.exports.stubResponseForGetConfirmationYes = (balance) => {

	let response = {
		"speech" : "Your transaction is successful. Your account balance is now USD "+balance.amount,
		"displayText" : "Your transaction is successful. Your account balance is now USD "+balance.amount,
		"contextOut" : [],
		"source" : "OPUS-NLP"	
	}
	return response;
}