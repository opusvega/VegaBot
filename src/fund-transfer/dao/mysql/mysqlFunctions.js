let mysql = require("mysql2/promise");
let config = require("../../../config.js");


function createMysqlConnection(){
  let con = mysql.createConnection({
	  host: config.mysqlUrl,
	  user: config.mysqlUser,
	  password : config.mysqlPassword,
	  database: config.mysqldb
	});
  return con;
}

async function getContact(req){
	let username = config.senderUsername;
	let sessionId = req.body.sessionId;
	let con = await createMysqlConnection();
	let query = "SELECT contact FROM CustomerAcct WHERE sessionid = '"+sessionId+"';";
	let [result,fields] = await con.query(query);
	console.log("getContact------------->");
	console.log(result);
	return result[0].contact;
}

async function getUsername(req){
	let sessionId = req.body.sessionId;
	let con = await createMysqlConnection();
	let query = "SELECT username FROM CustomerAcct WHERE sessionid = '"+sessionId+"';";
	let [result,fields] = await con.query(query);
	return result[0].username;
}

//checking for "transfer-init" intent whether the customer has added any payee or not
async function isCustomerPayeeListNull(req){
	
	let sessionId = req.body.sessionId;
	let senderUsername = await getUsername(req); //username should be unique

	let query = 'SELECT * FROM Payee WHERE customername = "'+senderUsername+'";';
	console.log(senderUsername);
	console.log(query);
	let botchatfilepath = config.botchatfilepath;
	console.log(botchatfilepath);
	let con = await createMysqlConnection();
	try{

		let [result, fields] = await con.query(query);
		console.log(result);
		if (result.length == 0){
			return 0; // earlier was false
		}
		else{
			return 1; // earlier was true
		}
	} catch (err){
		return false;
	}
}

//checking for "transfer-get-payee" intent - is entered payee exists in customers payee list
async function isGetPayeeExist(req){
	let con = await createMysqlConnection();
	let username = await getUsername(req);
	let payee = req.body.result.parameters.payee;
	let query = 'SELECT * FROM Payee WHERE nickname LIKE "%'+payee+'%" OR payeename LIKE "%'+payee+'%" AND customername = "'+username+'";';
	console.log(query);
	try{
		let [result,fields] = await con.query(query);
		return result;

	} catch (err){
		return false;
	}
}

//inserting payee
async function insertPayee(req){
	console.log("entered insertPayee======>");
	let con = await createMysqlConnection();
	let username = await getUsername(req);
	let payee = req.body.result.parameters.payee;
	let nickname = req.body.result.parameters.nickname;
	let bankname = req.body.result.parameters.bankname;
	let accountnumber = req.body.result.parameters.accountnumber;
	let routingnumber = req.body.result.parameters.routingnumber;
	let query = "INSERT INTO Payee VALUES('"+payee+"','"+nickname+
				  "','"+bankname+"',"+routingnumber+","+accountnumber+
				  ",'"+username+"',DEFAULT);";
	try{
		let result = await con.query(query);	
		return true;
	}
	catch (err){
		return false;
	}
}

//checking balance of user
async function checkBalance(req){
	console.log("entered checkBalance function=====>");
	let con = await createMysqlConnection();
	let username = await getUsername(req);
	console.log("checkBalance  username======>"+username);
	let query = "SELECT * FROM CustomerAcct WHERE 	username = '"+username+"';";
	try{
		let [balance,fields] = await con.query(query);
		return balance[0].balance; 
	}
	catch (err){
		return false;
	}
	
}// upadte otp Code if not present then insert it
async function updateOTPCode(otpCode,req){
	let con = await createMysqlConnection();
	let username = await getUsername(req);
	let query = "UPDATE CustomerAcct SET otp = "+otpCode+" WHERE username = '"+username+"';";
	console.log(query);
	let result = await con.query(query);
	console.log("updateOTPCode-------------->");
	console.log(result);
	console.log(result.affectedRows);
}


async function isOTPValid(otpCode,req){
	let con = await createMysqlConnection();
	let username = await getUsername(req);
	let query = "SELECT otp FROM CustomerAcct WHERE 	username = '"+username+"';";
	let [result,fields] = await con.query(query);
	console.log("isOTPValid=========>",result[0].otp);
	if(otpCode == result[0].otp){
		return true;
	}
	else{
		return false;
	}
}

async function updateBalance(req){
	let amount = req.body.result.parameters.amount.currency.amount;
	let username = await getUsername(req);
	let con =await createMysqlConnection();
	let query = "UPDATE CustomerAcct SET balance = balance - "+amount+" WHERE username = '"+username+"';";
	let result = await con.query(query);
	console.log(result.affectedRows);
}

async function getTransferDetails(req){
	let uid = req.body.result.parameters.uid;
	let con = await createMysqlConnection();
	let newUid = uid.substr(-7);
	let query = "SELECT * FROM Payee WHERE uid = "+parseInt(newUid)+";";
	let [result, fields] = await con.query(query);
	return result[0];

}
async function insertFundTransfer(req){
	let result = await getTransferDetails(req);
	let username = await getUsername(req);
	let receiverName = result.payeename;
	let bankname = result.bankname;
	let routingNumber = result.routingnumber;
	let amtXfered = req.body.result.parameters.amount.currency.amount;
	let accountNumber = result.accountnumber;
	let xferDate = "DEFAULT";
	let xferedBy = username;
	let scheduledDate = "NOW()";
	let con =await createMysqlConnection();
	let query = "INSERT INTO FundXfer VALUES ('"+receiverName+
												"','"+bankname+
												"','"+routingNumber+
												"',"+amtXfered+
												","+accountNumber+
												","+xferDate+
												",'"+username+
												"',"+scheduledDate+
												");";
	console.log("insertFundTransfer==========>",query);
	let result1 = await con.query(query);
	console.log(result1.affectedRows);
}

exports.isCustomerPayeeListNull = isCustomerPayeeListNull;
exports.isGetPayeeExist = isGetPayeeExist;
exports.insertPayee = insertPayee;
exports.checkBalance = checkBalance;
exports.getContact = getContact;
exports.updateOTPCode = updateOTPCode;
exports.isOTPValid = isOTPValid;
exports.updateBalance = updateBalance;
exports.insertFundTransfer = insertFundTransfer;
exports.getTransferDetails = getTransferDetails;