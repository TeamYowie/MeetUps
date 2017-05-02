"use strict";
const authKeyGenerator = require("../utils/auth-key-generator");

module.exports = (db) => {
  const post = (req, res) => {
    let reqUser = req.body;
    let user = db("users").find({
      usernameLower: reqUser.username.toLowerCase()
    });

    if (!user || user.passHash !== reqUser.passHash) {
      return res.status(422)
      .send("Invalid username or password");
    }

    if (!user.authKey) {
      user.authKey = authKeyGenerator.get(user.id);
    }

    return res.send({
      result: {
        username: user.username,
        authKey: user.authKey
      }
    });
  };  

  return {
    post: post
  };
};