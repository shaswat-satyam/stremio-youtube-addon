import express from "express";
import fs from "fs";
import cors from "cors";
import openDb from "./server.js";
import { title } from "process";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const db = await openDb();

console.log("App Started");

app.get("/", (req, res) => {
  res.send({
    title: "This is an API to server JSON data for various movies on Youtube",
  });
});

async () => {
  const db = await openDb();
  await db.exec(`
        CREATE TABLE IF NOT EXISTS movies (
        imdb STRING PRIMARY KEY ,
        name TEXT,
        ytId TEXT
      );
      `);
};

app.get("/data", async (req, res) => {
  try {
    const movies = await db.all("SELECT * FROM movies");
    movies.forEach((movie) => (movie["type"] = "movie"));
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/movies", async (_, res) => {
  try {
    const movies = await db.all("SELECT * FROM movies");
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/movies", async (req, res) => {
  const { imdb, pass } = req.query;
  try {
    if (!imdb || !pass || pass != "password") {
      res.status(500).json({ error: "Incomplete Data: imdb and pass" });
    } else {
      const result = await db.run("DELETE FROM movies where imdb = ?", imdb);
      res.status(201).json({ id: result.lastID, imdb });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/movies", async (req, res) => {
  const { imdb, name, ytId } = req.query;
  try {
    if (!imdb || !name || !ytId) {
      Error("Incomplete Data: imdb, name, ytId");
    }
    const result = await db.run(
      "INSERT INTO movies (imdb, name, ytId) VALUES (?, ?, ?)",
      imdb,
      name,
      ytId
    );
    res.status(201).json({ id: result.lastID, imdb, name, ytId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/movies", async (req, res) => {
  const { imdb, name, ytId } = req.query;
  try {
    if (!imdb && (!name || !ytId)) {
      res.status(201).json({ Error: "Incomplete Data: imdb name, ytId" });
    }
    if (name) {
      const result = await db.run(
        "UPDATE TABLE movies SET name = ? WHERE imdb = ?",
        name,
        imdb
      );

      res.status(201).json({ id: result.lastID, imdb, name, ytId });
    } else {
      const result = await db.run(
        "UPDATE movies SET ytId = ? WHERE imdb = ?",
        ytId,
        imdb
      );

      res.status(201).json({ id: result.lastID, imdb, name, ytId });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = 8080;
app.listen(port, () => {
  console.log(`App Running on http://localhost:${port}`);
});
