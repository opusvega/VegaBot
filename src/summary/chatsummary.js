/**
Function Name: Build Text Summary of the conversation for a session
*/

let MongoClient = require('mongodb').MongoClient;
let express = require('express');
let app = express();
let fs = require('fs');
let cmd=require('node-cmd');
let config=require('../config.js');

// Connection URL
let url = config.mongourl;


function summary(req, callback){
  //'mongodb://localhost:27017/chatbotdb';
  //Start Connection to Mongo DB
  let sessionId = req.body.sessionId;
  MongoClient.connect(url,function(err,db){
    if(err){
      console.log("ERROR Connectingto DB!!!");
    } else {
      console.log("Suucessfully Conencted to Db: ChatBOT!!!");
    }

    //Find all documents whose timestamp is greater than 2017-10-25T12:12:04.607Z and returning usersays response fields
    console.log("Finding all docs");
    //Session id to be used instead of timestamp;
    db.collection('ConversationLog').find({sessionId:{$eq: sessionId}, timestamp:{$ge : new Date()-900}}, {usersays:1, response:1,_id:0}).toArray(function(error,docs){
      if(error)
        console.log("OOPS..Couldnt find anything...");
      else{
        console.log("Following are the records------->");
        console.log(docs);
        let usersaysconcat = " ";
        let botsaysconcat = " ";
        //combining all user's and bot's response into respective letiables
        docs.forEach(function(docline){
          usersaysconcat = usersaysconcat + " " + docline.usersays.toString();
          botsaysconcat = botsaysconcat + " " + docline.response.toString();
         // console.log("insidde for loop chatsummary------->"+botsaysconcat);
        });

        //write User Conversations
        fs.writeFile(config.userchatfilepath, usersaysconcat, function(err) {
          if(err) {
            return console.log(err);
          }
          console.log("The file was saved!");
        });
        //write BOT Conversation file
        fs.writeFile(config.botchatfilepath, botsaysconcat, function(err) {
          if(err) {
            return console.log(err);
          }
          console.log("The file was saved!");
        });
      }
    });

    let chatbotsummary_user = " ";//to store user summary
    let chatbotsummary_bot = " ";//to store bot summary
    // run command to summarize user chats using ots tool
    cmd.get(
      `ots ${config.userchatfilepath}`,
       function(err,data,stderr){
       console.log('User Summary is : ');
       chatbotsummary_user = data;
       console.log(chatbotsummary_user);
    });
    // run command to summarize bot's chats using ots tool
    cmd.get(
      `ots ${config.botchatfilepath}`,
       function(err,data,stderr){
          console.log('Bots Summary is : ');
          chatbotsummary_bot = data;
          console.log(chatbotsummary_bot);
       }
    )
    //Insert summary to collection SessionLog
    setTimeout(function() {
      db.collection('SessionLog').insertOne({
        "sessionid" : sessionId,
        "chatsummary_user": chatbotsummary_user,
        "chatsummary_bot" : chatbotsummary_bot
      },function(err,result){
        if(err){
          console.log("Couldnt insert");
        }else{
          console.log("Succesfully inserted");
          callback(err, chatbotsummary_bot, chatbotsummary_user)
        }
      });
    },1500);
    //close DB connection
    setTimeout(function(){
      db.close();
    },2000);
  });
}
exports.summary = summary;
