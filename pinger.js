// core module
var EventEmitter = require('events').EventEmitter;
var request = require('request');
var statusCodes = require('http').STATUS_CODES;

var emitter = new EventEmitter();

module.exports = emitter;
module.exports.start = start;

var monitors = [];
var monitor = null;
 
// start pinging websites 
//
// parameters
// websites (optional) - hash with array of hashes - website and interval
// or hash with single key - pathToWebsites
// if no argument passed, it will try reading websites.js from current folder
function start(websites) {
  var sitesFile;

  if (!websites) {
    websites = readSitesFile('./websites.js');
  } else if (websites.pathToWebsites) {
    websites = readSitesFile(websites.pathToWebsites);
  }
  if (!websites) {
    return null;
  }

  websites.forEach(function (website) {
    monitor = new Ping ({
      website: website.url,
      timeout: website.timeout
    });

    monitors.push(monitor);
  });
}

function readSitesFile(path) {
  try {
    return require(path);
  } catch(e) {
    emitter.emit('status', 'Error reading ' + path);
    return null;
  }
};

// Ping Constructor
function Ping (opts) {
  // holds website to be monitored
  this.website = '';

  // ping intervals in minutes
  this.timeout = 15;

  // interval handler
  this.handle = null;

  // initialize the app
  this.init(opts)
}

// Methods
Ping.prototype = {
  init: function (opts) {
    var self = this;
    self.website = opts.website;
    self.timeout = (opts.timeout * (60 * 1000));
    // start monitoring
    self.start();
  },
  
  start: function () {
    var self = this;
    var time = Date.now();

    emitter.emit('status', "\nMonitoring " + self.website + "\nTime: " + self.getFormatedDate(time) + "\n"); 

    // create an interval for pings
    self.handle = setInterval(function () {
      self.ping();
    }, self.timeout);
  },

  ping: function () {
    var self = this, currentTime = Date.now();

    try {
      // send request
      request(self.website, function (error, res, body) {
        // Website is up
        if (!error && res.statusCode === 200) {
          self.isOk();
        }
        // No error but website not ok
        else if (!error) {
          self.isNotOk(res.statusCode);
        }
        // Loading error
        else {
          self.isNotOk();
        }
      });
    }
    catch (err) {
      self.isNotOk();
    }
  },

  isOk: function () {
    this.log('UP', 'OK');
  },

  isNotOk: function (statusCode) {
    var self = this;
    var msg = statusCodes[statusCode + ''];

    this.log('DOWN', msg);
  },

  log: function (status, msg) {
    var self = this;

    var output = {
      website: self.website,
      time: self.getFormatedDate(Date.now()),
      status: status,
      message: msg
    };

    if (status === 'DOWN') {
      emitter.emit('siteDown', output); 
    } else {
      emitter.emit('siteUp', output); 
    }
  },

  getFormatedDate: function (time) {
    var currentDate = new Date(time);

    currentDate = currentDate.toISOString();
    currentDate = currentDate.replace(/T/, ' ');
    currentDate = currentDate.replace(/\..+/, '');

    return currentDate;
  }
}
