const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

console.log("App Started");

let mediaData = {};

function readSavedData() {
  const file = "data.json";
  data = fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.log(err);
    }
    try {
      res = JSON.parse(data);
      Object.entries(res).map(([id, key]) => (mediaData[id] = key));
    } catch (parseErr) {
      console.error("Error parsing JSON data:", parseErr);
    }
  });
}

readSavedData();

app.get("/", (req, res) => {
  res.send({ hello: "world" });
});

app.get("/refresh", (req, res) => {
  const file = "output.json";
  data = fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.log(err);
    }
    try {
      mediaData = JSON.parse(data);
    } catch (parseErr) {
      console.error("Error parsing JSON data:", parseErr);
      res.send({ Error: "Error Parsing JSON data" });
    }
  });
  res.send("Done");
});

app.get("/data", (req, res) => {
  res.send(mediaData);
});

app.get("/add", (req, res) => {
  const imdbKey = req.query.imdbKey;
  const type = req.query.type;
  const id = req.query.id;
  const name = req.query.name;

  if (
    (imdbKey != undefined) &
    (type != undefined) &
    (id != undefined) &
    (name != undefined)
  ) {
    mediaData[imdbKey] = {
      name: name,
      type: type,
      ytId: id,
    };
    res.send("Added a new item");
  } else {
    res.send("Please provide imdbKey, type, id and name");
  }
});

app.get("/save", (req, res) => {
  var writer = fs.createWriteStream("output.json");
  writer.write(JSON.stringify(mediaData));
});

const port = 8080;
app.listen(port, () => {
  console.log(`App Running on http://localhost:${port}`);
});
