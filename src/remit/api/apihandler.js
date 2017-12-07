let config = require('../config.js')

console.log('Inside apihandler.js...');
 
function apiHandlerForTrackTransfer(req, res, callback){
	let speech = 'empty speech';
	let resultText = '';
	if (req.body) {
	    let requestBody = req.body;
	    if (requestBody.result) {
	        speech = '';
	        if (requestBody.result.fulfillment) {
	            speech += requestBody.result.fulfillment.speech;
	            speech += ' ';
	        }

	        if (requestBody.result.action) {
	            speech += 'action: ' + requestBody.result.action;
	            speech += ' ';
	        }
	        if (requestBody.result.parameters && requestBody.result.parameters.mtcn) {
	            let MTCN_RECIVED = requestBody.result.parameters.mtcn;

	            resultText = config.sampleResponseForMTCN;	            
	            let searchTrxStatusResponse = resultText["SearchTransactionStatusResponse.2016.12.12"];
	            let responseCode;
	            let errorText;

	            if (searchTrxStatusResponse) {
	                errorText = searchTrxStatusResponse["Error.2016.12.12"];

	                responseCode = errorText.ReplyCode;

	                if (responseCode == "100" || responseCode == "-1" || responseCode == "99") {
	                    resultText = config.errorMessages.ERROR_RESPONE_TEXT;
	                } else {
	                    let status = searchTrxStatusResponse.Status;

	                    if (status == "W/C") {
	                        resultText = "Your money transfer is Available and is Ready for Pickup";
	                    } else if (status == "AUTH") {
	                        resultText = "Your money transfer is In Progress";
	                    } else {
	                        resultText = "Your money transfer is In Progress";
	                    }
	                }
	            } else {
	                errorText = resultText["FaultErrorMessage.2016.12.12"];

	                responseCode = errorText.ReplyCode;

	                if (responseCode) {
	                    resultText = config.errorMessages.ERROR_RESPONE_TEXT;
	                }
	            }
	            speech = "For Tracking number: " + MTCN_RECIVED + ", Status: " + resultText;

	            // Status search using MTCN
	        } else if (requestBody.result.parameters && requestBody.result.parameters.phonenumber) {
	            //Status search using Sender's Phone number
	            let PHONENUMBER_RECIVED = requestBody.result.parameters.phonenumber;

	            resultText = config.errorMessages.ERROR_RESPONE_TEXT;

	            speech = "For Sender's phone number: " + PHONENUMBER_RECIVED + ", Status: " + resultText;
	            //Status search using Sender's Phone number

	        } else if (requestBody.result.parameters && requestBody.result.parameters.name) {
	            //Status search using Senders Full Name
	            let NAME_RECIVED = requestBody.result.parameters.name;

	            resultText = config.errorMessages.ERROR_RESPONE_TEXT;
	            speech = "For Sender's name: " + NAME_RECIVED + ", Status: " + resultText;
	            //Status search using Senders Full Name
	        }

	        let returnObj = {
	            speech: speech,
	            displayText: speech,
	            source: 'apiai-webhook-sample',
	            data: {
	                slack: slackResponse
	            }
	    	}
	    	return returnObj;
		}
	}
}

exports.apiHandlerForTrackTransfer = apiHandlerForTrackTransfer;
