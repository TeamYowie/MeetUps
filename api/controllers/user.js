"use strict";
const AUTH_KEY_HEADER_NAME = "x-auth-key";
const authKeyGenerator = require("./../utils/auth-key-generator")();
const idGenerator = require("./../utils/id-generator")();

module.exports = (db) => {
  const put = (req, res) => {
    let reqUserId = req.params.id;
    let reqUserData = req.body;
    let authKey = req.headers[AUTH_KEY_HEADER_NAME];

    if (!reqUserId) {
      return res.status(422)
        .send("Invalid new data!");
    }

    let user = db("users").find({
      id: reqUserId
    });

    if (!user || user.passHash !== reqUserData.passHash || user.authKey !== authKey) {
      return res.status(422)
        .send("Invalid credentials!");
    }

    if (reqUserData.firstname) {
      user.firstname = reqUserData.firstname;
    }

    if (reqUserData.lastname) {
      user.lastname = reqUserData.lastname;
    }

    if (reqUserData.email) {
      user.email = reqUserData.email;
    }

    if (reqUserData.newPassHash) {
      user.passHash = reqUserData.newPassHash;
    }

    if (reqUserData.profileImage) {
      user.profileImage = reqUserData.profileImage;
    }

    db.save();

    return res.status(200)
      .send("User updated!");
  };

  const get = (req, res) => {
    let reqUserId = req.params.id;
    let authKey = req.headers[AUTH_KEY_HEADER_NAME];

    let user = db("users").find({
      id: reqUserId
    });

    if (!user || user.authKey !== authKey) {
      return res.status(422)
        .send("Invalid credentials.");
    }

    return res.status(200)
      .send({
        result: {
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage
        }
      });
  };

  const post = (req, res) => {
    let reqUser = req.body;
    if (!reqUser || typeof reqUser.username !== "string" || typeof reqUser.passHash !== "string") {
      return res.status(422)
        .send("Invalid username or password!");
    }

    let duplicateUser = db("users").find({
      usernameLower: reqUser.username.toLowerCase()
    });

    if (duplicateUser) {
      return res.status(409)
        .send('Duplicated user!');
    }

    reqUser.usernameLower = reqUser.username.toLowerCase();
    reqUser.id = idGenerator.get();
    db("users").insert(reqUser);

    return res.status(201)
      .send("User created!");
  };

  const auth = (req, res) => {
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
      db.save()
    }

    return res.status(200)
      .send({
        result: {
          id: user.id,
          username: user.username,
          authKey: user.authKey,
          profileImage: user.profileImage
        }
      });
  };

  const logout = (req, res) => {
    let reqUserId = req.body.id;
    let authKey = req.headers[AUTH_KEY_HEADER_NAME];

    let user = db("users").find({
      id: reqUserId
    });

    if (!user || user.authKey !== authKey) {
      return res.status(422)
        .send("Invalid credentials.");
    }

    user.authKey = null;
    db.save();

    return res.status(200)
      .send();
  };

  const all = (req, res) => {
    let reqUserId = req.id;
    let authKey = req.headers[AUTH_KEY_HEADER_NAME];
    console.log(reqUserId);
    let user = db("users").find({
      id: reqUserId
    });

    if (!user || user.authKey !== authKey) {
      return res.status(422)
        .send("Invalid credentials.");
    }

    let users = db("users");

    return res.status(200).send(users);
  }

  return {
    put,
    get,
    post,
    auth,
    logout,
    all
  };
};