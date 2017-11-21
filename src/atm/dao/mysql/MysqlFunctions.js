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

function insertIncidentLog(req, technicianName){
    var ATMID = req.body.result.parameters.atmId.atmId;
    var ISSUE = req.body.result.parameters.issues;
    var CUSTOMERNAME = req.body.result.parameters.customerName.customerName;
    var CONTACT = req.body.result.parameters.contact.contact;
    var TECHNICIAN = technicianName;
    createMysqlConnection().connect(function(err) {
        if (err) throw err;
        else{
            console.log("Connected!");
            var sql = "INSERT INTO incidentlog (incid, atmid, issue, status,username, usercontact, inctime, restime) VALUES"+
                      " (DEFAULT, "+ATMID+", '"+ISSUE+"','In-progress','"+CUSTOMERNAME+"','"+CONTACT+"',NOW(), NOW(), '"+TECHNICIAN+"');";
            createMysqlConnection().query(sql, function (err, result) {
                    if (err) throw err;
                    else console.log("1 record inserted");
            });
        }

    });
}

function insertContextLog(req){
    console.log("Entering insertContextLog----------->");
    var SESSIONID = req.body.sessionId;
    var INTENTNAME = req.body.result.metadata.intentName;
    createMysqlConnection().connect(function(err){
        if (err) throw err;
        else{
            console.log("Connected------insertContextLog");
            var sqlSelect = "SELECT * FROM contextlog WHERE intentname = '"+INTENTNAME+"' AND sessionid = '"+SESSIONID+"' AND intentcomplete = FALSE;";
            createMysqlConnection().query(sqlSelect, function (err, rows){
                if (err) throw err;
                else{
                    if(rows.length == 0){
                        var sql = "INSERT INTO contextlog (id, sessionid, intentname, sessionflag, intentvisit, intentcomplete) VALUES"+
                                  "(DEFAULT, '"+SESSIONID+"', '"+INTENTNAME+"', DEFAULT, DEFAULT, DEFAULT);";
                        createMysqlConnection().query(sql, function(err,result){
                            if (err) throw err;
                            else{
                                console.log("1 record inserted in contextlog");
                                console.log("Exiting insertContextLog----------->");
                            }
                        });
                    }else{
                        console.log("This entry already exist!")
                    }
                }
            })
        }
    });
}

function updateContextLogIntentComplete(req){
    var SESSIONID = req.body.sessionId;
    var INTENTNAME = req.body.result.metadata.intentName;
    createMysqlConnection().connect(function(err){
        if (err) throw err;
        else{
            var sql = "UPDATE contextlog SET intentcomplete = TRUE WHERE sessionid = '"+
                      SESSIONID+"' AND endintentname = '"+INTENTNAME+"' AND intentcomplete = FALSE;";
            createMysqlConnection().query(sql, function (err, result){
                if (err) throw err;
                else{
                    console.log(result.affectedRows+" record(s) updated!");
                }
            });
        }
    });
}

function updateContextLogEndIntentName(req, startintentname){
    var SESSIONID = req.body.sessionId;
    var ENDINTENTNAME = req.body.result.metadata.intentName;
    var STARTINTENTNAME = startintentname;
    createMysqlConnection().connect(function(err){
        if (err) throw err;
        else{
            var sql = "UPDATE contextlog SET endintentname = '"+ENDINTENTNAME+"' WHERE sessionid = '"+
                      SESSIONID+"' AND intentname = '"+STARTINTENTNAME+"' AND intentcomplete = FALSE;";
            createMysqlConnection().query(sql, function (err, result){
                if (err) throw err;
                else{
                    console.log(result.affectedRows+" record(s) updated!");
                }
            });
        }
    });
}

function selectContextLogFalseIntentComplete(req,callback){
    var SESSIONID = req.body.sessionId;
    var query = "SELECT intentname FROM contextlog WHERE sessionid = '"+SESSIONID
               +"' AND sessionflag = TRUE AND intentvisit = TRUE AND intentcomplete = FALSE;";
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

exports.insertIncidentLog = insertIncidentLog;
exports.insertContextLog = insertContextLog;
exports.updateContextLogIntentComplete = updateContextLogIntentComplete;
exports.selectContextLogFalseIntentComplete = selectContextLogFalseIntentComplete;
exports.updateContextLogEndIntentName = updateContextLogEndIntentName;