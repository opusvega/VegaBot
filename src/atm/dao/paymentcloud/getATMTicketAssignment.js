
var reqBody = { "subject":"reboot", "description":"reboot"};
var Client = require('node-rest-client').Client;
var res = {};
var reqBody = JSON.stringify(reqBody);
//var reqJSON = JSON.stringify(data);

function getTechnicianDetails(req, callback) {
  try{
    console.log("inside getTechnicianDetails ------->");
    var endpoint = 'http://localhost:8080/OpusAIDemo/rest/MLService/requestJSON';
    //var header = {"Content-Type" : "application/json"};
    var header = {
          'Content-Type': 'application/json',
          'dataType': 'json'
        };
    var client = new Client();
    // set content-type header and data as json in args parameter
    var args = {
          data: reqBody,
          headers: header
        };
    console.log("printing args--->");
    console.log(JSON.stringify(args));
    client.post(endpoint, args, function (data, response, err) {
        if (err) throw err;
        else {
          // parsed response body as js object
          console.log("successful post request------>");
          console.log(data);
          // raw response
          console.log(response);
          var technicianName = JSON.stringify(data.firstTechnicianName);
          console.log(technicianName);

          callback(err,technicianName);
        }
    });  
  }catch(err){
    console.log(err);
  }
  
}

exports.getTechnicianDetails = getTechnicianDetails;
