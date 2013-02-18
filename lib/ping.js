var request = require('request');
var statusCodes = require('http').STATUS_CODES;
 
/*
    Ping Constructor
*/
function Ping (opts) {
  // holds website to be monitored
  this.mail = null;

  // holds website to be monitored
  this.website = '';

  // ping intervals in minutes
  this.timeout = 15;

  // interval handler
  this.handle = null;

  // initialize the app
  this.init(opts)
}

/*
    Methods
*/
 
Ping.prototype = {
  init: function (opts) {
    var self = this;

    self.mail = opts.mail;

    self.website = opts.website;

    self.timeout = (opts.timeout * (60 * 1000));

    // start monitoring
    self.start();
  },
  
  start: function () {
    var self = this;
    var time = Date.now();

    console.log("\nLoading... " + self.website + "\nTime: " + self.getFormatedDate(time) + "\n");

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
    var time =  Date.now();
    var self = this;
    time = self.getFormatedDate(time);
    var msg = statusCodes[statusCode + ''];

    var htmlMsg = '<p>Time: ' + time;
    htmlMsg +='</p><p>Website: ' + self.website;
    htmlMsg += '</p><p>Message: ' + msg + '</p>';

    this.log('DOWN', msg);

    // Send admin and email
    self.mail.mailer({
      config: self.mail.config,
      subject: self.website + ' is down',
      body: htmlMsg
    }, function (error, res) {
      if (error) {
        console.log(error);
      }
      else {
        console.log(res);
      }
    });
  },

  log: function (status, msg) {
    var self = this;
    var time = Date.now();
    var output = '';

    output += "\nWebsite: " + self.website;
    output += "\nTime: " + time;
    output += "\nStatus: " + status;
    output += "\nMessage:" + msg  + "\n";

    console.log(output);
  },

  getFormatedDate: function (time) {
    var currentDate = new Date(time);

    currentDate = currentDate.toISOString();
    currentDate = currentDate.replace(/T/, ' ');
    currentDate = currentDate.replace(/\..+/, '');

    return currentDate;
  }
}

module.exports = Ping;
