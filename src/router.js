'use strict'
let log = console.log;
let config  = require("./config");
let apiHandler = require("./fundTransfer/api/apiHandler");

let appRouter = (app) => {
	app.post("/hook", async (req, res) =>{
		log("######### Entering in router ############");
		let intentName = req.body.result.metadata.intentName;
		log(intentName)

		if(intentName == "welcome.intent"){
			await apiHandler.apiHandlerForWelcomeIntent(req,res);
		}
		if(intentName == "welcome.user.login.intent" || intentName == "user.login.intent"){
			await apiHandler.apiHandlerForUserLoginIntent(req,res);
		}
		if(intentName == "user.logout.intent"){
			await apiHandler.apiHandlerForUserLogoutIntent(req,res);
		}
		if(intentName == "fund.transfer.get.account.balance.intent"){
			await apiHandler.apiHandlerForFundTransferGetBalanceIntent(req,res);
		}
		if(intentName == "fund.transfer.show.counterparty.intent"){
			await apiHandler.apiHandlerForShowCounterpartyIntent(req,res);
		}
		if(intentName == "fund.transfer.init.intent"){
			await apiHandler.apiHandlerForFundTransferInitIntent(req,res);
		}
		if(intentName == "fund.transfer.get.payeename.intent"){
			await apiHandler.apiHandlerForTransferGetPayeeIntent(req,res);
		}
		if(intentName == "fund.transfer.get.uid.intent"){
			await apiHandler.apiHandlerForTransferGetUidIntent(req,res);
		}
		if(intentName == "fund.transfer.get.amount.intent"){
			await apiHandler.apiHandlerForTransferGetAmountIntent(req,res);
		}
		if(intentName == "fund.transfer.get.confirmation.yes.intent"){
			await apiHandler.apihandlerForGetConfirmationYesIntent(req,res);
		}
		if(intentName == "fund.transfer.get.confirmation.no.intent"){
			await apiHandler.apihandlerForGetConfirmationNoIntent(req,res);
		}
		if(intentName == "fund.transfer.get.payee.amount.intent"){
			await apiHandler.apiHandlerForGetPayeeAmountIntent(req, res);
		}
		if(intentName == "fund.transfer.get.payee.amount.uid.intent"){
			await apiHandler.apiHandlerForGetPayeeAmountUidIntent(req, res);
		}
		if(intentName == "user.card.block.init.intent"){
			await apiHandler.apiHandlerForUserCardBlockInitIntent(req, res);
		}
		if(intentName == "user.card.block.get.id.intent"){
			await apiHandler.apiHandlerForUserCardBlockGetIdIntent(req, res);
		}
		if(intentName == "user.card.block.confirmation.no.intent"){
			await apiHandler.apiHandlerForCardBlockConfirmationNoIntent(req,res);
		}
		if(intentName == "user.card.block.confirmation.yes.intent"){
			await apiHandler.apiHandlerForCardBlockConfirmationYesIntent(req,res);	
		}
		if(intentName == "user.card.block.get.reason.intent"){
			await apiHandler.apiHandlerForUserCardBlockGetReasonIntent(req,res);
		}
		if(intentName == "user.card.unblock.get.answer.intent"){
			await apiHandler.apiHandlerForUserCardUnblockGetAnswerIntent(req, res);
		}
	})
}

module.exports = appRouter;