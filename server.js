// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const { nanoid } = require("nanoid");

const app = express();
const PORT = process.env.PORT || 3001;

// parsing the data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// routes
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/notes.html"))
);

// Gets db notes
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

// Adds note to db
app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = nanoid(10);
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    const parseData = JSON.parse(data);
    console.log(JSON.parse(data));
    parseData.push(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(parseData), (err) => {
      if (err) throw err;
      res.json(parseData);
    });
  });
});

// Deletes note
app.delete("/api/notes/:id", (req, res) => {
  fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err;
    const noteArr = JSON.parse(data).filter(
      (note) => note.id !== req.params.id
    );
    fs.writeFile("./db/db.json", JSON.stringify(noteArr), (err) => {
      if (err) throw err;
      res.json(data);
    });
  });
});

// Listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
