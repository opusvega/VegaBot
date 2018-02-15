
let reqBodyNew = { "subject":"reboot", "description":"reboot"};
let Client = require('node-rest-client').Client;
let res = {};
let reqBody = JSON.stringify(reqBodyNew);
//let reqJSON = JSON.stringify(data);

function getTechnicianDetails(req, callback) {
  try{
    console.log("inside getTechnicianDetails ------->");
    let endpoint = 'http://localhost:8080/OpusAIDemo/rest/MLService/requestJSON';
    //let header = {"Content-Type" : "application/json"};
    let header = {
          'Content-Type': 'application/json',
          'dataType': 'json'
        };
    let client = new Client();
    // set content-type header and data as json in args parameter
    let args = {
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
          let technicianName = JSON.stringify(data.firstTechnicianName);
          console.log(technicianName);

          callback(err,technicianName);
        }
    });  
  }catch(err){
    console.log(err);
  }
  
}

exports.getTechnicianDetails = getTechnicianDetails;
