


//read list of utility companies from DB
//User table => user's list of billers(null if no records)


//if(no billers)
    //speech = You have no registered billers. Do you want to add one?
//else
    //speech = i have fetched {num_of_billers} registered on your name. which one do you want to pay for?

//add biller intent 
    //speech = let me confirm ur details => all entities with sentence formation . Do u want to continue.


let BillInitResponse = {
    "speech": "Sure, I can help you with that. What type of bill would you like to pay. You can say Gas Bill, Power Bill or Phone Bill.",
	"displayText": "Sure, I can help you with that. What type of bill would you like to pay. You can say Gas Bill, Power Bill or Phone Bill.",
	"source": "Opus-NLP"
}
let GasBillInitResponse = {
    "speech": "",
	"displayText": "",
	"source": "Opus-NLP"
}
let LightBillInitResponse = {
    "speech": "",
	"displayText": "",
	"source": "Opus-NLP"
}
let PhoneBillInitResponse = {
    "speech": "",
	"displayText": ".",
	"source": "Opus-NLP"
}



function AddBillerResponse(req){
	let BILLERNAME = req.body.result.parameters.Billers;
    let AUTOPAYMODE = req.body.result.parameters.AutoPayMode;
    let AUTOPAYREQUIRED = req.body.result.parameters.AutoPayRequired;
    let CUSTID = req.body.result.parameters.CustId;
    let USERNAME = req.body.result.parameters.UserName;
	let SSN = req.body.result.parameters.SSN;
	
	let addBillerResponseStub = {
		"speech": `Let me confirm your details. Biller name: ${BILLERNAME} , Auto Pay Required: ${AUTOPAYREQUIRED},
Auto Pay Mode: ${AUTOPAYMODE} , Customer id: ${CUSTID} and SSN: ${SSN}. Do you confirm to add the biller?`,
		"displayText": `Let me confirm your details. Biller name: ${BILLERNAME} , Auto Pay Required: ${AUTOPAYREQUIRED},
Auto Pay Mode: ${AUTOPAYMODE} , Customer id: ${CUSTID} and SSN: ${SSN}. Do you confirm to add the biller?`,
		"source": "Opus-NLP"

	}
	return addBillerResponseStub;
}


function AddBillerYesResponse(req){
	let BILLERNAME = req.body.result.parameters.Billers;
   
	let addBillerYesResponseStub = {
		"speech":`You have successfully registered the biller: ${BILLERNAME}`,
		"displayText": `You have successfully registered the biller: ${BILLERNAME}`,
		"source": "Opus-NLP"

	}
	return addBillerYesResponseStub;
}

let AddBillerNoResponse = {
	"speech":"The Biller registration has been cancelled. ",
	"displayText": "The Biller registration has been cancelled.",
	"source": "Opus-NLP"
}

let SelectBillerPayBillResponse = {
	"speech": "",
	"displayText": "",
	"source": "Opus-NLP"
}

exports.BillInitResponse = BillInitResponse;
exports.GasBillInitResponse = GasBillInitResponse;
exports.LightBillInitResponse = LightBillInitResponse;
exports.PhoneBillInitResponse = PhoneBillInitResponse;
exports.AddBillerResponse = AddBillerResponse;
exports.AddBillerYesResponse = AddBillerYesResponse;
exports.AddBillerNoResponse = AddBillerNoResponse;
exports.SelectBillerPayBillResponse = SelectBillerPayBillResponse;
