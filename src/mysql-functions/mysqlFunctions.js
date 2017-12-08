let mysql = require("mysql2/promise");
let config = require("../config.js");

function createMysqlConnection(){
	let con = mysql.createConnection({
	  host: config.mysqlUrl,
	  user: config.mysqlUser,
	  password : config.mysqlPassword,
	  database: config.mysqldb
	});
  return con;
}


async function getContactOfUser(req){
	//let username = req.body.result.parameters.username;
	let username = config.senderUsername;
	let query = "SELECT * FROM CustomerAcct WHERE username = '"+username+"';";
	let con = await createMysqlConnection();
	let [result,fields] = await con.query(query);
	return result[0].contact;
}

async function checkIfSessionIdPresent(req){
	let sessionid = req.body.sessionId;
	let con = await createMysqlConnection();
	let query = "SELECT username, contact FROM CustomerAcct WHERE sessionid = '"+sessionid+"';";
	let [result, fields] = await con.query(query);
	return result;
}

async function insertSessionId(req){
	let sessionid = req.body.sessionId;
	let username = req.body.result.parameters.username;
	let con = await createMysqlConnection();
	let query = "UPDATE CustomerAcct SET sessionid = '"+sessionid+"' WHERE username = '"+username+"';";
	let result = await con.query(query);
	console.log(result[0].affectedRows);
	return result;
}

async function getUsername(req){
	let sessionId = req.body.sessionId;
	let con = await createMysqlConnection();
	let query = "SELECT username FROM CustomerAcct WHERE sessionid = '"+sessionId+"';";
	let [result,fields] = await con.query(query);
	return result[0].username;
}

exports.getContactOfUser = getContactOfUser;
exports.checkIfSessionIdPresent = checkIfSessionIdPresent;
exports.insertSessionId = insertSessionId;
exports.getUsername = getUsername;
