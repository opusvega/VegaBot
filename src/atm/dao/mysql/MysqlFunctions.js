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
