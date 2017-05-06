"use strict";
const authKeyGenerator = require("../utils/auth-key-generator");

// changed previous post to put
module.exports = (db) => {
  const post = (req, res) => {
    let reqUser = req.body;
    if (!reqUser || typeof reqUser.username !== "string" || typeof reqUser.passHash !== "string") {
      res.status(400)
        .json("Invalid username or password");
      return;
    }

    let duplicateUser = db("users").find({
      usernameToLower: reqUser.username.toLowerCase()
    });

    if (duplicateUser) {
      res.status(409)
        .json('Duplicated user');
      return;
    }

    reqUser.usernameLower = reqUser.username.toLowerCase();

    return res.status(201).send({
      result: {
        username: reqUser.username,
      }
    });
  };
  const put = (req, res) => {
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

    return res.status(200).send({
      result: {
        username: user.username,
        authKey: user.authKey
      }
    });
  };

  return {
    post: post,
    put: put
  };
};