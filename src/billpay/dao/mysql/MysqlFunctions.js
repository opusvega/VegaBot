let mysql = require('mysql2/promise');
let config = require("../../../config.js");
let callmysqlpool = require("../../../mysql-functions/createMysqlSingleton.js");

async function getConnectionPool() {
  try {
    return (await callmysqlpool.getPool());
  }
  catch (err) {
    console.log("Error in creating Mysql Pool");
    return false;
  }
}

async function checkBillers(req,username){
let query = `SELECT * FROM CustomerBiller WHERE username = ?`;
try{
  let pool = await getConnectionPool();
  let con = await pool.getConnection();
  let [result, fields] = await con.execute(query,[username]);
  console.log(result);
  con.release();
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
        let pool = await getConnectionPool();
        let con = await pool.getConnection();
        let [result, fields] = await con.execute(query,[username,billertype]);
        console.log(result);
        con.release();
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
        let pool = await getConnectionPool();
        let con = await pool.getConnection();
        let [result, fields] = await con.execute(query,[username,billertype]);
        console.log(result);
        con.release();
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
      let pool = await getConnectionPool();
      let con = await pool.getConnection();
      let [result, fields] = await con.execute(query,[state,billertype]);
      con.release();
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
      let pool = await getConnectionPool();
      let con = await pool.getConnection();
      let [result, fields] = await con.execute(query,[billertype]);
      console.log(result);
      con.release();
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
    let pool = await getConnectionPool();
    let con = await pool.getConnection();
    let query = "INSERT INTO CustomerBiller VALUES ("+
                cid+",'"+username+"','"+billername+"','"+billertype+"',"+amtdue+",NOW());";
    console.log(query);
    //console.log(result);
    let result = await con.query(query);
    await con.query("commit;");
    con.release();
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
  try{
      let pool = await getConnectionPool();
      let con = await pool.getConnection();
      let [result,fields] = await con.execute(query,[cid]);
      console.log(result);
      con.release();
      return result[0];
  } catch (err){
    console.log("Error ===========>getDetailsOfCustomer",err);
      return false;
  }
  
}

async function getBalanceOfCustomer(username){
  let query = `SELECT * FROM CustomerAcct WHERE username = ?;`;
  console.log("getDetailsOfCustomer========>",query);
  let pool = await getConnectionPool();
  let con = await pool.getConnection();
  let [result,fields] = await con.execute(query,[username]);
  console.log(result);
  con.release();
  return result[0].balance;
}

async function updateCustomerBalance(amount, username){
  let query = `UPDATE CustomerAcct SET balance = balance - ? WHERE username = ?;`;
  console.log("getDetailsOfCustomer========>",query);
  let pool = await getConnectionPool();
  let con = await pool.getConnection();
  let result = await con.execute(query,[amount,username]);
  console.log(result);
  await con.query("commit;");
  con.release();
}

async function updateAmountDue(req){
  let cid = req.body.result.parameters.cid;
  let query = `UPDATE CustomerBiller SET amtdue = 0 WHERE custbillerid = ?;`;
  console.log("getDetailsOfCustomer========>",query);
  let pool = await getConnectionPool();
  let con = await pool.getConnection();
  let result = await con.execute(query,[cid]);
  await con.query("commit;");
  con.release();
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