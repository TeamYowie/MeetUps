"use strict";
const chars = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM!@#$%^&*()_+-=",
  length = 60;

module.exports = () => {
  const get = (id) => {
    let authKey = "";
    authKey += id;
    while (authKey.length < length) {
      var index = (Math.random() * chars.length) | 0;
      authKey += chars[index];
    }
    return authKey;
  };

  return {
    get
  };
};