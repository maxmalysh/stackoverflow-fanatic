var path = require('path')
var childProcess = require('child_process')
var phantomjs = require('phantomjs')
var binPath = phantomjs.path

var childArgs = [
    path.join(__dirname, 'script.js'), process.env.EMAIL, process.env.PASSWORD, '--ssl-protocol=any'
]


var express = require('express')
var app = express()

app.get('/', function(req, res) {
    var result = '';
    var child = childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
        console.log('stdout ', stdout);
        console.log('stderr ', stderr);
        console.log('err', err);
        res.send(result);
    })

    // use event hooks to provide a callback to execute when data are available: 
    child.stdout.on('data', function(data) {
        result += data.toString();
        console.log(data.toString());
    });
})

var lastResult = "";

app.get('/background', function(req, res) {
    var child = childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
        console.log('stdout ', stdout);
        console.log('stderr ', stderr);
        console.log('err', err);
        lastResult = "";
        res.send("Processing in background now");
    })

    // use event hooks to provide a callback to execute when data are available: 
    child.stdout.on('data', function(data) {
        lastResult += data.toString();
        console.log(data.toString());
    });
})

app.get('/last', function(req, res) {
    res.send(lastResult);
})

app.listen(process.env.PORT || 3000)
