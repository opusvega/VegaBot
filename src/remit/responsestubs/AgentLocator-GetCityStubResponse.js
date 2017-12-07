let agentLocator_GetCity ={
      "speech": " ",
      "source": "apiai-webhook-sample",
      "displayText": " ",
      "messages": [             
        {
          "type": 4,
          "platform": "facebook",
          "payload": {
            "facebook": {
              "attachment": {
                "payload": {
                  "template_type": "list",
                  "top_element_style": "compact",
                  "elements": [
                    {
                      "title": "1) A K TOURS AND TRAVELS",
                      "subtitle": "Shop 3 Natasha Enclave\nDistance : 0.01mile"
                    },
                    {
                      "title": "2) ACE COMMUNICATONS AND ALLIEDS",
                      "subtitle": "Shop 17 Suraj Apartment\nDistance : 0.01mile"
                    },
                    {
                      "title": "3) CHITTARANJAN GORAKHNATH ASHTEKAR",
                      "subtitle": "Shop No 5 Pancharatna Aprt\nDistance : 0.01mile"
                    },
                    {
                      "title": "4) DEVELOPMENT CREDIT BANK LTD",
                      "subtitle": "Shop No  1 2 3  Brahma Majestic\nDistance : 0.01mile"
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
          "speech": "Which agent you want to visit in location Pune from below :\n1) A K TOURS AND TRAVELS, Shop 3 Natasha Enclave \nDistance : 0.01mile.\n2) ACE COMMUNICATONS AND ALLIEDS, Shop 17 Suraj Apartment \nDistance : 0.01mile."
        }
      ],
      "data": {
        "google": {
          "expect_user_response": true,
          "rich_response": {
            "items": [
              {
                "simpleResponse": {
                  "textToSpeech": "Which agent you want to visit in location Pune from below : \n1) A K TOURS AND TRAVELS, Shop 3 Natasha Enclave \nDistance : 0.01mile. \n2) ACE COMMUNICATONS AND ALLIED S, Shop 17 Suraj Apartment \nDistance : 0.01mile.", "displayText": "Which agent you want to visit in location Pune from below : \n1) A K TOURS AND TRAVELS, Shop 3 Natasha Enclave \nDistance : 0.01mile. \n2) ACE COMMUNICATONS AND ALLIEDS, Shop 17 Suraj Apartment \nDistance : 0.01mile."
                } 
              } 
            ]          
          }       
        }      
      }    
    }

exports.agentLocator_GetCity = agentLocator_GetCity;