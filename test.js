var pinger = require('./lib/pinger.js');
var mail = require('./lib/mailer.js');

var config = {
  email: 'orengolan@gmail.com',
  password: 'aoeuht3#',
  to: 'orengolan@gmail.com',
  from: 'uptime-robot@foo.com'
};

var websites = [
  {
    url: 'foo.com',
    timeout: 0.1
  },
  {
    url: 'bar.com',
    timeout: 0.1
  }
];

pinger.on('status', function(data) {
  console.log('status event', data);
});

pinger.start(websites);

pinger.on('siteUp', function(data) {
  console.log('siteUp event', data);
});

pinger.on('siteDown', function(data) {
  console.log('siteDown event', data);
  // email(config, data);
});

function email(config, data) {
  var htmlMsg = '<p>Time: ' + data.time;
  htmlMsg +='</p><p>Website: ' + data.website;
  htmlMsg += '</p><p>Message: ' + data.msg + '</p>';

  mail({
        config: config,
        subject: data.website + ' is down',
        body: htmlMsg
      }, function (error, res) {
        if (error) {
          console.log(error);
        }
        else {
          console.log(res);
        }
      });
};
