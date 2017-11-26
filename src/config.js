/**
Author: Opus Consulting
File name: config.js
Purpose: This is the master configuration file to define all configurations and properties
var fs = require('fs');
fs.readFile('./reflookup/voice.xml', function (err,data){
	if (err){
		console.log(err);
	}
	else{
		TwilioVoice = data;
		console.log(TwilioVoice);
	}
})*/
//var TwilioVoice;

var requestConfig = {
};

// Declare variables for all reference lookup items
var RemitProducts = require('./reflookup/RemitProducts.js');
var PaymentType = require('./reflookup/PaymentType.js');
var DaysOfWeek = require('./reflookup/DaysOfWeek.js');
var ErrorMessages = require('./reflookup/ErrorMessages.js');


// Get actual data (JSON objects) for each of the reference lookup item
var PaymentType = PaymentType.PaymentType;
var RemitProducts = RemitProducts.RemitProducts;
var DaysOfWeek = DaysOfWeek.DaysOfWeek;
var ErrorMessages = ErrorMessages.ErrorMessages;

var mysqlUrl = "localhost";
var mysqlUser = "root";
var mysqlPassword = "root@123";
var mysqldb = "chatbotdb";

var mongourl = 'mongodb://localhost:27017/chatbotdb';
var userchatfilepath = "./summary/usersays.txt";
var botchatfilepath = "./summary/botsays.txt";

exports.requestConfig = requestConfig;
exports.ErrorMessages = ErrorMessages;
exports.PaymentType = PaymentType;
exports.RemitProducts = RemitProducts;
exports.DaysOfWeek = DaysOfWeek;
//exports.TwilioVoice = TwilioVoice;

exports.mysqldb = mysqldb;
exports.mysqlPassword = mysqlPassword;
exports.mysqlUser = mysqlUser;
exports.mysqlUrl = mysqlUrl;

exports.mongourl = mongourl;
exports.userchatfilepath = userchatfilepath;
exports.botchatfilepath = botchatfilepath;
