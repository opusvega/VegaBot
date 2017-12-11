'use strict';
console.log('Entering router.js...');
let config = require('./config.js');
let apiRemittanceFunctionController = require('./remit/api/controllers/remitApiHandler.js');
let apiAtmFunctionController = require('./atm/api/controllers/atmApiHandler.js');
let apiBankFunctionController = require('./billpay/api/controllers/bankApiHandler.js');
let apiFundFunctionController = require('./fund-transfer/api/controllers/fundApiHandler.js');
let fs = require('fs');


let appRouter = function(app) {
    // Configuration and Property Lookup type requests
    app.get("/PaymentType", function(req, res) {
        //res.send("Hello World");
        let PaymentType = config.PaymentType;
    	res.send(PaymentType);
    });

    app.get("/RemitProducts", function(req, res) {
    	 let RemitProducts = config.RemitProducts;
    	 res.send(RemitProducts);
    });

    app.get("/DaysOfWeek", function(req, res) {
    	 let DaysOfWeek = config.DaysOfWeek;
    	 res.send(DaysOfWeek);
    });

    app.get("/ErrorMessages", function(req, res) {
    	 let ErrorMessages = config.ErrorMessages;
    	 res.send(ErrorMessages);
    });



    app.post('/hook', async function(req, res) {
        console.log("inside router app.post: ");
        console.log(req.body);

        //All remittance cases
        if (req.body.result.metadata.intentName == "TrackTransfer") {

            console.log("inside router app.post: TrackTransfer..." + req.body.result.metadata.intentName);
            await apiRemittanceFunctionController.handleTrackTransferPost(req, res); //handle in a fiber, keep node spinning
            //handleTrackTransferPost(req, res);
            console.log("Exiting TrackTransfer---->");
        }
        if(req.body.result.metadata.intentName.includes("FeeEstimate-MoneyTransfer-Channel")){
            console.log("Entering router FeeEstimate-MoneyTransfer-Channel------>");
        	await apiRemittanceFunctionController.apiHandlerForFeeInquiry(req, res);
            console.log("Exiting router FeeEstimate-MoneyTransfer-Channel------>");
        }
        if(req.body.result.metadata.intentName == "AgentLocator"){
            console.log("Entering router AgentLocator------>");
            await apiRemittanceFunctionController.apiHandlerForAgentLocator(req, res);
            console.log("Exiting router AgentLocator-GetCity------>");
        }
        if(req.body.result.metadata.intentName.includes("AgentLocator-GetCity")){
            console.log("Entering router AgentLocator-GetCity------>");
            await apiRemittanceFunctionController.apiHandlerForAgentLocatorGetCity(req, res);
            console.log("Exiting router AgentLocator-GetCity------>");
        }
        if(req.body.result.metadata.intentName == "DefaultWelcomeIntent"){
            console.log("Entering router DefaultWelcomeIntent------>");
            await apiRemittanceFunctionController.apiDefaultWelcomeIntent(req, res);
            console.log("Exiting router DefaultWelcomeIntent------>");
        }
        if(req.body.result.metadata.intentName == "DefaultWelcomeIntent-get-username"){
            console.log("Entering router DefaultWelcomeIntent-get-username------>");
            await apiRemittanceFunctionController.apiDefaultWelcomeIntentGetUsername(req, res);
            console.log("Exiting router DefaultWelcomeIntent-get-username------>");
        }
          if(req.body.result.metadata.intentName == "FeeEstimate"){
            console.log("Entering router FeeEstimate------>");
            await apiRemittanceFunctionController.apiHandlerForFeeEstimate(req, res);
            console.log("Exiting router FeeEstimate------>");
        }
        if(req.body.result.metadata.intentName == "FeeEstimate-BillPay"){
            console.log("Entering router FeeEstimate-BillPay------>");
            await apiRemittanceFunctionController.apiHandlerForFeeEstimateBillPay(req, res);
            console.log("Exiting router FeeEstimate-BillPay------>");
        }
        if(req.body.result.metadata.intentName == "FeeEstimate-MoneyTransfer-GetCountry"){
            console.log("Entering router FeeEstimate-MoneyTransfer-GetCountry------>");
            await apiRemittanceFunctionController.apiHandlerForFeeEstimateMoneyTransferGetCountry(req, res);
            console.log("Exiting router FeeEstimate-MoneyTransfer-GetCountry------>");
        }
        if(req.body.result.metadata.intentName == "FeeEstimate-MoneyTransfer-GetZipCode"){
            console.log("Entering router FeeEstimate-MoneyTransfer-GetZipCode------>");
            await apiRemittanceFunctionController.apiHandlerForFeeEstimateMoneyTransferGetZipCode(req, res);
            console.log("Exiting router FeeEstimate-MoneyTransfer-GetZipCode------>");
        }
        if(req.body.result.metadata.intentName == "FeeEstimate-MoneyTransfer-GetAmount"){
            console.log("Entering router FeeEstimate-MoneyTransfer-GetAmount------>");
            await apiRemittanceFunctionController.apiHandlerForFeeEstimateMoneyTransferGetAmount(req, res);
            console.log("Exiting router FeeEstimate-MoneyTransfer-GetAmount------>");
        }

        //All ATM cases
        if(req.body.result.metadata.intentName.includes("welcome-intent")){
            console.log("Entering router DefaultWelcomeIntent------>");
            await apiAtmFunctionController.apiDefaultWelcomeIntent(req, res);
            console.log("Exiting router DefaultWelcomeIntent------>");
        }
        if(req.body.result.metadata.intentName.includes("smalltalk")){
            console.log("Entering router smalltalk------>");
            await apiAtmFunctionController.apiHandlerForSmallTalk(req, res);
            console.log("Exiting router smalltalk------>");
        }
        if(req.body.result.metadata.intentName == "report-atm-incident"){
            console.log("Entering router report-atm-incident------>");
            await apiAtmFunctionController.apiHandlerForReportAtmIncident(req, res);
            console.log("Exiting router report-atm-incident------>");
        }
        if(req.body.result.metadata.intentName == "report-atm-incident-get-atmid"){
            console.log("Entering router report-atm-incident-get-atmid------>");
            await apiAtmFunctionController.apiHandlerForReportAtmIncidentGetAtmId(req, res);
            console.log("Exiting router report-atm-incident-get-atmid------>");
        }
        if(req.body.result.metadata.intentName == "report-atm-incident-get-name"){
            console.log("Entering router report-atm-incident-get-name------>");
            await apiAtmFunctionController.apiHandlerForReportAtmIncidentGetName(req, res);
            console.log("Exiting router report-atm-incident-get-name------>");
        }
        if(req.body.result.metadata.intentName == "report-atm-incident-get-contact"){
            console.log("Entering router report-atm-incident-get-contact------>");
            await apiAtmFunctionController.apiHandlerForReportAtmIncidentGetContact(req, res);
            console.log("Exiting router report-atm-incident-get-contact------>");
        }
        if(req.body.result.metadata.intentName == "report-atm-incident-get-issue"){
            console.log("Entering router report-atm-incident-get-issue------>");
            await apiAtmFunctionController.apiHandlerForReportAtmIncidentGetIssue(req, res);
            console.log("Exiting router report-atm-incident-get-issue------>");
        }
        if(req.body.result.metadata.intentName == "track-atm-incident"){
            console.log("Entering router track-atm-incident------>");
            await apiAtmFunctionController.apiHandlerForTrackAtmIncident(req, res);
            console.log("Exiting router track-atm-incident------>");
        }
        if(req.body.result.metadata.intentName == "track-atm-incident-get-incid"){
            console.log("Entering router track-atm-incident-get-incid------>");
            await apiAtmFunctionController.apiHandlerForTrackAtmIncidentGetIncId(req, res);
            console.log("Exiting router track-atm-incident-get-incid------>");
        }
        if(req.body.result.metadata.intentName == "report-atm-incident-get-atmid-loop"){
            console.log("Entering router report-atm-incident-get-atmid-loop------>");
            await apiAtmFunctionController.apiHandlerForReportAtmIncidentGetAtmIdLoop(req, res);
            console.log("Exiting router report-atm-incident-get-atmid-loop------>");
        }

        //Bill payment use cases
        if(req.body.result.metadata.intentName == "pay-bill-init"){
            console.log("Entering router pay-bill-init------>");
            await apiBankFunctionController.apiHandlerForBillInit(req, res);
            console.log("Exiting router pay-bill-init------>");
        }
        if(req.body.result.metadata.intentName == "pay-gas-bill-init"){
            console.log("Entering router pay-gas-bill-init------>");
            await apiBankFunctionController.apiHandlerForGasBillInit(req, res);
            console.log("Exiting router pay-gas-bill-init------>");
        }
        if(req.body.result.metadata.intentName == "pay-power-bill-init"){
            console.log("Entering router pay-power-bill-init------>");
            await apiBankFunctionController.apiHandlerForPowerBillInit(req, res);
            console.log("Exiting router pay-power-bill-init------>");
        }
        if(req.body.result.metadata.intentName == "pay-phone-bill-init"){
            console.log("Entering router pay-phone-bill-init------>");
            await apiBankFunctionController.apiHandlerForPhoneBillInit(req, res);
            console.log("Exiting router pay-phone-bill-init------>");
        }
        if(req.body.result.metadata.intentName == "select-biller-pay-bill"){
            console.log("Entering select-biller-pay-bill------>");
            await apiBankFunctionController.apiHandlerForSelectBillerPayBill(req, res);
            console.log("Exiting select-biller-pay-bill------>");
        }
        if(req.body.result.metadata.intentName == "add-biller-gas-power"){
            console.log("Entering add-biller-gas-power------>");
            await apiBankFunctionController.apiHandlerForAddBillerGasPower(req, res);
            console.log("Exiting add-biller-gas-power------>");
        }
        if(req.body.result.metadata.intentName == "add-biller-get-state"){
            console.log("Entering add-biller-get-state------>");
            await apiBankFunctionController.apiHandlerForAddBillerGetState(req, res);
            console.log("Exiting add-biller-get-state------>");
        }
        if(req.body.result.metadata.intentName == "add-biller-get-biller"){
            console.log("Entering add-biller-get-biller------>");
            await apiBankFunctionController.apiHandlerForAddBillerGetBiller(req, res);
            console.log("Exiting add-biller-get-biller------>");
        }
        if(req.body.result.metadata.intentName == "add-biller-gas-power-yes"){
            console.log("Entering add-biller-gas-power-yes------>");
            await apiBankFunctionController.apiHandlerForAddBillerGasPowerYes(req, res);
            console.log("Exiting add-biller-gas-power-yes------>");
        }
        if(req.body.result.metadata.intentName == "add-biller-gas-power-no"){
            console.log("Entering add-biller-gas-power-no------>");
            await apiBankFunctionController.apiHandlerForAddBillerGasPowerNo(req, res);
            console.log("Exiting add-biller-gas-power-no------>");
        }
        if(req.body.result.metadata.intentName == "add-phone-biller"){
            console.log("Entering add-phone-biller------>");
            await apiBankFunctionController.apiHandlerForAddPhoneBiller(req, res);
            console.log("Exiting add-phone-biller------>");
        }
        if(req.body.result.metadata.intentName == "add-phone-biller-get-provider"){
            console.log("Entering add-phone-biller-get-provider------>");
            await apiBankFunctionController.apiHandlerForAddPhoneBillerGetProvider(req, res);
            console.log("Exiting add-phone-biller-get-provider------>");
        }
        if(req.body.result.metadata.intentName == "add-phone-biller-get-biller"){
            console.log("Entering add-phone-biller-get-biller------>");
            await apiBankFunctionController.apiHandlerForAddPhoneBillerGetBiller(req, res);
            console.log("Exiting add-phone-biller-get-biller------>");
        }
        if(req.body.result.metadata.intentName == "add-phone-biller-get-biller-yes"){
            console.log("Entering add-phone-biller-get-biller-yes------>");
            await apiBankFunctionController.apiHandlerForAddPhoneBillerGetBillerYes(req, res);
            console.log("Exiting add-phone-biller-get-biller-yes------>");
        }
         if(req.body.result.metadata.intentName == "add-phone-biller-get-biller-no"){
            console.log("Entering add-phone-biller-get-biller-no------>");
            await apiBankFunctionController.apiHandlerForAddPhoneBillerGetBillerNo(req, res);
            console.log("Exiting add-phone-biller-get-biller-no------>");
        }
        if(req.body.result.metadata.intentName == "select-biller-pay-bill"){
            console.log("Entering select-biller-pay-bill------>");
            await apiBankFunctionController.apiHandlerForSelectBillerPayBill(req, res);
            console.log("Exiting select-biller-pay-bill------>");
        }
        select-biller-pay-bill
        //Fund transfer use cases
        if(req.body.result.metadata.intentName == "transfer-init"){
            console.log("Entering router transfer-init------>");
            await apiFundFunctionController.apiHandlerForTransferInit(req, res);
            console.log("Exiting router transfer-init------>");
        }
        if(req.body.result.metadata.intentName == "transfer-get-payee"){
            console.log("Entering router transfer-get-payee------>");
            await apiFundFunctionController.apiHandlerForTransferGetPayee(req, res);
            console.log("Exiting router transfer-get-payee------>");
        }
        if(req.body.result.metadata.intentName == "transfer-get-uid"){
            console.log("Entering router transfer-get-uid------>");
            await apiFundFunctionController.apiHandlerForTransferGetUid(req, res);
            console.log("Exiting router transfer-get-uid------>");
        }
        if(req.body.result.metadata.intentName == "transfer-get-amount"){
            console.log("Entering router transfer-get-amount------>");
            await apiFundFunctionController.apiHandlerForTransferGetAmount(req, res);
            console.log("Exiting router transfer-get-amount------>");
        }
        if(req.body.result.metadata.intentName == "transfer-get-otp"){
            console.log("Entering router transfer-get-otp------>");
            await apiFundFunctionController.apiHandlerForTransferGetOtp(req, res);
            console.log("Exiting router transfer-get-otp------>");
        }
        if(req.body.result.metadata.intentName == "transfer-get-payee-amount"){
            console.log("Entering transfer-get-payee-amount------>");
            await apiFundFunctionController.apiHandlerForTransferGetPayeeAmount(req, res);
            console.log("Exiting transfer-get-payee-amount------>");
        }
        if(req.body.result.metadata.intentName == "add-payee-init"){
            console.log("Entering router add-payee-init------>");
            await apiFundFunctionController.apiHandlerForAddPayeeInit(req, res);
            console.log("Exiting router add-payee-init------>");
        }
        if(req.body.result.metadata.intentName == "add-payee-get-payeename"){
            console.log("Entering add-payee-get-payeename------>");
            await apiFundFunctionController.apiHandlerForAddPayeeGetPayeename(req, res);
            console.log("Exiting add-payee-get-payeename------>");
        }
        if(req.body.result.metadata.intentName == "add-payee-get-nickname"){
            console.log("Entering add-payee-get-nickname------>");
            await apiFundFunctionController.apiHandlerForAddPayeeGetNickname(req, res);
            console.log("Exiting add-payee-get-nickname------>");
        }
        if(req.body.result.metadata.intentName == "add-payee-get-bankname"){
            console.log("Entering add-payee-get-bankname------>");
            await apiFundFunctionController.apiHandlerForAddPayeeGetBankname(req, res);
            console.log("Exiting add-payee-get-bankname------>");
        }
        if(req.body.result.metadata.intentName == "add-payee-get-accountnumber"){
            console.log("Entering add-payee-get-accountnumber------>");
            await apiFundFunctionController.apiHandlerForAddPayeeGetAccountnumber(req, res);
            console.log("Exiting add-payee-get-accountnumber------>");
        }
        if(req.body.result.metadata.intentName == "add-payee-get-routingnumber"){
            console.log("Entering add-payee-get-routingnumber------>");
            await apiFundFunctionController.apiHandlerForAddPayeeGetRoutingnumber(req, res);
            console.log("Exiting add-payee-get-routingnumber------>");
        }
        //cancelling all intent whose api is in atm api
        if(req.body.result.metadata.intentName == "cancel-all-intent"){
            console.log("Entering cancel-all-intent------>");
            await apiAtmFunctionController.apiHandlerForCancelAllIntent(req, res);
            console.log("Exiting cancel-all-intent------>");
        }
    });

}

module.exports = appRouter;
console.log('Exiting router.js...');
