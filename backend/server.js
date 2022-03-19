const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const socketIo = require("socket.io");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const { uploadFile, getFileStream } = require("./s3");

const app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const httpServer = http.createServer(app);
const io = socketIo(httpServer);
io.on(Event.CONNECT, (socket) => {
  console.log(`Socket ${socket.id} connected.`);
  socket.on("message", (e) => {
    console.log(e);
  });
});

// app.get("/images/:key", (req, res) => {
//   console.log(req.params);
//   const key = req.params.key;
//   const readStream = getFileStream(key);
//   readStream.pipe(res);
// });

// app.post("/images", upload.single("image"), async (req, res) => {
//   const file = req.file;
//   console.log(file);

//   // Remove background

//   const result = await uploadFile(file);
//   await unlinkFile(file.path);
//   console.log(result);
//   const description = req.body.description;
//   res.send({ imagePath: `/images/${result.Key}` });
// });

app.listen(8080, () => console.log("listening on port 8080"));
