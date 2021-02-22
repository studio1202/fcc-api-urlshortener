"use strict";

// const mongodb = require('mongodb');
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

mongoose.connect(process.env.DB_URI, {
  socketTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
  .catch(error => {
    console.log(error);
  });

// URL schema with auto-incrementing ID
const redirectSchema = new mongoose.Schema({
  url: String
});
redirectSchema.plugin(AutoIncrement, { inc_field: 'shortUrl' });
const Redirect = mongoose.model('Redirect', redirectSchema);

/**
 * Retrieves a URL from the DB
 * @param {*} shortUrl - The short URL of the URL to be retrieved
 * @returns {Promise} A promise to return the redirect of a short URL
 * @throws Error if 
 */
function getRedirectP(shortUrlString) {
  // the auto-incrementing key does not like strings
  const shortUrlNumber = Number(shortUrlString);
  return Redirect.findOne({ shortUrl: shortUrlNumber ? shortUrlNumber : -1 })
    .catch(error => {
      throw ('DB error');
    })
    .then(result => {
      if (!result) throw ('No short URL found for the given input');
      return result;
    });
}

/**
 * Saves a URL if it does not exist, then returns the short URL.
 * @param {string} url - URL to save
 * @return {Promise} A promise to return the corresponding short URL
 */
function saveRedirectP(url) {
  return Redirect.findOne({ url })
    .then(result => result ? result : new Redirect({ url }).save())
    .catch(error => {
      throw ('DB error');
    });
}

/**
 * Converts a moongose object into the format required by FCC.
 * @param {Object} redirect
 * @returns {Object} Shortened url object { url, shorturl }
 */
function toFccFormat(urlModel) {
  return { url: urlModel.url, shortUrl: urlModel.shortUrl };
}

module.exports = { getRedirectP, saveRedirectP, toFccFormat };
