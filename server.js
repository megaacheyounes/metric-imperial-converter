// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var helmet=require('helmet');

app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(helmet.xssFilter({ setOnOldIE: true }));

var converter=require('./converter.js');

var test='km';

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(req, res) {
    
  converter.convert('1.6kg');
  converter.displayRes(res);  
  
});

app.get('/api/convert', function(req, res) {
  
  var input =req.query.input + '';
  
  converter.convert(input);
  converter.displayRes(res);  
  
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
