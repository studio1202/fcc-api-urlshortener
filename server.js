"use strict";

// default init
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// custom init
const UrlModel = require('./models/urlModel.js');
const UrlUtils = require('./controllers/urlUtils.js');

// middleware
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));

// home
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Submit a new URL
app.post('/api/shorturl/new', function (req, res) {
  UrlUtils.checkUrlP(req.body.url)
    .then(UrlModel.saveRedirectP)
    .then(urlModel => {
      res.json(UrlModel.toFccFormat(urlModel));
    })
    .catch(error => {
      res.json({ error });
    });
});

// Redirect to an existing URL
app.get('/api/shorturl/:shortUrl', function (req, res) {
  UrlModel.getRedirectP(req.params['shortUrl'])
    .then(redirect => {
      res.redirect(redirect.url);
    })
    .catch(error => {
      res.json({ error });
    });
});

// start the server
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
