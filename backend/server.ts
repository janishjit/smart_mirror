// const http = require("http");
// const express = require("express");
// const bodyParser = require("body-parser");
// const socketIo = require("socket.io");
import http from "http";
import express from "express";
import bodyParser from "body-parser";
import socketIo from "socket.io";

class Server {
  public port;
  private app;
  private httpServer;
  constructor(port: number) {
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
    const io = new socketIo.Server(this.httpServer);
    this.app.get("/showCloset", async (req, res) => {
      io.emit("showCloset");
      res.sendStatus(200);
    });
    io.on("connection", (socket) => {
      // this could lead to bugs i think, multiple handlers init-ed
      this.app.post("/voice", async (req, res) => {
        io.emit("voice", req.body);
        res.sendStatus(200);
      });
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

export default Server;
