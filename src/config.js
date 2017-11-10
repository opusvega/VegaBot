/**
Author: Opus Consulting
File name: config.js
Purpose: This is the master configuration file to define all configurations and properties
*/
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


exports.requestConfig = requestConfig;
exports.ErrorMessages = ErrorMessages;
exports.PaymentType = PaymentType;
exports.RemitProducts = RemitProducts;
exports.DaysOfWeek = DaysOfWeek;