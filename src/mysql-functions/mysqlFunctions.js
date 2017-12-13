let mysql = require("mysql2/promise");
let config = require("../config.js");
let callmysqlpool = require("./createMysqlSingleton.js");

async function getConnectionPool() {
  try {
    return (await callmysqlpool.getPool());
  }
  catch (err) {
    console.log("Error in creating Mysql Pool");
    return false;
  }
}

async function getContactOfUser(req){
	//let username = req.body.result.parameters.username;
	let username = config.senderUsername;
	let query = `SELECT * FROM CustomerAcct WHERE username = ?;`;
	let pool = await getConnectionPool();
	let con = await pool.getConnection();
	let [result,fields] = await con.execute(query,[username]);
	con.release();
	return result[0].contact;
}

async function checkIfSessionIdPresent(req){
	let sessionid = req.body.sessionId;
	let pool = await getConnectionPool();
	let con = await pool.getConnection();
	let query = `SELECT username, contact FROM CustomerAcct WHERE sessionid = ?;`;
	let [result, fields] = await con.execute(query,[sessionid]);
	con.release();
	return result;
}

async function insertSessionId(req){
	let sessionid = req.body.sessionId;
	let username = req.body.result.parameters.username;
	let pool = await getConnectionPool();
	let con = await pool.getConnection();
	let query = `UPDATE CustomerAcct SET sessionid = ? WHERE username = ?;`;
	let result = await con.execute(query,[sessionid,username]);
	console.log(result[0].affectedRows);
	await con.query("commit;");
	con.release();
	return result;
}

async function getUsername(req){
	console.log("inside global getUsername==========>");
	let sessionId = req.body.sessionId;
	console.log("inside global getUsername==========>",sessionId);
	let pool = await getConnectionPool();
	let con = await pool.getConnection();
	let query = `SELECT username FROM CustomerAcct WHERE sessionid = ?;`;
	console.log("inside global getUsername==========>",query);
	let [result,fields] = await con.execute(query,[sessionId]);
	console.log("inside global getUsername==========>",result);
	con.release();
	return result[0].username;
}

exports.getContactOfUser = getContactOfUser;
exports.checkIfSessionIdPresent = checkIfSessionIdPresent;
exports.insertSessionId = insertSessionId;
exports.getUsername = getUsername;
