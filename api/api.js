"use strict";

const express = require("express"),
        logger = require("morgan"),
        bodyParser = require("body-parser"),
        lowdb = require('lowdb');

let db = lowdb("./api/data/data.json");
db._.mixin(require("underscore-db"));

let api = express();
api.use(logger("dev"));
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));
api.use('/libs', express.static('./../node_modules'));

let usersController = require("./controllers/users")(db);
api.post("/api/auth", usersController.post);

api.get('/', function(request, response){
  response.send('Welcome to the API!');
});

let port = process.env.PORT || 8080;

api.listen(port, function() {
        console.log('Server is running at http://localhost:' + port);
});