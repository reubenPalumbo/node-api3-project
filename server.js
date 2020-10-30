const express = require("express");

const server = express();
const userRouter = require("./users/userRouter");

server.use(express.json());
server.use(logger);

server.use("", userRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  const date = Date(Date.now());
  console.log("Method", req.method);
  console.log("URL", req.url);
  console.log("TimeStamp", date);
  next();
}

module.exports = server;
