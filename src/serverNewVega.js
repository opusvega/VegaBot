'use strict'
let express = require('express');
let app = express();
let bodyParser = require("body-parser");
let https = require('https');
let http = require('http');
let fs = require('fs');
let morgan = require('morgan');

app.use(morgan('combined'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


let privateKey  = fs.readFileSync('/etc/ssl/vegabot-certs/server.key', 'utf8');
let certificate = fs.readFileSync('/etc/ssl/vegabot-certs/vega.crt', 'utf8');
let caCertificate = fs.readFileSync('/etc/ssl/vegabot-certs/Geotrust_Intermediate_CA.crt','utf8');
let credentials = {key: privateKey, cert: certificate, ca: caCertificate};


let router = require('./router')(app);

let httpServer = http.createServer(app);
let httpsServer = https.createServer(credentials, app);

httpServer.listen(8082);
httpsServer.listen(443);