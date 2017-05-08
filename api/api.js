"use strict";
const express = require("express"),
  bodyParser = require("body-parser"),
  lowdb = require("lowdb");

let db = lowdb("./data/data.json");
db._.mixin(require("underscore-db"));

let api = express();
let http = require("http").createServer(api);
let io = require("socket.io")(http);
http.listen(8080, "127.0.0.1");

api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));

api.get("/", function (request, response) {
  response.send("Welcome to the API!");
});

let usersController = require("./controllers/users")(db);
let feedbackController = require("./controllers/feedback")(db);

api.post("/api/auth", usersController.auth);
api.post("/api/logout", usersController.logout);
api.post("/api/users", usersController.post);

api.get("/api/feedback", feedbackController.get);
api.post("/api/feedback", feedbackController.post);
api.put("/api/feedback/:id", feedbackController.put);


// let port = process.env.PORT || 3000;

// let server = api.listen(port, function () {
//   console.log("Server is running at http://localhost:" + port);
// });

let chatController = require("./controllers/chat")(http);

api.get("/api/chat", chatController.get);

io.attach(http);

io.on("connection", (socket) => {
  console.log("user connected");
});

io.on("disconnect", (socket) => {
  console.log("user disconnected");
});

