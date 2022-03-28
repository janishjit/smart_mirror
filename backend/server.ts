// const http = require("http");
// const express = require("express");
// const bodyParser = require("body-parser");
// const socketIo = require("socket.io");
import http from "http";
import express from "express";
import bodyParser from "body-parser";
import socketIo from "socket.io";
import AWS, { LexRuntimeV2, Config } from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

const accessKeyId = process.env.AWS_ACCESS_KEY_ID as string;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY as string;
if (!accessKeyId || !secretAccessKey)
  throw new Error("Please pass aws credentials via .env");

const myCredentials = new AWS.Credentials({
  accessKeyId,
  secretAccessKey,
});
var myConfig = new AWS.Config({
  credentials: myCredentials,
  region: "us-east-1",
});

let lex = new LexRuntimeV2({ apiVersion: "2020-08-07", region: "us-east-1" });
const makeParams = (inputText: string): LexRuntimeV2.RecognizeTextRequest => ({
  botId: "CGF3YFJABT",
  botAliasId: "TSTALIASID",
  localeId: "en_US",
  text: inputText,
  sessionId: "onlyUser",
});

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
    this.app.get("/ShowCloset", async (req, res) => {
      io.emit("ShowCloset");
      res.sendStatus(200);
    });
    this.app.get("/ShowDay", async (req, res) => {
      io.emit("ShowDay");
      res.sendStatus(200);
    });
    this.app.get("/NextMeeting", async (req, res) => {
      io.emit("NextMeeting");
      res.sendStatus(200);
    });
    this.app.get("/ShowUnread", async (req, res) => {
      io.emit("ShowUnread");
      res.sendStatus(200);
    });
    this.app.get("/ListReminders", async (req, res) => {
      io.emit("ListReminders");
      res.sendStatus(200);
    });
    io.on("connection", (socket) => {
      // this could lead to bugs i think, multiple handlers init-ed
      this.app.post("/voice", async (req, res) => {
        io.emit("voice", req.body);
        let request = makeParams(req.body.data);
        console.log(request);
        console.log(req.body);

        lex.recognizeText(makeParams(req.body.data), (err, data) => {
          io.emit("voiceresponse", data);
        });
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
