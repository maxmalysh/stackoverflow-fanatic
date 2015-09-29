var path = require('path')
var childProcess = require('child_process')
var phantomjs = require('phantomjs')
var binPath = phantomjs.path

var childArgs = [
    path.join(__dirname, 'script.js'), process.env.EMAIL, process.env.PASSWORD, '--ssl-protocol=any'
]

var express = require('express')
var app = express()

var child;
var processing = false;
var lastResult = "";
var seeResultsString = "See results <a href=\"\/last\">here</a>.";

app.get('/', function(req, res) {
    if (!processing) {
        res.send("Started processing. " + seeResultsString);
        
        processing = true;
        lastResult = "";
        
        try {
            child.kill();
        }
        catch(e){   }
        
        child = childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
            console.log('stdout ', stdout);
            console.log('stderr ', stderr);
            console.log('err', err);
            lastResult += "Complete. ";
            processing = false;
        })
    
        // use event hooks to provide a callback to execute when data are available: 
        child.stdout.on('data', function(data) {
            lastResult += data.toString() + "<\/br>";
            console.log(data.toString());
        });
        
        child.stderr.on('data', function(data) {
            lastResult += "ERROR!" + data.toString() + "<\/br>";
            console.log(data.toString());
        });
        
    } else {
        res.send("Already processing. " + seeResultsString);
    }
});

app.get('/kill', function(req, res){
    res.write("Killing process... ");
    child.kill();
    processing = false;
    res.send("Done.");
    lastResult += "Child process was terminated. ";
});

app.get('/last', function(req, res) {
    res.send(lastResult);
});

app.listen(process.env.PORT || 3000)
