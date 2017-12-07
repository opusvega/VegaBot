//Welcome response stub
let WelcomeStubResponse = {
	"speech": "Welcome to Opus. My name is Vega. How can I help you?",
	"displayText": "Welcome to Opus. My name is Vega. How can I help you?",
	"source": "Opus-NLP"
}

let WelcomeStubResponseGetUsername = {
	"speech": "Welcome to Opus. My name is Vega. How can I help you?",
	"displayText": "Welcome to Opus. My name is Vega. How can I help you?",
	"source": "Opus-NLP"
}

//FeeEstimate-BillPay response stub
let FeeEstimateBillPay = {
	"speech": "Currently Bill Pay is not available. Sorry for inconvenience.",
	"displayText": "Currently Bill Pay is not available. Sorry for inconvenience.",
	"source": "Opus-NLP"
}
//AgentLocator response stub
let AgentLocator = {
	"speech": "Please tell me the name of your city or zip code",
	"displayText": "Please tell me the name of your city or zip code",
	"data":{
		"facebook": [
			{
				"text" : "Please tell me the name of your city or zip code"
			},
			{
				"text": "Share your location",
	   			"quick_replies": [
	    			{
	        			"content_type": "location"
	      			}
	    		]
			}
		]
	},
	"source": "Opus-NLP"
}
//FeeEstimate response stub
let FeeEstimate = {
	"speech": "Do you want to estimate fee for Money Transferor Bill Pay?",
	"displayText": "Do you want to estimate fee for Money Transferor Bill Pay?",
	"source": "Opus-NLP"
}

//FeeEstimste-MoneyTransfer-GetCountry response stub
let FeeEstimateMoneyTransferGetCountry = {
	"speech": "From which zip code do you want to send the money to $destCountry.name?",
	"displayText": "From which zip code do you want to send the money to $destCountry.name?",
	"data":{
		"facebook": [
			{
				"text" : "Please tell me the name of your city or zip code"
			},
			{
				"text": "Share your location",
	   			"quick_replies": [
	    			{
	        			"content_type": "location"
	      			}
	    		]
			}
		]
	},
	"source": "Opus-NLP"
}

//FeeEstimate-MoneyTransfer-GetZipCode response stub
let FeeEstimateMoneyTransferGetZipCode = {
	"speech": "How much amount do you want to send? You can say e.g. $500.",
	"displayText": "How much amount do you want to send? You can say e.g. $500.",
	"source": "Opus-NLP"
}

//FeeEstimate-MoneyTransfer-GetAmount response stub
let FeeEstimateMoneyTransferGetAmount = {
	"speech": "How would you like to transfer $amount? You can say: \n Send online \n Send by phone \n Send in person \n Send by mobile app",
	"displayText": "How would you like to transfer $amount? You can say: \n Send online \n Send by phone \n Send in person \n Send by mobile app",
	"source": "Opus-NLP"
}

//exporting all stubs 
exports.WelcomeStubResponse = WelcomeStubResponse;
exports.AgentLocator = AgentLocator;
exports.FeeEstimate = FeeEstimate;
exports.FeeEstimateBillPay = FeeEstimateBillPay;
exports.FeeEstimateMoneyTransferGetCountry = FeeEstimateMoneyTransferGetCountry;			
exports.FeeEstimateMoneyTransferGetZipCode = FeeEstimateMoneyTransferGetZipCode;
exports.FeeEstimateMoneyTransferGetAmount = FeeEstimateMoneyTransferGetAmount;
exports.WelcomeStubResponseGetUsername = WelcomeStubResponseGetUsername;