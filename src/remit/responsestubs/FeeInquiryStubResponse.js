let FeeInquiryStubResponse = {

"speech": "Total Fee Estimate to transfer $500 from zip code 10022 to India is $20",
"displayText": "Total Fee Estimate to transfer $500 from zip code 10022 to India is $20",
"source": "Opus-NLP",
"messages": [
        {
          "type": 4,
          "platform": "facebook",
          "payload": {
            "facebook": {
              "attachment": {
                "payload": {
                  "template_type": "generic",
                  "elements": [
                    {
                      "title": "For deposit into a bank account",
                      "subtitle": "PAY WITH- Cash\nSERVICE- 0-1 Business Days\nSENDING- 4000 USD\nFEE- 5 USD"
                    }
                  ]
                },
                "type": "template"
              }
            }
          }
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
                    {
                      "title": "For cash pickup at an agent location",
                      "subtitle": "PAY WITH- Cash\nSERVICE- In Minutes\nSENDING- 4000 USD\nFEE- 10 USD"
                    }
                  ]
                },
                "type": "template"
              }
            }
          }
        },
        {
          "type": 0,
          "platform": "facebook",
          "speech": "Disclaimer :\nThe Fee/exchange rate is indicative and may change during the actual transaction\n"
        },
        {
          "type": 0,
          "platform": "facebook",
          "speech": "\nDo want to see nearby agents? (Yes/No)"
        },
        {
          "type": 0,
          "speech": "Total Fee Estimate to transfer $4000 from zip code 10024 to India is \n\nFor deposit into a bank account :\n\tPAY WITH- Cash\n\tSERVICE- 0-1 Business Days\n\tSENDING- 4000 USD\n\tFEE- 5 USD\n\nFor cash pickup at an agent location :\n\tPAY WITH- Cash\n\tSERVICE- In Minutes\n\tSENDING- 4000 USD\n\tFEE- 10 USD\n\nDo want to see nearby agents? (Yes/No)"
        }
      ],
"data": {
  "google": {
    "expect_user_response": true,
    "rich_response": {
      "items": [
        {
          "simpleResponse": {
            "textToSpeech": "Total Fee Estimate to transfer $4000 from zip code 1 0 0 2 4 to India is \n\nFor deposit into a bank account :\n\tPAY WITH- Cash\n\tSERVICE- 0-1 Business Days\n\tSENDING- 4000 USD\n\tFEE- 5 USD\n\nFor cash pickup at an agent location :\n\tPAY WITH- Cash\n\tSERVICE- In Minutes\n\tSENDING- 4000 USD\n\tFEE- 10 USD\n\nDo want to see nearby agents? (Yes/No)",
            "displayText": "Total Fee Estimate to transfer $4000 from zip code 10024 to India is \n\nFor deposit into a bank account :\n\tPAY WITH- Cash\n\tSERVICE- 0-1 Business Days\n\tSENDING- 4000 USD\n\tFEE- 5 USD\n\nFor cash pickup at an agent location :\n\tPAY WITH- Cash\n\tSERVICE- In Minutes\n\tSENDING- 4000 USD\n\tFEE- 10 USD\n\nDo want to see nearby agents? (Yes/No)"
          }
        }
      ]
    }
  }
}
}

exports.FeeInquiryStubResponse = FeeInquiryStubResponse;