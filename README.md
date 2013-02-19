# Node uptime monitor

## Install

    npm install

## Setup

    cp config/config.js.example config/config.js

## Run 

    node server.js

## Using the ping mobule seperately

    pinger = require('./lib/pinger.js')

    websites = [
      {
      url: 'foo.com',
      timeout: 0.1
      },
      {
        url: 'bar.com',
        timeout: 0.1
      }
    ]

    pinger.start(websites)

    pinger.on('siteDown', function(data) {
      console.log(data);
    });


## Using the mailer mobule seperately

    mail = require('./lib/mailer.js')

    // the mailer assume gmail is used for sending
    config = {
      email: '',
      password: '',
      to: 'uptime@foo.com',
      from: 'uptime-robot@foo.com'
    }

    mail({
          config: config,
          subject: 'foo is down',
          body: '<p>foo did not responde</p>'
        }, function (error, res) {
          if (error) {
            console.log(error);
          }
          else {
            console.log(res);
          }
        })

## Using both pinger and mailer

    pinger = require('./lib/pinger.js')
    mail = require('./lib/mailer.js')

    pinger.start(websites)

    pinger.on('siteDown', function(data) {
      email(data);
    });

    config = {
      email: 'orengolan@gmail.com',
      password: 'aoeuht3#',
      to: 'uptime@foo.com',
      from: 'uptime-robot@foo.com'
    }

    function email(config, data) {
      var htmlMsg = '<p>Time: ' + data.time;
      htmlMsg +='</p><p>Website: ' + data..website;
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
          })
    };
