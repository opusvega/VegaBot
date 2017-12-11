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
	let query = `SELECT * FROM CustomerAcct WHERE username = ?;`;
	let con = await createMysqlConnection();
	let [result,fields] = await con.execute(query,[username]);
	return result[0].contact;
}

async function checkIfSessionIdPresent(req){
	let sessionid = req.body.sessionId;
	let con = await createMysqlConnection();
	let query = `SELECT username, contact FROM CustomerAcct WHERE sessionid = ?;`;
	let [result, fields] = await con.execute(query,[sessionid]);
	return result;
}

async function insertSessionId(req){
	let sessionid = req.body.sessionId;
	let username = req.body.result.parameters.username;
	let con = await createMysqlConnection();
	let query = `UPDATE CustomerAcct SET sessionid = ? WHERE username = ?;`;
	let result = await con.execute(query,[sessionid,username]);
	console.log(result[0].affectedRows);
	return result;
}

async function getUsername(req){
	console.log("inside global getUsername==========>");
	let sessionId = req.body.sessionId;
	console.log("inside global getUsername==========>",sessionId);
	let con = await createMysqlConnection();
	let query = `SELECT username FROM CustomerAcct WHERE sessionid = ?;`;
	console.log("inside global getUsername==========>",query);
	let [result,fields] = await con.execute(query,[sessionId]);
	console.log("inside global getUsername==========>",result);
	return result[0].username;
}

exports.getContactOfUser = getContactOfUser;
exports.checkIfSessionIdPresent = checkIfSessionIdPresent;
exports.insertSessionId = insertSessionId;
exports.getUsername = getUsername;
