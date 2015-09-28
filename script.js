/* jshint node: true */
/* global: casper */
"use strict";

var LOGIN_URLS = [
    'https://stackoverflow.com', 
    'https://math.stackexchange.com', 
    'https://russian.stackexchange.com',
    'https://music.stackexchange.com',
    'https://superuser.com',
];

phantom.casperPath = 'node_modules/casperjs';
phantom.injectJs('node_modules/casperjs/bin/bootstrap.js');

var casper = require('casper').create({
    exitOnError: true,
    pageSettings: {
        loadImages: false,
        loadPlugins: false
    }
});

casper.options.waitTimeout = 5000; 
    
var email = casper.cli.get(0);
var password = casper.cli.get(1);
    
var start = +new Date();

casper.start();
casper.echo('Today: ' + new Date());
    
if (!email || !password || !(/@/).test(email)) {
    casper.die('USAGE: casperjs stackoverflow-fanatic.js <email> <password> --ssl-protocol=any', 1);
} else {
    casper.echo('Loading login page');
}

for(var i=0; i < LOGIN_URLS.length; i++) { 
    (function(counter) {
        var LOGIN_URL = LOGIN_URLS[counter] + '/users/login';
        
        casper.thenOpen(LOGIN_URL, function () {
            this.echo('Opening' + LOGIN_URL);
        });
        
        casper.waitForSelector('#se-login-form', function() {
            this.echo('Clicking form at ' + this.getCurrentUrl());
            this.fill('#se-login-form', {email: email, password: password}, true);
        });
        
        casper.wait(500);
                
        casper.then(function () {
            if (this.getCurrentUrl().indexOf(LOGIN_URL) === 0) {
                this.die('Could not log in. Check your credentials.');
            } else {
                this.echo('Clicking profile link');
                this.click('.profile-me');
                this.then(function () {
                    this.echo('User ' + this.getCurrentUrl().split('/').reverse()[0] + ' logged in!' +
                        '\nTook ' + (((+new Date()) - start) / 1000) + 's');
                });
            }
        });
        
    })(i);
};

casper.run();

