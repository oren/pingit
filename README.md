# Pinger - Node uptime monitor

Event emitter that notify you if your sites are down.  
It emit 3 events - status, siteDown and siteUp

## Install

    npm install pinger

## Use

    var pinger = require('pinger');

    var websites = [
      {
        url: 'foo.com',
        timeout: 10    // minutes
      },
      {
        url: 'bar.com',
        timeout: 15
      }
    ];

    pinger.on('status', function(data) {
      console.log('status event:', data);
    });

    pinger.on('siteUp', function(data) {
      console.log('siteUp event:', data);
    });

    pinger.on('siteDown', function(data) {
      console.log('siteDown event:', data);
    });

    pinger.start(websites);                              // pass hash of websites

There are 2 more way to use it:

    1. pinger.start();                                   // default to websites.js file in the local directory
    2. pinger.start({pathToWebsites: "./websites.js"});  // location of websites.js file


siteDown and siteUp events are sending the following data:

    { 
      website: 'foo.com',
      time: '2013-02-19 03:24:05',
      status: 'DOWN',
      message: undefined 
    }
