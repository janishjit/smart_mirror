// const http = require("http");
// const express = require("express");
// const bodyParser = require("body-parser");
// const socketIo = require("socket.io");
import { v4 as uuid } from "uuid";
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

const s3 = new AWS.S3();
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

    this.app.get("/pants", async (req, res) => {
      let result = await s3
        .listObjects({
          Bucket: "magic-mirror-clothing-images",
          Prefix: "pants",
        })
        .promise();
      result.Contents?.splice(0, 1);
      let keys = result.Contents?.map((obj) => obj.Key);
      res.json(keys);
    });

    this.app.get("/shirts", async (req, res) => {
      let result = await s3
        .listObjects({
          Bucket: "magic-mirror-clothing-images",
          Prefix: "shirts",
        })
        .promise();
      result.Contents?.splice(0, 1);
      let keys = result.Contents?.map((obj) => obj.Key);
      res.json(keys);
    });

    this.app.get("/uncategorized", async (req, res) => {
      let result = await s3
        .listObjects({
          Bucket: "magic-mirror-clothing-images",
          Delimiter: "/",
        })
        .promise();
      let keys = result.Contents?.map((obj) => obj.Key);
      res.json(keys);
    });

    this.app.get("/moveitem", async (req, res) => {
      let item = req.query.item as string;
      let itemName = item.split("amazonaws.com/")[1];
      let dest = req.query.dest;
      let itemPath = itemName.split("/");
      let itemId = itemPath[itemPath.length - 1];
      console.log(itemId);

      console.log(item);
      console.log(itemName);
      console.log(dest);
      try {
        console.log(
          "Copying object to",
          `magic-mirror-clothing-images/${dest}/${itemName}`
        );

        await s3
          .copyObject({
            Bucket: "magic-mirror-clothing-images",
            Key: `${dest}/${itemId}`,
            CopySource: `/magic-mirror-clothing-images/${itemName}`,
          })
          .promise();

        console.log(
          "Deleting object",
          `magic-mirror-clothing-images/${itemName}`
        );

        await s3
          .deleteObject({
            Bucket: "magic-mirror-clothing-images",
            Key: `${itemName}`,
          })
          .promise();

        res.sendStatus(200);
      } catch (e) {
        res.send({ err: e }).status(500);
      }
    });

    this.app.get("/deleteitem", async (req, res) => {
      let item = req.query.item as string;
      let itemName = item.split("amazonaws.com/")[1];
      try {
        console.log(
          "Deleting object",
          `magic-mirror-clothing-images/${itemName}`
        );

        await s3
          .deleteObject({
            Bucket: "magic-mirror-clothing-images",
            Key: `${itemName}`,
          })
          .promise();

        res.sendStatus(200);
      } catch (e) {
        res.send({ err: e }).status(500);
      }
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
    this.app.post("/voice", async (req, res) => {
      io.emit("voice", req.body);
      let request = makeParams(req.body.data);
      console.log(request);
      console.log(req.body);

      lex.recognizeText(makeParams(req.body.data), (err, data) => {
        if (err) {
          console.log("ERROR: ", err);
        } else {
          console.log(data);
          io.emit("voiceresponse", {
            data,
            intentName: data.interpretations![0].intent?.name,
          });
        }

        io.emit("voiceError", {
          error: err,
          message: "Lex error",
        });
      });
      res.sendStatus(200);
    });

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
