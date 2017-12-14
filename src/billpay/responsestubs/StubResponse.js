const BillInitResponse = {
  "speech": "Sure, I can help you with that. What type of bill would you like to pay. You can say Gas Bill, Power Bill or Phone Bill.",
  "displayText": "Sure, I can help you with that. What type of bill would you like to pay. You can say Gas Bill, Power Bill or Phone Bill.",
  "source": "Opus-NLP"
}

const GasBillInitResponse = {
  "speech": "",
	"displayText": "",
	"source": "Opus-NLP"
}
const LightBillInitResponse = {
  "speech": "",
	"displayText": "",
	"source": "Opus-NLP"
}
const PhoneBillInitResponse = {
  "speech": "",
	"displayText": ".",
	"source": "Opus-NLP"
}

const cardTemplateResponse = {
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

const listTemplateResponse = {
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

const AddBillerGasPowerResponse = {
  "speech": "Tell me your state name.",
  "displayText": "Tell me your state name.",
  "source": "Opus-NLP"
}

function AddBillerGetStateResponse(req){
  let state = req.body.result.parameters.state;
  let billertype = req.body.result.parameters.billertype;
  const response = {
    "speech": `Here is the list of utility providers for  ${billertype} in ${state}`,
    "displayText": `Here is the list of utility providers for  ${billertype} in ${state}`,
    "source": "Opus-NLP"
  }
  return response;
}

  function AddBillerGetBillerResponse(req) {
    let  state = req.body.result.parameters.state;
    let billers = req.body.result.parameters.billername;
    let autopayrequired  = req.body.result.parameters.autopayrequired;
    let autopaymode = req.body.result.parameters.autopaymode;
    let limitamount = req.body.result.parameters.limitamount;
    let cid = req.body.result.parameters.cid;
    const response = {
      "speech": `Let me confirm your details.
      State : ${state}
      Biller : ${billers}
      AutoPayrequired : ${autopayrequired}
      AutoPayMode : ${autopaymode}
      Limit Amount : ${limitamount}
      CID : ${cid}.
      Do you want to add this biller?`,
      "displayText": `Let me confirm your details.
      State : ${state}
      Biller : ${billers}
      AutoPayrequired : ${autopayrequired}
      AutoPayMode : ${autopaymode}
      Limit Amount : ${limitamount}
      CID : ${cid}.
      Do you want to add this biller?`,
      "source": "Opus-NLP"
    }
    return response;
  }

function AddBillerGasPowerYes(req) {

 let billername = req.body.result.parameters.billername;
  const response = {
     "speech": `You have successfully registered ${billername}`,
  "displayText": `You have successfully registered ${billername}`,
  "source": "Opus-NLP"
  }
 return response;
}

const AddBillerGasPowerNo = {
  "speech": "Biller registration has been cancelled.",
  "displayText": "Biller registration has been cancelled..",
  "source": "Opus-NLP"
}

const AddPhoneBiller = {
  "speech": "Specify your Provider type - Wireless / Broadband.",
  "displayText": "Specify your Provider type - Wireless / Broadband",
  "source": "Opus-NLP"
}

const AddPhoneBillerGetProvider = {
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
    const response = {
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
      BID : ${cid}
      Do you want to add this biller?`,
      "source": "Opus-NLP"
    }
    console.log("response ------------>",response.speech);
    return response;

}
function AddPhoneBillerGetBillerYes(req) {
  let billername = req.body.result.parameters.billername;
  const response = {
     "speech": `You have successfully registered ${billername}`,
    "displayText": `You have successfully registered ${billername}`,
    "source": "Opus-NLP"
  }
 return response;
}

const AddPhoneBillerGetBillerNo = {
 "speech": "",
  "displayText": "",
  "source": "Opus-NLP"
}

const selectBillerPayBill = {
  "speech": "",
  "displayText": "",
  "source": "Opus-NLP"
}

module.exports.BillInitResponse = BillInitResponse;
module.exports.GasBillInitResponse = GasBillInitResponse;
module.exports.LightBillInitResponse = LightBillInitResponse;
module.exports.PhoneBillInitResponse = PhoneBillInitResponse;
module.exports.AddBillerGasPowerResponse = AddBillerGasPowerResponse;
module.exports.AddBillerGetStateResponse = AddBillerGetStateResponse;
module.exports.AddBillerGasPowerYes = AddBillerGasPowerYes;
module.exports.AddBillerGasPowerNo = AddBillerGasPowerNo;
module.exports.AddBillerGetBillerResponse = AddBillerGetBillerResponse;
module.exports.listTemplateResponse = listTemplateResponse;
module.exports.cardTemplateResponse = cardTemplateResponse;
module.exports.AddPhoneBillerGetProvider = AddPhoneBillerGetProvider;
module.exports.AddPhoneBiller = AddPhoneBiller;
module.exports.AddPhoneBillerGetBiller= AddPhoneBillerGetBiller;
module.exports.AddPhoneBillerGetBillerYes = AddPhoneBillerGetBillerYes;
module.exports.AddPhoneBillerGetBillerNo = AddPhoneBillerGetBillerNo;
module.exports.selectBillerPayBill = selectBillerPayBill;