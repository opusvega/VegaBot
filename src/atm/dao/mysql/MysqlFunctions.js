var mysql = require('mysql2/promise');
var config = require("../../../config.js");

//creating mysql connection
function createMysqlConnection(){
    var con = mysql.createConnection({
        host: config.mysqlUrl,
        user: config.mysqlUser,
        password: config.mysqlPassword,
        database : config.mysqldb
    });
    return con;
}

//fetching INCID which is just inserted depending on other parameters
async function selectIncidentId(req){
    var ATMID = req.body.result.parameters.atmId.atmId;
    var USERNAME = req.body.result.parameters.customerName.customerName;
    var CONTACT = req.body.result.parameters.contact.contact;
    var query = "SELECT incid FROM incidentlog WHERE atmid = '"+ATMID+"' AND username = '"+USERNAME+"'"+
                " AND usercontact = '"+CONTACT+"'";
    var con = await createMysqlConnection();
    var [rows, fields] = await con.query(query);
    console.log(rows);
    return rows[0].incid;
}

//fetching the status of incident from table incidentlog depending on incid provided by user
async function selectIncidentStatus(req){
    var INCID = req.body.result.parameters.incid;
    var query = "SELECT atmid, issue, DATE_FORMAT(inctime, '%a %d %b %Y %T' ) inctime, status FROM incidentlog WHERE incid = "+INCID;
    var con = await createMysqlConnection();
    var [rows, fields] = await con.query(query);
    console.log(rows);
    return rows;
}

//inserting new incident of atm
async function insertIncidentLog(req, technicianName){
    var ATMID = req.body.result.parameters.atmId.atmId;
    var ISSUE = req.body.result.parameters.issues;
    var CUSTOMERNAME = req.body.result.parameters.customerName.customerName;
    var CONTACT = req.body.result.parameters.contact.contact;
    var TECHNICIAN = technicianName;
    var con = await createMysqlConnection();
    var sql = "INSERT INTO incidentlog (incid, atmid, issue, status,username, usercontact, inctime, restime,technician) VALUES"+
                      " (DEFAULT, "+ATMID+", '"+ISSUE+"','In-progress','"+CUSTOMERNAME+"','"+CONTACT+"',NOW(), NOW(), '"+TECHNICIAN+"');";
    var result = await con.query(sql);
    //return TECHNICIAN;
}

//inserting new context entry with startintent name and session id
async function insertContextLog(req){
    console.log("Entering insertContextLog----------->");
    var SESSIONID = req.body.sessionId;
    var INTENTNAME = req.body.result.metadata.intentName;
    var con  = await createMysqlConnection();
    var sqlSelect = "SELECT * FROM contextlog WHERE intentname = '"+INTENTNAME+"' AND sessionid = '"+SESSIONID+"' AND intentcomplete = FALSE;";
    var [rows, fields] = await con.query(sqlSelect);
    if(rows.length == 0){
        var sql = "INSERT INTO contextlog (id, sessionid, intentname, sessionflag, intentvisit, intentcomplete) VALUES"+
                  "(DEFAULT, '"+SESSIONID+"', '"+INTENTNAME+"', DEFAULT, DEFAULT, DEFAULT);";
        var result = await con.query(sql);
        console.log("1 record inserted in contextlog");
                console.log("Exiting insertContextLog----------->");
    }else{
        console.log("This entry already exist!")
    }
}

//updating the intentcomplete flag to true which means this is the lastintent of context
async function updateContextLogIntentComplete(req){
    var SESSIONID = req.body.sessionId;
    var INTENTNAME = req.body.result.metadata.intentName;
    var con = await createMysqlConnection();
    var sql = "UPDATE contextlog SET intentcomplete = TRUE WHERE sessionid = '"+
                      SESSIONID+"' AND endintentname = '"+INTENTNAME+"' AND intentcomplete = FALSE;";
    var result = await con.query(sql);
    console.log(result.affectedRows+" record(s) updated!");
}

//updating lastintent name of present context entry
async function updateContextLogEndIntentName(req, startintentname){
    var SESSIONID = req.body.sessionId;
    var ENDINTENTNAME = req.body.result.metadata.intentName;
    var STARTINTENTNAME = startintentname;
    var con = await createMysqlConnection();
    var sql = "UPDATE contextlog SET endintentname = '"+ENDINTENTNAME+"' WHERE sessionid = '"+
                      SESSIONID+"' AND intentname = '"+STARTINTENTNAME+"' AND intentcomplete = FALSE;";
    var result = await con.query(sql);
    console.log(result.affectedRows+" record(s) updated!");
}

//fetching the context which is just hit by user , whether its entry is already or not
async function selectContextLogFalseIntentComplete(req,callback){
    var SESSIONID = req.body.sessionId;
    var query = "SELECT intentname FROM contextlog WHERE sessionid = '"+SESSIONID
               +"' AND sessionflag = TRUE AND intentvisit = TRUE AND intentcomplete = FALSE;";
    var con = await createMysqlConnection();
    var rows = await con.query(query);
    console.log(rows);
    return rows;
}

exports.insertIncidentLog = insertIncidentLog;
exports.insertContextLog = insertContextLog;
exports.updateContextLogIntentComplete = updateContextLogIntentComplete;
exports.selectContextLogFalseIntentComplete = selectContextLogFalseIntentComplete;
exports.updateContextLogEndIntentName = updateContextLogEndIntentName;
exports.selectIncidentId = selectIncidentId;
exports.selectIncidentStatus = selectIncidentStatus;