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
        let query = "SELECT incid FROM incidentlog WHERE atmid = '"+ATMID+"' AND username = '"+USERNAME+"'"+
                    " AND usercontact = '"+CONTACT+"'";
        let con = await createMysqlConnection();
        let [rows, fields] = await con.query(query);
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
    let query = "SELECT atmid, issue, DATE_FORMAT(inctime, '%a %d %b %Y %T' ) inctime, status FROM incidentlog WHERE incid = "+INCID;
    try{
        let con = await createMysqlConnection();
        let [rows, fields] = await con.query(query);
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

// //inserting new context entry with startintent name and session id
// async function insertContextLog(req){
//     console.log("Entering insertContextLog----------->");
//     let SESSIONID = req.body.sessionId;
//     let INTENTNAME = req.body.result.metadata.intentName;
//    try{
//         let con  = await createMysqlConnection();
//         let sqlSelect = "SELECT * FROM contextlog WHERE intentname = '"+INTENTNAME+"' AND sessionid = '"+SESSIONID+"' AND intentcomplete = FALSE;";
//         let [rows, fields] = await con.query(sqlSelect);
//         if(rows.length == 0){
//             let sql = "INSERT INTO contextlog (id, sessionid, intentname, sessionflag, intentvisit, intentcomplete) VALUES"+
//                     "(DEFAULT, '"+SESSIONID+"', '"+INTENTNAME+"', DEFAULT, DEFAULT, DEFAULT);";
//             let result = await con.query(sql);
//             console.log("1 record inserted in contextlog");
//                     console.log("Exiting insertContextLog----------->");
//         }else{
//             console.log("This entry already exist!")
//         }
//    }
//    catch (err){
//          console.log(`ERROR in insertContextLog`);
//    }
    
   
// }

//updating the intentcomplete flag to true which means this is the lastintent of context
// async function updateContextLogIntentComplete(req){
//     let SESSIONID = req.body.sessionId;
//     let INTENTNAME = req.body.result.metadata.intentName;
//     try{
//         let con = await createMysqlConnection();
//         let sql = "UPDATE contextlog SET intentcomplete = TRUE WHERE sessionid = '"+
//                           SESSIONID+"' AND endintentname = '"+INTENTNAME+"' AND intentcomplete = FALSE;";
//         let result = await con.query(sql);
//         console.log(result.affectedRows+" record(s) updated!");
//         return result;
//     }
//     catch (err){
//         return false;
//     }
// }

// //updating lastintent name of present context entry
// async function updateContextLogEndIntentName(req, startintentname){
//     let SESSIONID = req.body.sessionId;
//     let ENDINTENTNAME = req.body.result.metadata.intentName;
//     let STARTINTENTNAME = startintentname;
//     try{
//         let con = await createMysqlConnection();
//         let sql = "UPDATE contextlog SET endintentname = '"+ENDINTENTNAME+"' WHERE sessionid = '"+
//                           SESSIONID+"' AND intentname = '"+STARTINTENTNAME+"' AND intentcomplete = FALSE;";
//         let result = await con.query(sql);
//         console.log(result.affectedRows+" record(s) updated!");
//         return result;
//     }
//     catch (err){
//         return false;
//     }
// }

//fetching the context which is just hit by user , whether its entry is already or not
async function selectContextLogFalseIntentComplete(req,callback){
    let SESSIONID = req.body.sessionId;
    let query = "SELECT intentname FROM contextlog WHERE sessionid = '"+SESSIONID
               +"' AND sessionflag = TRUE AND intentvisit = TRUE AND intentcomplete = FALSE;";
    try{
        let con = await createMysqlConnection();
        let rows = await con.query(query);
        console.log(rows);
        return rows;
    }
    catch (err){
        return false;
    }
    
}

exports.insertIncidentLog = insertIncidentLog;
// exports.insertContextLog = insertContextLog;
// exports.updateContextLogIntentComplete = updateContextLogIntentComplete;
// exports.selectContextLogFalseIntentComplete = selectContextLogFalseIntentComplete;
// exports.updateContextLogEndIntentName = updateContextLogEndIntentName;
exports.selectIncidentId = selectIncidentId;
exports.selectIncidentStatus = selectIncidentStatus;