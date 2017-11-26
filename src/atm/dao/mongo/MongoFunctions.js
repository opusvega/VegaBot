var MongoClient = require('mongodb').MongoClient;
var config=require('../../../config.js');
var url = config.mongourl;

//fetching the stored userchatsummary and botchatsummary in SessionLog
function findSummary(callback){
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  db.collection("SessionLog").find({}, function(err, result) {
	    if (err) throw err;
	    console.log("Inside find summary--------------->")
	    console.log(result);
	    callback(err,result);
	    db.close();
	  });
	});	
}
exports.findSummary = findSummary;

