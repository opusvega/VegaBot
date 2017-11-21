var https = require('https');
var http = require('http');
var data = { "siteId":"Atlanta", "subject":"reboot", "description":"reboot"};
var Client = require('node-rest-client').Client;
var res = {};
var reqJSON = JSON.stringify(data);
var wait = require('wait.for');


//var res = getTechnicianDetails(reqJSON, res);
console.log(res);

function getTechnicianDetails(reqJSON, callback) {
  var endpoint = 'http://paymentsol.opusconsulting.com:8080/OpusAI_Demo/rest/MLService/requestJSON';
  var headers = {
        'Content-Type': 'application/json',
        'dataType': 'json'
      };
  var client = new Client();
  // set content-type header and data as json in args parameter
  var args = {
        data: reqJSON,
        headers: headers
      };
  client.post(endpoint, args, function (data, response, err) {
      if (err) {
        console.log("error during http post request to fetch technician details");
      }
      else {
      // parsed response body as js object
      console.log(data);
      // raw response
      //console.log(response);
      var technicianName = JSON.stringify(data.firstTechnicianName);
       console.log(technicianName);

      return callback(technicianName);
    }
  });
}

console.log(res);
