/**
Author: Opus Consulting
File name: config.js
Purpose: This is the master configuration file to define all configurations and properties
let fs = require('fs');
fs.readFile('./reflookup/voice.xml', function (err,data){
	if (err){
		console.log(err);
	}
	else{
		TwilioVoice = data;
		console.log(TwilioVoice);
	}
})*/
//let TwilioVoice;

let requestConfig = {
};

// Declare letiables for all reference lookup items
let RemitProductsNew = require('./reflookup/RemitProducts.js');
let PaymentTypeNew = require('./reflookup/PaymentType.js');
let DaysOfWeekNew = require('./reflookup/DaysOfWeek.js');
let ErrorMessagesNew = require('./reflookup/ErrorMessages.js');


// Get actual data (JSON objects) for each of the reference lookup item
let PaymentType = PaymentTypeNew.PaymentType;
let RemitProducts = RemitProductsNew.RemitProducts;
let DaysOfWeek = DaysOfWeekNew.DaysOfWeek;
let ErrorMessages = ErrorMessagesNew.ErrorMessages;

let senderUsername = "mk911";

let mysqlUrl = "localhost";
let mysqlUser = "root";
let mysqlPassword = "root@123";
let mysqldb = "chatbotdb";

let mongourl = 'mongodb://localhost:27017/chatbotdb';
let userchatfilepath = "./summary/usersays.txt";
let botchatfilepath = "./summary/botsays.txt";


exports.requestConfig = requestConfig;
exports.ErrorMessages = ErrorMessages;
exports.PaymentType = PaymentType;
exports.RemitProducts = RemitProducts;
exports.DaysOfWeek = DaysOfWeek;
//exports.TwilioVoice = TwilioVoice;
exports.senderUsername = senderUsername;

exports.mysqldb = mysqldb;
exports.mysqlPassword = mysqlPassword;
exports.mysqlUser = mysqlUser;
exports.mysqlUrl = mysqlUrl;

exports.mongourl = mongourl;
exports.userchatfilepath = userchatfilepath;
exports.botchatfilepath = botchatfilepath;