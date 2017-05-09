"use strict";
const express = require("express"),
  bodyParser = require("body-parser"),
  lowdb = require("lowdb"),
  io = require("socket.io")();

let db = lowdb("./data/data.json");
db._.mixin(require("underscore-db"));

let api = express();

api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));

api.get("/", function (request, response) {
  response.send("Welcome to the API!");
});

let userController = require("./controllers/user")(db);
let feedbackController = require("./controllers/feedback")(db);

api.post("/api/auth", userController.auth);
api.post("/api/logout", userController.logout);
api.post("/api/users", userController.post);
api.get("/api/user/:id", userController.get);
api.put("/api/user/:id", userController.put);

api.get("/api/feedback", feedbackController.get);
api.post("/api/feedback", feedbackController.post);
api.put("/api/feedback/:id", feedbackController.put);


let port = process.env.PORT || 3000;

const server = api.listen(port, () => {
  console.log("Server is running at http://localhost:" + port);
});

io.attach(server);
io.on("connection", (socket) => {
  socket.on("postMessage", (data) => {
    io.emit("updateMessages", data);
  })
});