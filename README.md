# Node uptime monitor

## Install

    npm install

## Setup

    cp config/config.js.example config/config.js

## Run 

    node server.js

## Using the mailer mobule seperately

  mail = require('./lib/mailer')

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
