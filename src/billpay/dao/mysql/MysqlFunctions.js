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

async function checkBillers(req,username){
let query = `SELECT * FROM CustomerBiller WHERE username = ?`;
try{
  let con = await createMysqlConnection();
  let [result, fields] = await con.execute(query,[username]);
  console.log(result);
  return result;
}
catch (err){
  return false;
}
}


async function isBillerTypeExist(req,username){
    console.log("Inside isBillerTypeExist -------->");
    let billertype = req.body.result.parameters.billertype;
    let query = `SELECT * FROM CustomerBiller WHERE username = ? AND billertype = ?;`;
    console.log(query);
    try{
        let con = await createMysqlConnection();
        let [result, fields] = await con.execute(query,[username,billertype]);
        console.log(result);
        return result;
    }
    catch (err){
        return false;
    }
}


async function selectBillersToPay(req,username){
    console.log("Inside selectBillersToPay -------->");
    let billertype = req.body.result.parameters.billertype;
    let query = `SELECT * FROM CustomerBiller WHERE username = ? AND billertype = ? AND amtdue != 0;`;
    console.log(query);
    try{
        let con = await createMysqlConnection();
        let [result, fields] = await con.execute(query,[username,billertype]);
        console.log(result);
        return result;
    }
    catch (err){
        return false;
    }
}

async function getBillers(req){
  console.log("Inside selectBillersToPay -------->");
  let billertype = req.body.result.parameters.billertype;
  let state = req.body.result.parameters.state;
  let query = `SELECT * FROM UtilityProviders WHERE statename = ? AND billertype = ? LIMIT 4;`;
  console.log("getBillers============>",query);
  try{
      let con = await createMysqlConnection();
      let [result, fields] = await con.execute(query,[state,billertype]);
      console.log(result);
      return result;
  }
  catch (err){
      return false;
  }
}

async function getPhoneBillers(req){
  console.log("Inside getPhoneBillers -------->");
  let billertype = req.body.result.parameters.phoneprovider;
  let state = req.body.result.parameters.state;
  let query = `SELECT * FROM InternetProviders  WHERE billertype = ? LIMIT 4;`;
  console.log("getBillers============>",query);
  try{
      let con = await createMysqlConnection();
      let [result, fields] = await con.execute(query,[billertype]);
      console.log(result);
      return result;
  }
  catch (err){
      return false;
  }
}

async function insertNewBiller(req,username){
  console.log("inside insertNewBiller========>");
  let cid = req.body.result.parameters.cid;
  let billername = req.body.result.parameters.billername;
  let billertype = req.body.result.parameters.billertype;
  try{
    let amtdue = Math.floor(Math.random() * 100) + 5 ;
    let con = await createMysqlConnection();
    let query = "INSERT INTO CustomerBiller VALUES ("+
                cid+",'"+username+"','"+billername+"','"+billertype+"',"+amtdue+",NOW());";
    console.log(query);
    //console.log(result);
    let result = await con.query(query);
    return result.affectedRows;  
  }
  catch(err){
    return false;
  }
  
}

async function getDetailsOfCustomer(req){
  let cid = req.body.result.parameters.cid;
  let query = `SELECT * FROM CustomerBiller WHERE custbillerid = ?;`;
  console.log("getDetailsOfCustomer========>",query);
  let con = await createMysqlConnection();
  let [result,fields] = await con.execute(query,[cid]);
  console.log(result);
  return result[0];
}

async function getBalanceOfCustomer(username){
  let query = `SELECT * FROM CustomerAcct WHERE username = ?;`;
  console.log("getDetailsOfCustomer========>",query);
  let con = await createMysqlConnection();
  let [result,fields] = await con.execute(query,[username]);
  console.log(result);
  return result[0].balance;
}

async function updateCustomerBalance(amount, username){
  let query = `UPDATE CustomerAcct SET balance = balance - ? WHERE username = ?;`;
  console.log("getDetailsOfCustomer========>",query);
  let con = await createMysqlConnection();
  let result = await con.execute(query,[amount,username]);
  console.log(result);
}

async function updateAmountDue(req){
  let cid = req.body.result.parameters.cid;
  let query = `UPDATE CustomerBiller SET amtdue = 0 WHERE custbillerid = ?;`;
  console.log("getDetailsOfCustomer========>",query);
  let con = await createMysqlConnection();
  let result = await con.execute(query,[cid]);
}

exports.updateAmountDue = updateAmountDue;
exports.updateCustomerBalance = updateCustomerBalance;
exports.getBalanceOfCustomer = getBalanceOfCustomer;
exports.getDetailsOfCustomer = getDetailsOfCustomer;
exports.selectBillersToPay = selectBillersToPay;
exports.getBillers = getBillers;
exports.insertNewBiller = insertNewBiller;
exports.getPhoneBillers = getPhoneBillers;
exports.checkBillers = checkBillers;
exports.isBillerTypeExist = isBillerTypeExist;