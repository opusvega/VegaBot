let mysql = require("mysql2/promise");
let config = require("../config.js");
let intentNameLookup = require("../reflookup/IntentNames.js");
let callmysqlpool = require("../mysql-functions/createMysqlSingleton.js");

async function getConnectionPool() {
  try {
    return (await callmysqlpool.getPool());
  }
  catch (err) {
    console.log("Error in creating Mysql Pool");
    return false;
  }
}

//inserting new context entry with startintent name and session id
async function insertContextLog(req,endintentname){
    console.log("Entering insertContextLog----------->");
    let SESSIONID = req.body.sessionId;
    let INTENTNAME = req.body.result.metadata.intentName;
   try{
        let pool = await getConnectionPool();
        let con = await pool.getConnection();
        let sqlSelect = `SELECT * FROM contextlog WHERE intentname = ? AND sessionid = ? AND intentcomplete = FALSE;`;
        let [rows, fields] = await con.query(sqlSelect,[INTENTNAME,SESSIONID]);
        if(rows.length == 0){
            let sql = "INSERT INTO contextlog (id, sessionid, intentname,endintentname, sessionflag, intentvisit, intentcomplete) VALUES"+
                    "(DEFAULT, '"+SESSIONID+"', '"+INTENTNAME+"','"+endintentname+"', DEFAULT, DEFAULT, DEFAULT);";
            let result = await con.query(sql);
            console.log("1 record inserted in contextlog");
                    console.log("Exiting insertContextLog----------->");
        }else{
            console.log("This entry already exist!")
        }
   }
   catch (err){
         console.log(`ERROR in insertContextLog`);
   }   
}

//updating the intentcomplete flag to true which means this is the lastintent of context
async function updateContextLogIntentComplete(req){
    let SESSIONID = req.body.sessionId;
    let INTENTNAME = req.body.result.metadata.intentName;
    try{
        let pool = await getConnectionPool();
        let con = await pool.getConnection();
        let sql = `UPDATE contextlog SET intentcomplete = TRUE WHERE sessionid = ? AND endintentname = ? AND intentcomplete = FALSE;`;
        let result = await con.execute(sql,[SESSIONID,INTENTNAME]);
        console.log(result.affectedRows+" record(s) updated!");
        return result;
    }
    catch (err){
        return false;
    }
}

//updating lastintent name of present context entry
async function updateContextLogEndIntent(req){
    let SESSIONID = req.body.sessionId;
    let pool = await getConnectionPool();
    let con = await pool.getConnection();
    let sql = `UPDATE contextlog SET intentcomplete = TRUE WHERE sessionid = ? AND intentcomplete = FALSE;`;
    let result = await con.execute(sql,[SESSIONID]);
    console.log(result.affectedRows+" record(s) updated!");
}

//fetching the context which is just hit by user , whether its entry is already or not
async function selectContextLogFalseIntentComplete(req){
    let SESSIONID = req.body.sessionId;
    let query = `SELECT intentname FROM contextlog WHERE sessionid = ? AND sessionflag = TRUE AND intentvisit = TRUE AND intentcomplete = FALSE;`;
    let pool = await getConnectionPool();
    let con = await pool.getConnection();
    let [rows, fields] = await con.execute(query,[SESSIONID]);
    console.log("**************************");
    console.log(rows);
    console.log("*****************************");
    console.log(rows[0]);
    console.log("*****************************");
    console.log(fields);
    return rows;
}
async function intentNameConverter(intentName){
  let IntentArray = intentName.split("-");
  console.log(IntentArray);
  let newIntentName = '';
  IntentArray.forEach(function(intent){
      newIntentName += intent;
  });
  console.log(newIntentName);
  return newIntentName;
}

async function cardCreate(returnJsonObj, result){
  let response = {
    "speech": returnJsonObj.speech,
    "displayText": returnJsonObj.speech,
    "messages": [
      {
        "type" : 0,
        "platform" : "facebook",
        "speech" : returnJsonObj.speech
      },
      {
        "type" : 0,
        "platform" : "facebook",
        "speech" : "By the way I have noticed you have one task pending. What would you like to do?"
      },
      {
        "type": 4,
        "platform": "facebook",
        "payload": {
          "facebook": {
            "attachment": {
                "payload": {
                  "template_type": "generic",
                  "elements": [ ]
                },
              "type": "template"
            }
          }
        }

      }
    ],
    "source": "Opus-NLP"  
  }

  let fbElements = {};
  fbElements.buttons = [];
  let intent = result[0].intentname;
  console.log("&&&&&"+intent);
  let newIntent = await intentNameConverter(intent);
  console.log(newIntent);
  console.log(intentNameLookup.intentLookup[newIntent]);
  fbElements.title = intentNameLookup.intentLookup[newIntent];
  //fbElements.subtitle = intentNameLookup.intentLookup[newIntent];
  let button2 = {
                  "type":"postback",
                  "title":"Cancel",
                  "payload":"cancel all intent"
               };
  let button1 = {
                "type":"postback",
                "title":"Proceed",
                "payload":intentNameLookup.intentLookup[newIntent]
              };
  fbElements.buttons.push(button1);
  fbElements.buttons.push(button2);
  response.messages[2].payload.facebook.attachment.payload.elements.push(fbElements);
        
  return response;

}

async function listCreate(returnJsonObj, result){
  let response = {
    "speech": returnJsonObj.speech,
    "displayText": returnJsonObj.speech,
    "messages": [
      {
        "type" : 0,
        "platform" : "facebook",
        "speech" : returnJsonObj.speech
      },
      {
        "type" : 0,
        "platform" : "facebook",
        "speech" : "By the way I have noticed you have below tasks pending. What would you like to do?"
      },
      {
        "type": 4,
        "platform": "facebook",
        "payload": {
          "facebook": {
            "attachment": {
                "payload": {
                  "template_type": "list",
                  "top_element_style": "compact",
                  "elements": [ ],
                  "buttons" : [ 
                      {
                          "type":"postback",
                          "title":"Cancel",
                          "payload":"cancel all intent"
                      }
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
  for (let res in result){
      let fbElements = {};
      fbElements.buttons = [];
      let intent = result[res].intentname;
      console.log("&&&&&"+intent);
      let newIntent = await intentNameConverter(intent);
      console.log(newIntent);
      console.log(intentNameLookup.intentLookup[newIntent]);
      fbElements.title = intentNameLookup.intentLookup[newIntent];
      let button = {
                    "type":"postback",
                    "title":"Proceed",
                    "payload":intentNameLookup.intentLookup[newIntent]
                  };
      fbElements.buttons.push(button);
      response.messages[2].payload.facebook.attachment.payload.elements.push(fbElements);
  }
 return response;
}

exports.insertContextLog = insertContextLog;
exports.updateContextLogIntentComplete = updateContextLogIntentComplete;
exports.updateContextLogEndIntent = updateContextLogEndIntent;
exports.selectContextLogFalseIntentComplete = selectContextLogFalseIntentComplete;
exports.intentNameConverter = intentNameConverter;
exports.cardCreate = cardCreate;
exports.listCreate = listCreate;