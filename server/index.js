import express from "express";
import cors from "cors";
import openDb from "./server.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const db = await openDb();

console.log("App Started");

function movieComponent(movie) {
  return `<div class="movie-item flex flex-row gap-5 items-center p-4 bg-gray-800 text-white rounded-lg shadow-md"
  id="${movie.imdb}"
  >
            <a href="https://www.youtube.com/watch?v=${
              movie.ytId
            }" target="_blank">
            <img src=
                "https://images.metahub.space/poster/medium/${
                  movie.imdb.split(":")[0]
                }/img"
              alt="${movie.imdb}"
              class="w-20 p-1 h-30 object-cover"
            />
            </a>
            <h3>${movie.name}</h3>
            <p>IMDB: ${movie.imdb}</p>
            <p>YouTube: ${movie.ytId}</p>
            <button
            hx-get="http://localhost:8080/movies/${movie.imdb}/edit"
            hx-target="#${movie.imdb}"
            hx-swap="outerHTML">
            Edit </button>
            <button
            hx-delete="http://localhost:8080/movies?imdb=${
              movie.imdb
            }&pass=password"
            hx-confirm="Are you sure you want to delete this movie?"
            hx-target="#${movie.imdb}"
            hx-swap="outerHTML">
             Delete </button>
  </div>`;
}

function editMovieForm(movie) {
  return `<form hx-patch="http://localhost:8080/movies" hx-target="#${movie.imdb}" id="${movie.imdb}" hx-swap="outerHTML">
      <label for="imdb">IMDB</label>
      <input type="text" name="imdb" value="${movie?.imdb}" placeholder="IMDB ID" required />
      <label for="name">Movie Name</label>
      <input type="text" name="name" value="${movie?.name}" placeholder="Movie Name" required />
      <label for="ytId">YouTube ID</label>
      <input type="text" name="ytId" value="${movie?.ytId}" placeholder="YouTube ID" required />
      <button type="submit" > Save </button>
      <button type="reset" hx-get="http://localhost:8080/movies/${movie?.imdb}" hx-target="#${movie?.imdb}" hx-swap="outerHTML"> Cancel </button>
    </form>`;
}
function newMovieForm() {
  return `<form hx-post="http://localhost:8080/movies" hx-target="#entries-list" hx-swap="beforeend">
      <label for="imdb">IMDB</label>
      <input type="text" name="imdb"  placeholder="IMDB ID" required />
      <label for="name">Movie Name</label>
      <input type="text" name="name"  placeholder="Movie Name" required />
      <label for="ytId">YouTube ID</label>
      <input type="text" name="ytId"  placeholder="YouTube ID" required />
      <button type="submit">Add Movie</button>
      <button type="reset">Cancel</button>
    </form>`;
}

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
app.get("/", (_, res) => {
  res.send({
    title: "This is an API to server JSON data for various movies on Youtube",
  });
});

app.get("/data", async (_, res) => {
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
    res.send(movies.map((movie) => movieComponent(movie)).join(""));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/movies/search", async (req, res) => {
  const { q } = req.query;
  try {
    const movies = await db.all("SELECT * FROM movies");
    res.send(
      movies
        .filter((movie) => movie.imdb.includes(q) || movie.name.includes(q))
        .map((movie) => movieComponent(movie.imdb, movie.name, movie.ytId))
        .join("")
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/movies/new", async (_, res) => {
  res.send(newMovieForm());
});

app.get("/movies/:imdb/edit", async (req, res) => {
  const imdb = req.params.imdb;
  const movie = await db.get("SELECT * FROM movies WHERE imdb = ?", imdb);
  res.send(editMovieForm(movie));
});

app.get("/movies/:imdb", async (req, res) => {
  const imdb = req.params.imdb;
  const movie = await db.get("SELECT * FROM movies WHERE imdb = ?", imdb);
  res.send(movieComponent(movie));
});

app.delete("/movies", async (req, res) => {
  const { imdb, pass } = req.query;
  try {
    if (!imdb || !pass || pass != "password") {
      res.status(500).json({ error: "Incomplete Data: imdb and pass" });
    } else {
      const result = await db.run("DELETE FROM movies where imdb = ?", imdb);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/movies", async (req, res) => {
  let { imdb, name, ytId } = req.body;
  try {
    if (!imdb && !name) {
      Error("Incomplete Data: imdb, name, ytId");
    } else if (name && !imdb) {
      const res = await fetch(
        "https://www.omdbapi.com/?t=" + name + "&apikey=c12fea4a"
      );
      const data = await res.json();
      if (data.Response === "True") {
        imdb = data.imdbID;
      }
    } else if (!name && imdb) {
      const res = await fetch(
        "https://www.omdbapi.com/?i=" + imdb + "&apikey=c12fea4a"
      );
      const data = await res.json();
      if (data.Response === "True") {
        name = data.Title;
      }
    }
    if (ytId.startsWith("https://www.youtube.com/watch?v=")) {
      ytId = ytId.split("=")[1].split("&")[0];
    }

    const result = await db.run(
      "INSERT INTO movies (imdb, name, ytId) VALUES (?, ?, ?)",
      imdb,
      name,
      ytId
    );
    res.send(movieComponent({ imdb, name, ytId }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/movies", async (req, res) => {
  const { imdb, name, ytId } = req.body;
  try {
    if (!imdb && (!name || !ytId)) {
      res.status(201).json({ Error: "Incomplete Data: imdb name, ytId" });
    }
    const movie = await db.get("SELECT * FROM movies WHERE imdb = ?", imdb);

    if (name != movie.name) {
      const result = await db.run(
        "UPDATE movies SET name = ? WHERE imdb = ?",
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
