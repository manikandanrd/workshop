var util  = require('util');
var express  = require('express');
var https = require('https');
var app      = express();
var httpProxy = require('http-proxy');
var fs       = require('fs');

app.use(express.static('public'));

// Read API EndPoint Configs
//
var booking_api_config = JSON.parse(fs.readFileSync('booking-api-config.json', 'utf8'));
var airmile_api_config = {endpoint: "https://localhost"}
try{
  var airmile_api_config = JSON.parse(fs.readFileSync('airmile-api-config.json', 'utf8'));
}catch(e){
  console.log("INFO: " + "airmile-api-config.json is using default host" )
}

var bookings_api = booking_api_config.endpoint;
var airmiles_api = airmile_api_config.endpoint;

var bookings_api_proxy = httpProxy.createProxyServer({
  target: bookings_api, 
  agent: https.globalAgent,
  xfwd: true,
  headers: {
    host: bookings_api.replace(/^https:\/\//, "")
  }
});
var airmiles_api_proxy = httpProxy.createProxyServer({
  target: airmiles_api, 
  agent: https.globalAgent,
  xfwd:  true,
  headers: {
    host: airmiles_api.replace(/^https:\/\//, "")
  }
});
airmiles_api_proxy.on('error', function (err, req, res) {
    res.writeHead(500, {
          'Content-Type': 'text/plain'
              });

      res.end('Something went wrong. And we are reporting a custom error message.');
});
console.log("Bookings API Endpoint: " + bookings_api);
console.log("Airmiles API Endpoint: " + airmiles_api); 

app.all("/bookings", function(req, res) {
    req.url = "/Prod" + req.url;
    console.log("Requesting: " + req.url);
    bookings_api_proxy.web(req, res, {target: bookings_api});
});

app.all("/bookings/*", function(req, res) {
    req.url = "/Prod" + req.url;
    console.log("Requesting: " + req.url);
    bookings_api_proxy.web(req, res, {target: bookings_api});
});

app.all("/airmiles", function(req, res) {
  req.url = "/Prod" + req.url;
  console.log("Requesting: " + req.url);
  airmiles_api_proxy.web(req, res, {target: airmiles_api});
});

app.all("/airmiles/*", function(req, res) {
  req.url = "/Prod" + req.url;
  console.log("Requesting: " + req.url);
  airmiles_api_proxy.web(req, res, {target: airmiles_api});
});

app.listen(3000);
