let mysql = require('mysql2/promise');
let config = require("../../../config.js");

//mysql connection
function createMysqlConnection(){
    let con = mysql.createConnection({
        host: config.mysqlUrl,
        user: config.mysqlUser,
        password: config.mysqlPassword,
        database : config.mysqldb
    });
    return con;
}

//insert a new biller in db
async function insertBiller(req){
    let BILLERNAME = req.body.result.parameters.Billers;
    let BILLERTYPE = req.body.result.parameters.BillerType;
    let AUTOPAYMODE = req.body.result.parameters.AutoPayMode;
    let AUTOPAYREQUIRED = req.body.result.parameters.AutoPayRequired;
    let CUSTID = req.body.result.parameters.CustId;
    let LIMITAMT = req.body.result.parameters.LimitAmt;
    let SSN = req.body.result.parameters.SSN;
   //fetch balance from user db
    let max = 80;
    let min = 20;
    let AMTDUE = Math.floor(Math.random() * (max - min + 1)) + min; // generate random amt between 20-80

    let query = "SELECT * FROM CustomerBiller WHERE ssn = " +SSN+ " AND billername = '"
                 +BILLERNAME+"' AND billertype = '"+BILLERTYPE+ "';" ;
   
    try{
        let con = await createMysqlConnection();
        let [result, fields] = await con.query(query);
        
            if(result.length == 0){ // no such biller and ssn combo exists then add entry
                let sql = "INSERT INTO CustomerBiller (ssn, customerbillerid, billername, billertype, amtdue, duedate, autopayrequired, autopaymode, limitamt) VALUES"+
                          " ( "+SSN+ "," +CUSTID+ ", '"+BILLERNAME+ "', '"+BILLERTYPE+ "', '"+AMTDUE+"', NOW(), '"+AUTOPAYREQUIRED+"', '"+AUTOPAYMODE+"', "+LIMITAMT+" );";
                let insertResult =await con.query(sql);
                console.log(insertResult);
                return 1; //added successfully // EARLIER WAS TRUE
            }
            else{
                return 0; //cant add => already exists // EARLIER WAS FALSE
            }
    }
    catch (err){
        	return false;
    }
    
} 

//fetch list of billers registered on user ssn
async function selectBillersToPay(req){
    console.log("Inside selectBillersToPay -------->");
    let SSN = req.body.result.parameters.SSN;
    let query = "SELECT * FROM CustomerBiller WHERE ssn = "+SSN + " AND amtdue != 0";
    try{
        let con = await createMysqlConnection();
        let [result, fields] = await con.query(query);
        console.log(result);
        return result;
    }
    catch (err){
        return false;
    }   
}

//find ssn to check if given ssn exists in DB 
async function findSSN(req){
    let ssn = req.body.result.parameters.SSN;
    console.log("The value of ssn is --------->"+ssn);
    try{
        let con = await createMysqlConnection();
        //let query = "SELECT * FROM ssnbalance WHERE ssn = "+ssn+";";
        let [ result, fields ] = await con.execute('SELECT * FROM `ssnbalance` WHERE `ssn` = ?',[ssn]);
        console.log("the ssnbalance result is ");
        console.log(result);
        return result;
    }
     catch (err){
            return false;
    }
    
}

//add ssn if ssn provided does not exists
async function addSSN(req){
    let SSN = req.body.result.parameters.SSN;
    let BALANCE = Math.floor(Math.random() * (1000-100 + 1)) + 100; // add random balance in 100-1000
    let query = "INSERT INTO ssnbalance VALUES ("+SSN+","+BALANCE+" );"; // cols are : ssn , balance
    try{
        let con = await createMysqlConnection();
        let result = await con.query(query);
        console.log("successfully inserted into ssnbalance");
        return SSN;
    }
    catch (err){
        return false;
    }
}

//finds balance of a user using ssn
async function checkBalance(req){
    let SSN = req.body.result.parameters.SSN;
    let query = "SELECT balance from ssnbalance WHERE ssn = "+SSN+";";
    try{
        let con = await createMysqlConnection();
        let [ result , fields] = await con.query(query);
        console.log("checkBalance=========>");
        console.log(result);
        return result[0].balance;
    }
    catch (err){
        return false;
    } 
}

//function to find amtdue and limit amount for further processing
async function getAmt(req){
    let SSN = req.body.result.parameters.SSN;
    let BILLERNAME = req.body.result.parameters.billers;
    //fetch amtdue and limit amt from db for particular user and biller
    let query = "SELECT amtdue, limitamt from CustomerBiller where ssn = "+SSN+ " AND billername = '"+BILLERNAME+"';"; 
    try{
        let con = await createMysqlConnection();
        console.log(query);
        let [ result , fields] = await con.query(query);
        console.log("getAmt===============>");
        console.log(result);
        return result[0];
    }
    catch (err){
        return false;
    }
}

//update balance
async function updateBalance(req, AMT){
    let SSN = req.body.result.parameters.SSN;
    let BILLERNAME = req.body.result.parameters.billers;
    let BILLERTYPE = req.body.result.parameters.BillerType;
    try{
        let con = await createMysqlConnection();
        
            //update ssnbalance table to deduct amt from balance
            let query1 = "UPDATE ssnbalance SET balance = balance - " +AMT+ " WHERE ssn = "+SSN+";";//deduct balance from sssnbalance table
            console.log(query1);
            let result1 = await con.query(query1);
            console.log("update ssnbalance============>");
            console.log(result1);
            
            //update CustomerBiller to deduct amtdue 
            let query2 = "UPDATE CustomerBiller SET amtdue = amtdue - " +AMT+ " WHERE ssn = " + SSN + " AND billername = '"+BILLERNAME+
                         "' AND billertype = '"+BILLERTYPE+"';";
                         console.log(query2);
            let result2 = await con.query(query2);
            console.log("update CustomerBiller==========>");
            console.log(result2);
            return true;
    }
   catch (err){
       return false;
   }
}



exports.createMysqlConnection = createMysqlConnection;
exports.insertBiller = insertBiller;
exports.selectBillersToPay = selectBillersToPay;
exports.findSSN = findSSN;
exports.addSSN = addSSN;
exports.updateBalance = updateBalance;
exports.getAmt = getAmt;
exports.checkBalance = checkBalance;