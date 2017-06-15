const models = require('../models');
const parseCookies = require('./cookieParser');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  if (!req.cookies.shortlyid) {
    console.log('You are here');
  }
  next();
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/
