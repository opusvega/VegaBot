var mysql = require('mysql');
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
    createMysqlConnection().connect(async function(err) {
        if (err) throw err;
        else{
            console.log("Connected!");

            //check if biller already exist for that ssn
            var query = "SELECT * FROM CustomerBiller WHERE ssn = " +SSN+ " AND billername = '"+BILLERNAME+"' AND billertype = '"+BILLERTYPE+ "';" ;
            var result = await  createMysqlConnection().query(query);
            if(result.length == 0){ // no such biller and ssn combo exists then add entry
                var sql = "INSERT INTO CustomerBiller (ssn, customerbillerid, billername, billertype, amtdue, duedate, autopayrequired, autopaymode, limitamt) VALUES"+
                " ( "+SSN+ "," +CUSTID+ ", '"+BILLERNAME+ "', '"+BILLERTYPE+ "', '"+AMTDUE+"', NOW(), '"+AUTOPAYREQUIRED+"', '"+AUTOPAYMODE+"', "+LIMITAMT+" );";
                 var insertResult =await createMysqlConnection().query(sql);
                 console.log(insertResult);
                 return true; //added successfully 
            }
            else{
                return false; //cant add => already exists
            }

           
        }

    });

} 

//fetch list of billers registered on user ssn
function selectBillersToPay(req,callback){
    var SSN = req.body.result.parameters.SSN;
    var query = "SELECT * FROM CustomerBiller WHERE ssn = "+SSN + " AND amtdue != 0";
createMysqlConnection().connect(function(err) {
if (err) throw err;
else{
 createMysqlConnection().query(query, function (err, rows) {
     if (err) throw err;
     else {
         console.log(rows);
         callback(rows);
          }
        });
    }

    });
}

//find ssn to check if given ssn exists in DB 
function findSSN(req){
    var ssn = req.body.result.parameters.SSN;
    console.log("The value of ssn is --------->"+ssn);
    createMysqlConnection().connect(function(err) {
        if (err) {
            console.log("Gotcha error!");
            throw err;   
        }
        else{
            
            createMysqlConnection().query("SELECT * FROM ssnbalance WHERE ssn = 455654", function (err, result, fields) {
                if (err) throw err;
                console.log(result);
                console.log(result.length);
                return result;
            });
        }
    });
}

//add ssn if ssn provided does not exists
function addSSN(req){
    var SSN = req.body.result.parameters.SSN;
    var BALANCE = Math.floor(Math.random() * (1000-100 + 1)) + 100; // add random balance in 100-1000
    var query = "INSERT INTO ssnbalance VALUES ("+SSN+","+BALANCE+" );"; // cols are : ssn , balance
    createMysqlConnection().connect(function(err) {
        if (err) throw err;
        else{
         createMysqlConnection().query(query, function (err) {
             if (err) throw err;
             else {
                 console.log("successfully inserted into ssnbalance");
                  }
                });
            }
            });
            return SSN;
}

//finds balance of a user using ssn
function checkBalance(req){
    var SSN = req.body.result.parameters.SSN;
    var query = "SELECT balance from ssnbalance WHERE ssn = "+SSN+";";
    createMysqlConnection().connect(function(err) {
        if (err) throw err;
        else{
         createMysqlConnection().query(query, function (err, result) {
             if (err) throw err;
             else {
                 console.log(result);
                 return result[0].balance;
                  }
                });
            }
            });
}

//function to find amtdue and limit amount for further processing
function getAmt(req){
    var SSN = req.body.result.parameters.SSN;
    var BILLERNAME = req.body.result.parameters.BillerType;
    //fetch amtdue and limit amt from db for particular user and biller
    var query = "SELECT amtdue, limitamt from customerBiller where ssn = "+SSN+ " AND billername = '"+billername+"';"; 
    createMysqlConnection().connect(function(err) {
        if (err) throw err;
        else{
         createMysqlConnection().query(query, function (err, result) {
             if (err) throw err;
             else {
                 console.log(result);
                 return result[0];
                  }
                });
            }
            });

}

//update balance
function updateBalance(req, AMT){
    var SSN = req.body.result.parameters.SSN;
    var BILLERNAME = req.body.result.parameters.BillerType;
    var query1 = "UPDATE ssnbalance SET balance = balance - " +AMT+ "WHERE ssn = "+SSN+";";//deduct balance from sssnbalance table
    createMysqlConnection().connect(function(err) {
        if (err) throw err;
        else{
         createMysqlConnection().query(query, function (err, result) {
             if (err) throw err;
             else {
                 console.log(result);
                  }
                });
            }
            });
    //update CustomerBiller to deduct amtdue 
    var query2 = "UPDATE CustomerBiller SET amtdue = amtdue - " +AMT+ "WHERE ssn = "+SSN+ "AND billername = '"+BILLERNAME+"';"
    createMysqlConnection().connect(function(err) {
        if (err) throw err;
        else{
         createMysqlConnection().query(query, function (err, result) {
             if (err) throw err;
             else {
                 console.log(result);
                  }
                });
            }
            });
}



exports.createMysqlConnection = createMysqlConnection;
exports.insertBiller = insertBiller;
exports.selectBillersToPay = selectBillersToPay;
exports.findSSN = findSSN;
exports.addSSN = addSSN;
exports.updateBalance = updateBalance;
exports.getAmt = getAmt;
exports.checkBalance = checkBalance;