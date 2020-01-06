const express = require('express'),
template = require('./lib/javascript/template.js'),
http = require('http'),
app = express(),
server = http.createServer(app);

app.get('/',function(req,res){
    console.log(req.session.user);
    var html = template.HTML_Main(undefined, template.login(req.session.user), undefined, undefined);
    res.send(html);
});
