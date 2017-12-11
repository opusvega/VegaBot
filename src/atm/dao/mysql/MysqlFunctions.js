let mysql = require('mysql2/promise');
let config = require("../../../config.js");

//creating mysql connection
function createMysqlConnection(){
    let con = mysql.createConnection({
        host: config.mysqlUrl,
        user: config.mysqlUser,
        password: config.mysqlPassword,
        database : config.mysqldb
    });
    return con;
}

//fetching INCID which is just inserted depending on other parameters
async function selectIncidentId(req){
    let ATMID = req.body.result.parameters.atmId.atmId;
    let USERNAME = req.body.result.parameters.customerName.customerName;
    let CONTACT = req.body.result.parameters.contact.contact;
    try{    
        let query = `SELECT incid FROM incidentlog WHERE atmid = ? AND username = ? AND usercontact = ?; `;
        let con = await createMysqlConnection();
        let [rows, fields] = await con.execute(query,[ATMID,USERNAME,CONTACT]);
        console.log(rows);
        return rows[0].incid;
    }
    catch (err){
        return false;
    }
}

//fetching the status of incident from table incidentlog depending on incid provided by user
async function selectIncidentStatus(req){
    let INCID = req.body.result.parameters.incid;
    //let query = "SELECT atmid, issue, DATE_FORMAT(inctime, '%a %d %b %Y %T' ) inctime, status FROM incidentlog WHERE incid = "+INCID;
    let query = `SELECT atmid, issue, DATE_FORMAT(inctime, '%a %d %b %Y %T' ) inctime, status FROM incidentlog WHERE incid = ?`;
    try{
        let con = await createMysqlConnection();
        let [rows, fields] = await con.execute(query,[INCID]);
        console.log(rows);
        return rows;
    }
    catch (err){
        return false;
    }
}

//inserting new incident of atm
async function insertIncidentLog(req, technicianName){
    let ATMID = req.body.result.parameters.atmId.atmId;
    let ISSUE = req.body.result.parameters.issues;
    let CUSTOMERNAME = req.body.result.parameters.customerName.customerName;
    let CONTACT = req.body.result.parameters.contact.contact;
    let TECHNICIAN = technicianName;
    try{
        let con = await createMysqlConnection();
        let sql = "INSERT INTO incidentlog (incid, atmid, issue, status,username, usercontact, inctime, restime,technician) VALUES"+
                          " (DEFAULT, "+ATMID+", '"+ISSUE+"','In-progress','"+CUSTOMERNAME+"','"+CONTACT+"',NOW(), NOW(), '"+TECHNICIAN+"');";
        let result = await con.query(sql);
        console.log(`SUCCESSFULL insertIncidentLog`);
    }
    catch (err){
        console.log(`ERROR in insertIncidentLog ...`)
    }
  
    //return TECHNICIAN;
}

//fetching the context which is just hit by user , whether its entry is already or not
async function selectContextLogFalseIntentComplete(req,callback){
    let SESSIONID = req.body.sessionId;
    let query = `SELECT intentname FROM contextlog WHERE sessionid = ? AND sessionflag = TRUE AND intentvisit = TRUE AND intentcomplete = FALSE;`;
    try{
        let con = await createMysqlConnection();
        let rows = await con.execute(query,[SESSIONID]);
        console.log(rows);
        return rows;
    }
    catch (err){
        return false;
    }
    
}

exports.insertIncidentLog = insertIncidentLog;
exports.selectIncidentId = selectIncidentId;
exports.selectIncidentStatus = selectIncidentStatus;