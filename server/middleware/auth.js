const models = require('../models');
const parseCookies = require('./cookieParser');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  let identifier = req.cookies.shortlyid || req.get('User-Agent');
  models.Sessions.get({hash: identifier}).then(session => {
    if (session) {
      let isTokenLegit = models.Sessions.compare(req.get('User-Agent'), session.hash, session.salt);
      if (!isTokenLegit) {
        models.Sessions.delete({hash: session.hash}).then(result => {
          // console.log('Session Token Deleted');
          next();
        });
      } else {
        req.session = session;
        next();
      }
    } else {
      models.Sessions.create(identifier).then(result => {
        models.Sessions.get({id: result.insertId}).then(session => {
          req.session = session;
          res.cookie('shortlyid', session.hash, {httpOnly: false});
          next();
        });
      });
    }
  });
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/
module.exports.verifySession = (req, res, next) => {
  console.log(req.session);
  if (!models.Sessions.isLoggedIn(req.session)) {
    models.Sessions.get({hash: req.session.hash}).then(session => {
      console.log('userId: ', req.userId);
      console.log('before: ', session);
      models.Sessions.update({hash: session.hash, userId: null}, [session.hash, req.userId]).then(result => {
        console.log('after: ', session);
      });
    });
    next();
  } else {
    next();
  }
};
