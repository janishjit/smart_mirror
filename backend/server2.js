const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const socketIo = require("socket.io");

class Server {
  constructor(port) {
    this.port = port || 8080;
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.get("/", (req, res) => {
      res.send("hello world!");
    });
    this.setupSockets();
  }

  listen() {
    this.httpServer.listen(this.port, () => {
      console.log(`Http server listening on port ${this.port}`);
    });
  }

  setupSockets() {
    const io = socketIo(this.httpServer);
    io.on("connection", (socket) => {
      console.log(`Socket ${socket.id} connected.`);
      socket.on("message", (e) => {
        console.log(e);
      });
      socket.on("disconnect", (e) => {
        console.log(JSON.stringify(e));
      });
    });
  }
}

module.exports = Server;
