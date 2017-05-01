"use strict";
const AUTH_KEY_HEADER_NAME = 'x-auth-key';

module.exports = (api, db) => {
    api.use(function(req, res, next) {
        let authKey = req.headers[AUTH_KEY_HEADER_NAME];
        let user = db('users').find({
            authKey: authKey
        });
        req.user = user || null;
        next();
  });
};
