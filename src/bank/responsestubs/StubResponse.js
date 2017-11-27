


//read list of utility companies from DB
//User table => user's list of billers(null if no records)


//if(no billers)
    //speech = You have no registered billers. Do you want to add one?
//else
    //speech = i have fetched {num_of_billers} registered on your name. which one do you want to pay for?

//add biller intent 
    //speech = let me confirm ur details => all entities with sentence formation . Do u want to continue.


var BillInitResponse = {
    "speech": "Hey there, what bill do you want me to pay ? I can pay for Gas Bill , Light Bill and Phone Bill .",
	"displayText": "Hey there, what bill do you want me to pay ? I can pay for Gas Bill , Light Bill and Phone Bill .",
	"source": "Opus-NLP"
}
var GasBillInitResponse = {
    "speech": "",
	"displayText": "",
	"source": "Opus-NLP"
}
var LightBillInitResponse = {
    "speech": "",
	"displayText": "",
	"source": "Opus-NLP"
}
var PhoneBillInitResponse = {
    "speech": "",
	"displayText": ".",
	"source": "Opus-NLP"
}



function AddBillerResponse(req){
	var BILLERNAME = req.body.result.parameters.Billers;
    var AUTOPAYMODE = req.body.result.parameters.AutoPayMode;
    var AUTOPAYREQUIRED = req.body.result.parameters.AutoPayRequired;
    var CUSTID = req.body.result.parameters.CustId;
    var USERNAME = req.body.result.parameters.UserName;
	var SSN = req.body.result.parameters.SSN;
	
	var addBillerResponseStub = {
		"speech": `Let me confirm your details. Biller name: ${BILLERNAME} , Auto Pay Required: ${AUTOPAYREQUIRED},
					Auto Pay Mode: ${AUTOPAYMODE} , Customer id: ${CUSTID} and SSN: ${SSN}. Do you confirm to add the biller?`,
		"displayText": `Let me confirm your details. Biller name: ${BILLERNAME} , Auto Pay Required: ${AUTOPAYREQUIRED},
		Auto Pay Mode: ${AUTOPAYMODE} , Customer id: ${CUSTID} and SSN: ${SSN}. Do you confirm to add the biller?`,
		"source": "Opus-NLP"

	}
	return addBillerResponseStub;
}


function AddBillerYesResponse(req){
	var BILLERNAME = req.body.result.parameters.Billers;
   
	var addBillerYesResponseStub = {
		"speech":`You have successfully registered the biller: ${BILLERNAME}`,
		"displayText": `You have successfully registered the biller: ${BILLERNAME}`,
		"source": "Opus-NLP"

	}
	return addBillerYesResponseStub;
}

var AddBillerNoResponse = {
	"speech":"The Biller registration has been cancelled. ",
	"displayText": "The Biller registration has been cancelled.",
	"source": "Opus-NLP"
}

var SelectBillerPayBillResponse = {
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
