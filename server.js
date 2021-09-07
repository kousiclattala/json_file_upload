const express = require("express");
const app = express();
const mongodb = require("mongodb");
const cors = require("cors");
const expressUpload = require("express-fileupload");
const fs = require("fs");

// middleware
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(
  expressUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Database stuff

// db connection string, in mongodb uri string password should be encoded
// if your password contain special characters like ! @ # etc, you should encode them.
const uri =
  "mongodb+srv://admin:admin%40123@gfs01.y06lg.mongodb.net/testDB?retryWrites=true&w=majority";

// creating a DB connection
const client = new mongodb.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// connecting to Db and checking whether it is connected properly or not.
client
  .connect()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

const db = client.db("testDB");
const bucket = new mongodb.GridFSBucket(db, { bucketName: "test_photos" });

// routes

// @upload
// POST method
app.post("/upload", (req, res) => {
  console.log(req.files);

  const files = req.files.myFile;

  fs.createReadStream(files.tempFilePath).pipe(
    bucket
      .openUploadStream(files.name)
      .on("error", () => res.json({ err: "Error in uploading file to DB" }))
      .on("finish", () => res.json({ msg: "File Uploaded Successful" }))
      .on("close", () => console.log("connection closed success"))
  );
});

// @getFiles
// GEt method
app.get("/", (req, res) => {
  const cursor = bucket.find({});

  const allFiles = [];

  cursor
    .forEach((file) => {
      console.log(file);
      allFiles.push(file);
    })
    .then(() => {
      const readFile = bucket.openDownloadStreamByName(allFiles[0].filename);
      readFile.pipe(res);
    })
    .catch((err) => {
      console.log(err);
    });
});

// server stuff
const PORT = 5000;

app.listen(PORT, () => {
  console.log("Connected to Server.....");
  console.log(`You can visit server 👉 http://localhost:${PORT}`);
});
