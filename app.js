'use strict'

var http = require('http');
var port = process.env.PORT || 3000;
var request = require('request');
var qs = require('querystring');
var util = require('util');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var express = require('express');
var app = express();
// Quickbooks
var QuickBooks = require('../index');
var Tokens = require('csrf');
var csrf = new Tokens();
// Mongodb
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/homigoChallenge';

QuickBooks.setOauthVersion('2.0');

app.set('port', port);
app.set('views', 'views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('brad'));
app.use(session({ resave: false, saveUninitialized: false, secret: 'smith' }));

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

var consumerKey = 'Q0WQ157ddpeqVlHdbb24Cz6TUyi0d92WFcS8G2FbhkjZ0FDbUu';
var consumerSecret = 'Z21ACXJrTTLbpzBSppvJu2HGmQXFjnIOms81Hzag';

app.get('/', function (req, res) {
  res.redirect('/start');
});

app.get('/start', function (req, res) {
  res.render('intuit.ejs', { locals: { port: port, appCenter: QuickBooks.APP_CENTER_BASE } });
});

// OAUTH 2 makes use of redirect requests
function generateAntiForgery (session) {
  session.secret = csrf.secretSync();
  return csrf.create(session.secret);
};

app.get('/requestToken', function (req, res) {
  var redirecturl = QuickBooks.AUTHORIZATION_URL +
    '?client_id=' + consumerKey +
    '&redirect_uri=' + encodeURIComponent('http://localhost:' + port + '/callback/') +
    '&scope=com.intuit.quickbooks.accounting' +
    '&response_type=code' +
    '&state=' + generateAntiForgery(req.session);

  res.redirect(redirecturl);
});

app.get('/callback', function (req, res) {
  var auth = (new Buffer(consumerKey + ':' + consumerSecret).toString('base64'));

  var postBody = {
    url: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + auth,
    },
    form: {
      grant_type: 'authorization_code',
      code: req.query.code,
      redirect_uri: 'http://localhost:' + port + '/callback/'
    }
  };

  request.post(postBody, function (e, r, data) {
    var accessToken = JSON.parse(r.body);

    // save the access token somewhere on behalf of the logged in user
    var qbo = new QuickBooks(consumerKey,
                             consumerSecret,
                             accessToken.access_token, /* oAuth access token */
                             false, /* no token secret for oAuth 2.0 */
                             req.query.realmId,
                             true, /* use a sandbox account */
                             true, /* turn debugging on */
                             4, /* minor version */
                             '2.0', /* oauth version */
                            accessToken.refresh_token /* refresh token */);

    qbo.findInvoices(function (_, customers) {
      customers.QueryResponse.Invoice.forEach((invoice) => {
          console.log(JSON.stringify(invoice));
          console.log("New Invoice!!")
        });
    });
  });

  res.send('<!DOCTYPE html><html lang="en"><head></head><body><script>window.opener.location.reload(); window.close();</script></body></html>');
});


