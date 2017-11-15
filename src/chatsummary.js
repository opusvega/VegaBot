/**
Function Name: Build Text Summary of the conversation for a session
*/

var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var app = express();
var fs = require('fs');
var cmd=require('node-cmd');
var config=require('./config.js');

// Connection URL
var url = config.mongourl;


function summary(){
  //'mongodb://localhost:27017/chatbotdb';
  //Start Connection to Mongo DB
  MongoClient.connect(url,function(err,db){
    if(err){
      console.log("ERROR Connectingto DB!!!");
    } else {
      console.log("Suucessfully Conencted to Db: ChatBOT!!!");
    }

    //Find all documents whose timestamp is greater than 2017-10-25T12:12:04.607Z and returning usersays response fields
    console.log("Finding all docs");
    //Session id to be used instead of timestamp;
    db.collection('ConversationLog').find({timestamp:{$gte: '2017-10-25T12:12:04.607Z'}, userid:''}, {usersays:1, response:1,_id:0}).toArray(function(error,docs) {
      if(error)
        console.log("OOPS..Couldnt find anything...");
      else{
        console.log("Following are the records");
        //console.log(docs);
        var usersaysconcat = " ";
        var botsaysconcat = " ";
        //combining all user's and bot's response into respective variables
        docs.forEach(function(docline){
        usersaysconcat = usersaysconcat + " " + docline.usersays.toString();
        botsaysconcat = botsaysconcat + " " + docline.response.toString();
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

  var chatbotsummary_user = " ";//to store user summary
  var chatbotsummary_bot = " ";//to store bot summary
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
      "sessionid" : 12345,
      "userid" : 2,
      "chatsummary_user": chatbotsummary_user,
      "chatsummary_bot" : chatbotsummary_bot
    },function(err,result){
      if(err){
        console.log("Couldnt insert");
      }else{
        console.log("Succesfully inserted");
      }
    });
  },1500);
  //close DB connection
  setTimeout(function(){
    db.close();
  },2000);
});
}
