/* jshint node: true */
/* global: casper */
"use strict";

var LOGIN_URLS = [
    'https://stackoverflow.com', 
    'https://math.stackexchange.com', 
    'https://superuser.com',
    'https://serverfault.com',
    'https://askubuntu.com',
    'https://programmers.stackexchange.com',
    'https://codereview.stackexchange.com',
    'https://codegolf.stackexchange.com',
    'https://music.stackexchange.com',
    'https://russian.stackexchange.com',
    'https://english.stackexchange.com',
    'https://apple.stackexchange.com',
    'https://bicycles.stackexchange.com',
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

casper.options.waitTimeout = 15000; 
    
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
        
        casper.then(function(){
            this.clear();
            phantom.clearCookies();    
        });
        
        casper.thenOpen(LOGIN_URL, function () {
            this.echo('Opening ' + LOGIN_URL);
        });
        
        casper.then(function(){
            this.echo('Clicking form at ' + casper.getCurrentUrl());
            this.waitForSelector('#login-form', function() {
                this.fill('#login-form', {email: email, password: password}, true);
            });
        });
    
        casper.wait(300);
                
        casper.then(function () {
            if (this.getCurrentUrl().indexOf(LOGIN_URL) === 0) {
                this.echo('Could not log in. Check your credentials. Reached ' + this.getCurrentUrl());
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

