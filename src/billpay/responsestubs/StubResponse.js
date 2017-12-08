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

let cardTemplateResponse = {
  "speech": "Welcome to Opus. My name is Vega. How can I help you?",
  "displayText": "Welcome to Opus. My name is Vega. How can I help you?",
  "messages": [
      {
          "type" : 0,
          "platform" : "facebook",
          "speech" : "Choose any one of the following options!"
      },
      {
          "type": 4,
          "platform": "facebook",
          "payload": {
            "facebook": {
              "attachment": {
                  "payload": {
                    "template_type": "generic",
                    "elements": [
                      
                    ]
                  },
                "type": "template"
              }
            }
          }
        }
      ],
  "source": "Opus-NLP"
}

let listTemplateResponse = {
    "speech": "Welcome to Opus. My name is Vega. How can I help you?",
    "displayText": "Welcome to Opus. My name is Vega. How can I help you?",
    "messages": [
        {
            "type" : 0,
            "platform" : "facebook",
            "speech" : "Choose any one of the following options!"
        },
        {
            "type": 4,
            "platform": "facebook",
            "payload": {
              "facebook": {
                "attachment": {
                    "payload": {
                      "template_type": "list",
                      "top_element_style" : "compact",
                      "elements": [
                      ]
                    },
                  "type": "template"
                }
              }
            }
          }
        ],
    "source": "Opus-NLP"
}

let AddBillerGasPowerResponse = {
  "speech": "Tell me your state name.",
  "displayText": "Tell me your state name.",
  "source": "Opus-NLP"
}

function AddBillerGetStateResponse(req){
  let state = req.body.result.parameters.state;
  let billertype = req.body.result.parameters.billertype;
  let response = {
    "speech": `Here is the list of utility providers for  ${billertype} in ${state}`,
    "displayText": `Here is the list of utility providers for  ${billertype} in ${state}`,
    "source": "Opus-NLP"
  }
  return response;
}

  function AddBillerGetBillerResponse(req) {
    let  state = req.body.result.parameters.state;
    let billers = req.body.result.parameters.billers;
    let autopayrequired  = req.body.result.parameters.autopayrequired;
    let autopaymode = req.body.result.parameters.autopaymode;
    let limitamount = req.body.result.parameters.limitamount;
    let cid = req.body.result.parameters.cid;
    let response = {
      "speech": `Let me confirm your details.
      State : ${state}
      Biller : ${billers}
      AutoPayrequired : ${autopayrequired}
      AutoPayMode : ${autopaymode}
      Limit Amount : ${limitamount}
      CID : ${cid}`,
      "displayText": `Let me confirm your details.
      State : ${state}
      Biller : ${billers}
      AutoPayrequired : ${autopayrequired}
      AutoPayMode : ${autopaymode}
      Limit Amount : ${limitamount}
      CID : ${cid}`,
      "source": "Opus-NLP"
    }
    return response;
  }

function AddBillerGasPowerYes(req) {

 let billername = req.body.result.parameters.billername;
  let response = {
     "speech": `You have successfully registered ${billername}`,
  "displayText": `You have successfully registered ${billername}`,
  "source": "Opus-NLP"
  }
 return response;
}

let AddBillerGasPowerNo = {
  "speech": "Biller registration has been cancelled.",
  "displayText": "Biller registration has been cancelled..",
  "source": "Opus-NLP"
}

let AddPhoneBiller = {
  "speech": "Specify your Provider type - Wireless / Broadband.",
  "displayText": "Specify your Provider type - Wireless / Broadband",
  "source": "Opus-NLP"
}

let AddPhoneBillerGetProvider = {
  "speech": "",
  "displayText": "",
  "source": "Opus-NLP"
}

function AddPhoneBillerGetBiller(req){
    let billers = req.body.result.parameters.billers;
    let autopayrequired  = req.body.result.parameters.autopayrequired;
    let autopaymode = req.body.result.parameters.autopaymode;
    let limitamount = req.body.result.parameters.limitamount;
    let cid = req.body.result.parameters.cid;
    let phoneprovider = req.body.result.parameters.phoneprovider;
    let response = {
      "speech": `Let me confirm your details.
      Phoneprovider : ${phoneprovider}
      Biller : ${billers}
      AutoPayrequired : ${autopayrequired}
      AutoPayMode : ${autopaymode}
      Limit Amount : ${limitamount}
      CID : ${cid}`,
      "displayText": `Let me confirm your details.
      Phoneprovider : ${phoneprovider}
      Biller : ${billers}
      AutoPayrequired : ${autopayrequired}
      AutoPayMode : ${autopaymode}
      Limit Amount : ${limitamount}
      CID : ${cid}`,
      "source": "Opus-NLP"
    }
    console.log("response ------------>",response.speech);
    return response;

}
function AddPhoneBillerGetBillerYes(req) {
  let billername = req.body.result.parameters.billername;
  let response = {
     "speech": `You have successfully registered ${billername}`,
  "displayText": `You have successfully registered ${billername}`,
  "source": "Opus-NLP"
  }
 return response;
}

let AddPhoneBillerGetBillerNo = {
 "speech": "",
  "displayText": "",
  "source": "Opus-NLP"
}

let selectBillerPayBill = {
  "speech": "",
  "displayText": "",
  "source": "Opus-NLP"
}

exports.BillInitResponse = BillInitResponse;
exports.GasBillInitResponse = GasBillInitResponse;
exports.LightBillInitResponse = LightBillInitResponse;
exports.PhoneBillInitResponse = PhoneBillInitResponse;
exports.AddBillerGasPowerResponse = AddBillerGasPowerResponse;
exports.AddBillerGetStateResponse = AddBillerGetStateResponse;
exports.AddBillerGasPowerYes = AddBillerGasPowerYes;
exports.AddBillerGasPowerNo = AddBillerGasPowerNo;
exports.AddBillerGetBillerResponse = AddBillerGetBillerResponse;
exports.listTemplateResponse = listTemplateResponse;
exports.cardTemplateResponse = cardTemplateResponse;
exports.AddPhoneBillerGetProvider = AddPhoneBillerGetProvider;
exports.AddPhoneBiller = AddPhoneBiller;
exports.AddPhoneBillerGetBiller= AddPhoneBillerGetBiller;
exports.AddPhoneBillerGetBillerYes = AddPhoneBillerGetBillerYes;
exports.AddPhoneBillerGetBillerNo = AddPhoneBillerGetBillerNo;
exports.selectBillerPayBill = selectBillerPayBill;