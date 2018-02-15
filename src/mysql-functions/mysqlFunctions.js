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
async function getContact(req){
	let email = req.body.result.parameters.email;
	let sessionId = req.body.sessionId;
	let pool = await getConnectionPool();
	let con = await pool.getConnection();
	let query = `SELECT contact,email FROM CustomerAcct WHERE email = ?;`;
	let [result,fields] = await con.execute(query,[email]);
	console.log("getContact------------->");
	console.log(result);
	con.release();
	return result[0];
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
async function checkEmailId(req){
	let emailId = req.body.result.parameters.email;
	let query = `SELECT * FROM CustomerAcct WHERE email = ?;`;
	let pool = await getConnectionPool();
	let con = await pool.getConnection();
	let [result, fields] = await con.execute(query,[emailId]);
	return result;
}

async function insertSessionIdByEmail(req){
	let sessionid = req.body.sessionId;
	let email = req.body.result.parameters.email;
	let pool = await getConnectionPool();
	let con = await pool.getConnection();
	let query = `UPDATE CustomerAcct SET sessionid = ? WHERE email = ?;`;
	let result = await con.execute(query,[sessionid,email]);
	console.log(result[0].affectedRows);
	await con.query("commit;");
	con.release();
	return result;
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

async function isOTPValid(req){
	let otpCode =req.body.result.parameters.otp;
	let emailId = req.body.result.parameters.email;
	let pool = await getConnectionPool();
	let con = await pool.getConnection();
	//let username = await getUsername(req);
	let query = `SELECT otp FROM CustomerAcct WHERE email = ?;`;
	let [result,fields] = await con.execute(query,[emailId]);
	console.log("isOTPValid=========>",result[0].otp);
	con.release();
	if(otpCode == result[0].otp){
		return true;
	}
	else{
		return false;
	}
}

async function getUsernameFromEmailId(req){
	let emailId = req.body.result.parameters.email;
	let pool = await getConnectionPool();
	let con = await pool.getConnection();
	let query = `SELECT username FROM CustomerAcct WHERE email = ?;`;
	let [result,fields] = await con.execute(query,[emailId]);
	console.log("inside getUsernameFromEmailId===>",result[0]);
	return result[0].username;
}

async function updateOTPCode(otpCode,req){
	let email = req.body.result.parameters.email;
	let pool = await getConnectionPool();
	let con = await pool.getConnection();
	let query = `UPDATE CustomerAcct SET otp = ? WHERE email = ?`;
	console.log(query);
	let result = await con.execute(query,[otpCode,email]);
	console.log("updateOTPCode-------------->");
	console.log(result);
	console.log(result.affectedRows);
	await con.query("commit;");
	con.release();
}

async function checkResponseStatus(req,res){
	let speech = res.body.speech;
	let sessionId = req.body.sessionId;
	let pool = await getConnectionPool();
	let con = await pool.getConnection();
	let query = `SELECT * FROM resrecord WHERE speech = ? AND sessionid = ?;`;
	let [result, fields] = await con.execute(query,[speech, sessionId]);
	if(result.length !=0 ){
		if (result[0].response == speech && result[0].count == 3 ){
			await setCountZero(speech, sessionId);
			return true;
		}
		else{
			await updateResponseCount(speech, sessionId);
			return false;
		}
	}
	else{
		await insertResponseRecord(speech, sessionId);
		return false;
	}
}

async function setCountZero(speech,sessionId){
	let pool = await getConnectionPool();
	let con = await pool.getConnection();
	let query = `UPDATE resrecord SET count = 0 WHERE speech = ? AND sessionid = ?;`;
	let result = await con.execute(query,[speech,sessionId]);
	console.log("inside setCountZero===>",result);
}

async function updateResponseCount(speech, sessionId){
	let pool = await getConnectionPool();
	let con = await pool.getConnection();
	let query = `UPDATE resrecord SET count = count+1 WHERE speech = ? AND sessionid = ?;`;
	let result = await con.execute(query,[speech,sessionId]);
	console.log("inside updateResponseCount===>",result);
}

async function insertResponseRecord(speech, sessionId){
	let pool = await getConnectionPool();
	let con = await pool.getConnection();
	let query = `INSERT INTO resrecord VALUES (?,0,?);`;
	let result = await con.execute(query,[speech,sessionId]);
	console.log("inside setCountZero===>",result);
}

exports.checkResponseStatus = checkResponseStatus;
exports.getContactOfUser = getContactOfUser;
exports.checkIfSessionIdPresent = checkIfSessionIdPresent;
exports.insertSessionId = insertSessionId;
exports.getUsername = getUsername;
exports.getContact = getContact;
exports.isOTPValid = isOTPValid;
exports.getUsernameFromEmailId = getUsernameFromEmailId;
exports.updateOTPCode = updateOTPCode;
exports.insertSessionIdByEmail = insertSessionIdByEmail;
exports.checkEmailId = checkEmailId;