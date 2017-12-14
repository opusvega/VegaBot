
//Welcome response stub
let WelcomeStubResponse = {
	"speech": "Thank you for calling NCR corporation." +
    		  " My name is Vega. How can I help you today? You can say Report an ATM issue or Check status of an ATM incident",
	"displayText": "Thank you for calling NCR corporation." +
    		  	   " My name is Vega. How can I help you today? You can say Report an ATM issue or Check status of an ATM incident",
	"source": "Opus-NLP"
}

//ReportAtmIncident
let ReportAtmIncident = {
	"speech": "Regret the inconvenience, can you please assist me with the ATM ID?",
	"displayText": "Regret the inconvenience, can you please assist me with the ATM ID?",
	"source": "Opus-NLP"
} 

//ReportAtmIncident_get_atmid
function ReportAtmIncidentGetAtmId(req){
	//random selection of response
	let reportAtmIncidentGetAtmIdSet = ["Sorry for the inconvenience. I will raise a incident ticket. Kindly tell me your name",
								 		"I have just checked the working status of ATM"+req.body.result.parameters.atmId.atmId+ 
								 		"is working properly. Is there anything I can help you with?"];
	let reportAtmIncidentGetAtmId = reportAtmIncidentGetAtmIdSet[Math.floor(Math.random()*reportAtmIncidentGetAtmIdSet.length)];

	return {
		"speech": reportAtmIncidentGetAtmId,
		"displayText": reportAtmIncidentGetAtmId,
		"source": "Opus-NLP"}
	
}

//report-atm-incident-get-name
function ReportAtmIncidentGetName(req){
	return {
	"speech": "Thank you "+req.body.result.parameters.customerName.customerName+
              ". I would also need your contact details for further communication. Please provide your phone number",
	"displayText": "Thank you "+req.body.result.parameters.customerName.customerName+
              ". I would also need your contact details for further communication. Please provide your phone number",
	"source": "Opus-NLP"
	}

}

//report-atm-incident-get-name
function ReportAtmIncidentGetContact(req){
	return{
	"speech": "Thank you "+req.body.result.parameters.customerName.customerName+
              ". Can you please help me with the exact nature of the problem?",
	"displayText": "Thank you "+req.body.result.parameters.customerName.customerName+
              ". Can you please help me with the exact nature of the problem?",
	"source": "Opus-NLP"
	}

}

//report-atm-incident-get-issue
function ReportAtmIncidentGetIssue(req,incid,technician){
	return{
	"speech": "Thank you for your patience "+req.body.result.parameters.customerName.customerName+
			  ". I have logged an SLM call for "+req.body.result.parameters.issues+" for ATM"+req.body.result.parameters.atmId.atmId+
			  " with incident number INC"+incid+" and has been assigned to "+technician+". You should also receive an SMS shortly with the call log details."+
			  " Is there anything else that I may assist you with?",
	"displayText": "Thank you for your patience "+req.body.result.parameters.customerName.customerName+
			  ". I have logged an SLM call for "+req.body.result.parameters.issues+" for ATM"+req.body.result.parameters.atmId.atmId+
			  " with incident number INC"+incid+". You should also receive an SMS shortly with the call log details."+
			  " Is there anything else that I may assist you with?",
	"source": "Opus-NLP"
	}

}

//track-atm-incident
let TrackAtmIncident = {
	"speech": "Sure, I can help you with incident status. Can you please assist me with the incident number",
	"displayText": "Sure, I can help you with incident status. Can you please assist me with the incident number",
	"source": "Opus-NLP"
} 

function TrackAtmIncidentGetIncId(ROWS){
	console.log("Inside tedtdtub---->",ROWS);
	let resTime = Math.floor(Math.random()*(10));
	let response = {
		"speech": "Thank you for your patience. Our systems indicate that the ATM"
			  +ROWS[0].atmid+" is reported "+ROWS[0].issue+" on "+ROWS[0].inctime+
			  ". The last action or update is '"+ROWS[0].status+
			  "'. We will try our best to have this resolved in next "+resTime+" hours. Is there anything else that I may assist you with?",
		"displayText": "Thank you for your patience. Our systems indicate that the ATM"
			  +ROWS[0].atmid+" is reported "+ROWS[0].issue+" on "+ROWS[0].inctime+
			  ". The last action or update is '"+ROWS[0].status+
			  "'. We will try our best to have this resolved in next "+resTime+" hours. Is there anything else that I may assist you with?",
	  	"source": "Opus-NLP"	
	}
	return response;
}

let ReportAtmIncidentGetAtmIdLoop = {
	"speech": "Certainly, can you please provide me your Name so that I can raise an incident ticket.",
	"displayText": "Certainly, can you please provide me your Name so that I can raise an incident ticket.",
	"source": "Opus-NLP"
}

let CancelAllIntent = {
	"speech": "Thank you for using our service.",
	"displayText": "Thank you for using our service.",
	"source": "Opus-NLP"
}

//exporting all stubs 
module.exports.WelcomeStubResponse = WelcomeStubResponse;
module.exports.ReportAtmIncident = ReportAtmIncident;
module.exports.ReportAtmIncidentGetAtmId = ReportAtmIncidentGetAtmId;
module.exports.ReportAtmIncidentGetName = ReportAtmIncidentGetName;
module.exports.ReportAtmIncidentGetContact = ReportAtmIncidentGetContact;
module.exports.ReportAtmIncidentGetIssue = ReportAtmIncidentGetIssue;
module.exports.TrackAtmIncident = TrackAtmIncident;
module.exports.TrackAtmIncidentGetIncId = TrackAtmIncidentGetIncId;
module.exports.ReportAtmIncidentGetAtmIdLoop = ReportAtmIncidentGetAtmIdLoop;
module.exports.CancelAllIntent = CancelAllIntent;