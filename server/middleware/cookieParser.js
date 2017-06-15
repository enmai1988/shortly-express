const qs = require('querystring');

const parseCookies = (req, res, next) => {
  req.cookies = qs.parse(req.headers.cookie, '; ');
  next();
};

module.exports = parseCookies;
