"use strict";

const dns = require('dns');
const validator = require('validator');

// extracts the domain from a web URL
const DOMAIN_EXTRACTOR = /^(https?:\/\/)?([^\/]*\..{2,5})(\/.*)?$/;

/**
 * Checks whether the domain in a URL exists.
 * @param {returns} url - URL to be checked
 * @returns {Promise} A promise to return a valid URL or null
 */
function checkUrlP(url) {
  return urlToDomainP(url)
    .then(dns.promises.lookup)
    .then(value => value ? url : null)
    .catch(error => { throw('invalid url'); });
}

/**
 * Checks whether a URL is valid and whether its domain exists.
 * It is in the form of a promise so it can be chained with other promises.
 * @param {String} url
 * @returns {Promise} A promise to return the domain of the URL
 */
function urlToDomainP(url) {
  return new Promise((resolve, reject) => {
    if (!validator.isURL(url)) {
      reject("Not a valid URL");
    } else {
      let domain = url.match(DOMAIN_EXTRACTOR)[2];
      resolve(domain);
    }
  });
}

module.exports = { checkUrlP, urlToDomainP };
