let http = require('http');
let urlencode = require('urlencode');
let username='pkul3003@gmail.com';
let hash='99e1c0cd7732fa602d7e2b43182249f315ebf37c1386d29d5d333ab70ad21eb1'; 
// The hash key could be found under Help->All Documentation->Your hash key. Alternatively you can use your Textlocal password in plain text.

async function sendOtp(contact){
  let otp = Math.floor(1000 + Math.random() * 9000);
  let msg=urlencode('Your otp is '+otp); 
  let number=contact;
  let sender='txtlcl';
  let data='username='+username+'&hash='+hash+'&sender='+sender+'&numbers='+number+'&message='+msg
  let options = {
    
    host: 'api.textlocal.in',
    path: '/send?'+data
  };
  callback = function(response) {
    let str = '';
   
    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });
   
    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      console.log(str);
    });
  }
   
  //console.log('hello js'))
  http.request(options, callback).end();
  return otp;
}

//url encode instalation need to use $ npm install urlencode
exports.sendOtp = sendOtp;
//exports.otp = otp;