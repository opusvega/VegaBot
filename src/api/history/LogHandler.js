var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/chatbotdb";

//Insert document in collection
function MongoInsert(historyObj){
	MongoClient.connect(url, function(err, db) {
  		if (err) throw err;
  		db.collection("ConversationLog").insertOne(historyObj, function(err, res) {
    		if (err) throw err;
    		console.log("1 document inserted");
    		db.close();
  		});
	});	
}
exports.MongoInsert = MongoInsert;