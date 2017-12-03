const mysql = require("mysql2/promise");
var config = require("../../../config.js");


function createMysqlConnection(){
  const con = mysql.createConnection({
	  host: config.mysqlUrl,
	  user: config.mysqlUser,
	  password : config.mysqlPassword,
	  database: config.mysqldb
	});
  return con;
}

//checking for "transfer-init" intent whether the customer has added any payee or not
async function isCustomerPayeeListNull(req){
	var senderUsername = config.senderUsername; //username should be unique
	var query = 'SELECT * FROM Payee WHERE customername = "'+senderUsername+'";';
	console.log(senderUsername);
	console.log(query);
	var botchatfilepath = config.botchatfilepath;
	console.log(botchatfilepath);
	const con = await createMysqlConnection();
	var [result, fields] = await con.query(query);
	console.log(result);
	if (result.length == 0){
		return false;
	}
	else{
		return true;
	}
}

//checking for "transfer-get-payee" intent - is entered payee exists in customers payee list
async function isGetPayeeExist(req){
	const con = await createMysqlConnection();
	const payee = req.body.result.parameters.payee;
	const query = 'SELECT * FROM Payee WHERE nickname LIKE "%'+payee+'%" OR payeename LIKE "%'+payee+'%";';
	console.log(query);
	var [result,fields] = await con.query(query);
	return result;
}
async function insertPayee(req){
	console.log("entered insertPayee======>");
	const con = await createMysqlConnection();
	const username = config.senderUsername;
	const payee = req.body.result.parameters.payee;
	const nickname = req.body.result.parameters.nickname;
	const bankname = req.body.result.parameters.bankname;
	const accountnumber = req.body.result.parameters.accountnumber;
	const routingnumber = req.body.result.parameters.routingnumber;
	const query = "INSERT INTO Payee VALUES('"+payee+"','"+nickname+
				  "','"+bankname+"',"+routingnumber+","+accountnumber+
				  ",'"+username+"',DEFAULT);";
	try{
		const result = await con.query(query);	
		return true;
	}
	catch (err){
		return false;
	}

}
exports.isCustomerPayeeListNull = isCustomerPayeeListNull;
exports.isGetPayeeExist = isGetPayeeExist;
exports.insertPayee = insertPayee;