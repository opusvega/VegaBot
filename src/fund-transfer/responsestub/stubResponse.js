//response of "transfer-init" intent
//response for "transfer-init" intent
const TransferInit = {
 	"speech": "Sure, I can help you with that. Whom would you like to transfer the funds to?",
	"displayText": "Sure, I can help you with that. Whom would you like to transfer the funds to?",
	"source": "Opus-NLP"
}

//response for "transfer-get-payee" intent
function TransferGetPayee(req){
	const payee = req.body.result.parameters.payee;
	const response = {
		"speech": "",
		"displayText": "",
		"messages": [
			{
				"type": 4,
				"platform": "facebook",
				"payload": {
					"facebook": {
						"attachment": {
						    "payload": {
						      "template_type": "",
						      "elements": [  ]
						    },
					    "type": "template"
					  }
					}
				}
			}
		],
	  "source": "Opus-NLP"	
	}
	return response;
}

//response for "transfer-get-uid" intent and "transfer-get-payee-amount" intent
function TransferGetUid(payee){
	const response = {
		"speech": `How much do you want to send to ${payee}?`,
		"displayText": `How much do you want to send to ${payee}?`,
		"source": `Opus-NLP`	
	}
	return response;
}

//response for "transfer-get-amount" intent and "transfer-get-payee-amount" intent
function TransferGetAmount(contact){
	const response = {
		"speech": `We have sent an OTP to your registered mobile ******${contact}. Enter it when you receive it`,
		"displayText": `We have sent an OTP to your registered mobile number ******${contact}. Enter it when you receive it`,
		"source": `Opus-NLP`	
	}
	return response;
}

function TransferGetPayeeAmount(){
	const response = {
		"speech": ``,
		"displayText": ``,
		"source": `Opus-NLP`	
	}
	return response;
}

//response for "transfer-get-otp" intent
function TransferGetOtp(req,payee){
	const currency = req.body.result.parameters.amount.currency.currency;
	const amount = req.body.result.parameters.amount.currency.amount;
	const response = {
		"speech": `Thank You for the OTP.  Your funds amounting ${currency}${amount} have been transferred to ${payee}.`,
		"displayText": `Thank You for the OTP.  Your funds amounting ${currency}${amount} have been transferred to ${payee}.`,
		"source": `Opus-NLP`		
	}
	return response;
}

//resoponse for "add-payee-init" intent
const AddPayeeInit = {
	"speech": `So tell me the full name of payee/beneficiary.`,
	"displayText": `So tell me the payee name.`,
	"source": `Opus-NLP`
}

//response for "add-payee-get-payeename" intent
function AddPayeeGetPayeename(req){
	const payee = req.body.result.parameters.payee;
	const response = {
		"speech": `So what nickname would you like to give ${payee}.`,
		"displayText": `So what nickname would you like to give ${payee}.`,
		"source": `Opus-NLP`		
	}
	return response;
}

//response for "add-payee-get-nickname" intent
function AddPayeeGetNickname(req){
	const payee = req.body.result.parameters.payee;
	const response = {
		"speech": `Okay. Tell me ${payee}'s bank name.`,
		"displayText": `Okay. Tell me ${payee}'s bank name.`,
		"source": `Opus-NLP`		
	}
	return response;
}

//response for "add-payee-get-bankname" intent
function AddPayeeGetBankname(req){
	const payee = req.body.result.parameters.payee;
	const response = {
		"speech": `Now, tell me ${payee}'s bank account number.`,
		"displayText": `Now, tell me ${payee}'s bank account number.`,
		"source": `Opus-NLP`		
	}
	return response;
}

//response for "add-payee-get-accountnumber" intent
function AddPayeeGetAccountnumber(req){
	const payee = req.body.result.parameters.payee;
	const response = {
		"speech": `And along with that I will be needing ${payee}'s bank routing number.`,
		"displayText": `And along with that I will be needing ${payee}'s bank routing number.`,
		"source": `Opus-NLP`		
	}
	return response;
}

//response for "add-payee-get-routingnumber" intent
async function AddPayeeGetRoutingnumber(req){
	const payee = req.body.result.parameters.payee;
	//INSERT Query 
	const response = {
		"speech": `${payee} has been added successfully in your account.`,
		"displayText": `${payee} has been added successfully in your account.`,
		"source": `Opus-NLP`		
	}
	return response;
}

//exporting all functions and constants
exports.TransferInit = TransferInit;
exports.TransferGetPayee = TransferGetPayee;
exports.TransferGetAmount = TransferGetAmount;
exports.TransferGetOtp = TransferGetOtp;
exports.AddPayeeInit = AddPayeeInit;
exports.AddPayeeGetPayeename = AddPayeeGetPayeename;
exports.AddPayeeGetNickname = AddPayeeGetNickname;
exports.AddPayeeGetBankname = AddPayeeGetBankname;
exports.AddPayeeGetAccountnumber = AddPayeeGetAccountnumber;
exports.AddPayeeGetRoutingnumber = AddPayeeGetRoutingnumber;
exports.TransferGetUid = TransferGetUid;
exports.TransferGetPayeeAmount = TransferGetPayeeAmount;