/* jshint node: true */
/* global: casper */
"use strict";

phantom.casperPath = 'node_modules/casperjs';
phantom.injectJs('node_modules/casperjs/bin/bootstrap.js');

var LOGIN_URLS = ['https://stackoverflow.com', 'https://math.stackexchange.com', 'https://music.stackexchange.com'];
    
var casper = require('casper').create({
    exitOnError: true,
    pageSettings: {
        loadImages: false,
        loadPlugins: false
    }
});
    
var email = casper.cli.get(0);
var password = casper.cli.get(1);
    
var start = +new Date();

var i = 0;
var nTimes = LOGIN_URLS.length;

casper.start();
casper.repeat(nTimes, function() {
    var LOGIN_URL = LOGIN_URLS[i] + '/users/login';

    casper.echo('Today: ' + new Date());
    
    if (!email || !password || !(/@/).test(email)) {
        casper.die('USAGE: casperjs stackoverflow-fanatic.js <email> <password> --ssl-protocol=any', 1);
    } else {
        casper.echo('Loading login page');
    }
    
    casper.thenOpen(LOGIN_URL, function () {
        this.echo('Logging in to ' + LOGIN_URL + ' using email address ' + email +
            ' and password ' + (new Array(password.length + 1)).join('*'));
        this.fill('#se-login-form', {email: email, password: password}, true);
    });
    
    casper.wait(300);
    
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
    
    i++;
});

casper.run(function() {
    this.echo('So the whole suite ended, waiting...');
    this.exit(); 
});

