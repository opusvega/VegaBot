var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var https = require('https');
var http = require('http');
var fs = require('fs');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var privateKey  = fs.readFileSync('/etc/ssl/vegabot-certs/server.key', 'utf8');
var certificate = fs.readFileSync('/etc/ssl/vegabot-certs/vegabot_opusconsulting_com.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};


var router = require('./router.js')(app);

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8082);
httpsServer.listen(443);