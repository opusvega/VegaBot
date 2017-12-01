var mysql = require('mysql2/promise');
var config = require("../../../config.js");

//mysql connection
function createMysqlConnection(){
    var con = mysql.createConnection({
        host: config.mysqlUrl,
        user: config.mysqlUser,
        password: config.mysqlPassword,
        database : config.mysqldb
    });
    return con;
}

//insert a new biller in db
async function insertBiller(req){
    var BILLERNAME = req.body.result.parameters.Billers;
    var BILLERTYPE = req.body.result.parameters.BillerType;
    var AUTOPAYMODE = req.body.result.parameters.AutoPayMode;
    var AUTOPAYREQUIRED = req.body.result.parameters.AutoPayRequired;
    var CUSTID = req.body.result.parameters.CustId;
    var LIMITAMT = req.body.result.parameters.LimitAmt;
    var SSN = req.body.result.parameters.SSN;
   //fetch balance from user db
    var max = 80;
    var min = 20;
    var AMTDUE = Math.floor(Math.random() * (max - min + 1)) + min; // generate random amt between 20-80

    var query = "SELECT * FROM CustomerBiller WHERE ssn = " +SSN+ " AND billername = '"
                 +BILLERNAME+"' AND billertype = '"+BILLERTYPE+ "';" ;
    var con = await createMysqlConnection();
    var [result, fields] = await con.query(query);

    if(result.length == 0){ // no such biller and ssn combo exists then add entry
        var sql = "INSERT INTO CustomerBiller (ssn, customerbillerid, billername, billertype, amtdue, duedate, autopayrequired, autopaymode, limitamt) VALUES"+
                  " ( "+SSN+ "," +CUSTID+ ", '"+BILLERNAME+ "', '"+BILLERTYPE+ "', '"+AMTDUE+"', NOW(), '"+AUTOPAYREQUIRED+"', '"+AUTOPAYMODE+"', "+LIMITAMT+" );";
        var insertResult =await con.query(sql);
        console.log(insertResult);
        return true; //added successfully 
    }
    else{
        return false; //cant add => already exists
    }
} 

//fetch list of billers registered on user ssn
async function selectBillersToPay(req){
    var SSN = req.body.result.parameters.SSN;
    var query = "SELECT * FROM CustomerBiller WHERE ssn = "+SSN + " AND amtdue != 0";
    var con = await createMysqlConnection();
    var [result, fields] = await con.query(query);
    console.log("Inside selectBillersToPay -------->");
    console.log(result);
    return result;
}

//find ssn to check if given ssn exists in DB 
async function findSSN(req){
    var ssn = req.body.result.parameters.SSN;
    console.log("The value of ssn is --------->"+ssn);
    var con = await createMysqlConnection();
    //var query = "SELECT * FROM ssnbalance WHERE ssn = "+ssn+";";
    let [ result, fields ] = await con.execute('SELECT * FROM `ssnbalance` WHERE `ssn` = ?',[ssn]);
    console.log("the ssnbalance result is ");
    console.log(result);
    return result;
}

//add ssn if ssn provided does not exists
async function addSSN(req){
    var SSN = req.body.result.parameters.SSN;
    var BALANCE = Math.floor(Math.random() * (1000-100 + 1)) + 100; // add random balance in 100-1000
    var query = "INSERT INTO ssnbalance VALUES ("+SSN+","+BALANCE+" );"; // cols are : ssn , balance
    var con = await createMysqlConnection();
    var result = await con.query(query);
    console.log("successfully inserted into ssnbalance");
    return SSN;
}

//finds balance of a user using ssn
async function checkBalance(req){
    var SSN = req.body.result.parameters.SSN;
    var query = "SELECT balance from ssnbalance WHERE ssn = "+SSN+";";
    var con = await createMysqlConnection();
    var [ result , fields] = await con.query(query);
    console.log("checkBalance=========>");
    console.log(result);
    return result[0].balance;
}

//function to find amtdue and limit amount for further processing
async function getAmt(req){
    var SSN = req.body.result.parameters.SSN;
    var BILLERNAME = req.body.result.parameters.billers;
    //fetch amtdue and limit amt from db for particular user and biller
    var query = "SELECT amtdue, limitamt from CustomerBiller where ssn = "+SSN+ " AND billername = '"+BILLERNAME+"';"; 
    var con = await createMysqlConnection();
    var [ result , fields] = await con.query(query);
    console.log("getAmt===============>");
    console.log(result);
    return result[0];
}

//update balance
async function updateBalance(req, AMT){
    var SSN = req.body.result.parameters.SSN;
    var BILLERNAME = req.body.result.parameters.billers;
    var BILLERTYPE = req.body.result.parameters.BillerType;
    var con = await createMysqlConnection();

    //update ssnbalance table to deduct amt from balance
    var query1 = "UPDATE ssnbalance SET balance = balance - " +AMT+ " WHERE ssn = "+SSN+";";//deduct balance from sssnbalance table
    console.log(query1);
    var result1 = await con.query(query1);
    console.log("update ssnbalance============>");
    console.log(result1);
    
    //update CustomerBiller to deduct amtdue 
    var query2 = "UPDATE CustomerBiller SET amtdue = amtdue - " +AMT+ " WHERE ssn = " + SSN + " AND billername = '"+BILLERNAME+
                 "' AND billertype = '"+BILLERTYPE+"';";
                 console.log(query2);
    var result2 = await con.query(query2);
    console.log("update CustomerBiller==========>");
    console.log(result2);
}



exports.createMysqlConnection = createMysqlConnection;
exports.insertBiller = insertBiller;
exports.selectBillersToPay = selectBillersToPay;
exports.findSSN = findSSN;
exports.addSSN = addSSN;
exports.updateBalance = updateBalance;
exports.getAmt = getAmt;
exports.checkBalance = checkBalance;