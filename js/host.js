const http = require("http");
const fs = require("fs");
const path = require("path");


const filePath = path.join(__dirname, "..", "Data", "movies.json");


function saveData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function loadData() {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  const movies = loadData();

  // GET 
  if (req.url === "/movies" && req.method === "GET") {
    res.write(JSON.stringify(movies, null, 2));
    res.end();

  // POST 
  } else if (req.url === "/movies" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const newMovie = JSON.parse(body);
      const newId = movies.length ? Math.max(...movies.map(m => m.Id)) + 1 : 1;
      newMovie.Id = newId;
      movies.push(newMovie);
      saveData(movies);
      res.statusCode = 201;
      res.write(JSON.stringify(newMovie, null, 2));
      res.end();
    });

  // PUT 
  } else if (req.url.startsWith("/movies/") && req.method === "PUT") {
    const id = parseInt(req.url.split("/")[2]);
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const movie = movies.find(m => m.Id === id);
      if (movie) {
        const update = JSON.parse(body);
        movie.Title = update.Title ?? movie.Title;
        movie.ImdbRating = update.ImdbRating ?? movie.ImdbRating;
        movie.Year = update.Year ?? movie.Year;
        saveData(movies);
        res.write(JSON.stringify(movie, null, 2));
        res.end();
      } else {
        res.statusCode = 404;
        res.write(JSON.stringify({ error: "Película no encontrada" }));
        res.end();
      }
    });

  // DELETE 
  } else if (req.url.startsWith("/movies/") && req.method === "DELETE") {
    const id = parseInt(req.url.split("/")[2]);
    const index = movies.findIndex(m => m.Id === id);
    if (index !== -1) {
      const deleted = movies.splice(index, 1)[0];
      saveData(movies);
      res.write(JSON.stringify({ message: "Película eliminada", deleted }, null, 2));
      res.end();
    } else {
      res.statusCode = 404;
      res.write(JSON.stringify({ error: "Película no encontrada" }));
      res.end();
    }

  // GET
  } else if (req.url === "/game" && req.method === "GET") {
    if (movies.length < 2) {
      res.statusCode = 400;
      res.write(JSON.stringify({ error: "No hay suficientes películas" }));
      res.end();
      return;
    }

    const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];
    let movieA = rnd(movies);
    let movieB = rnd(movies);
    while (movieB.Id === movieA.Id) movieB = rnd(movies);

    res.write(JSON.stringify({ movieA, movieB }, null, 2));
    res.end();

  } else {
    res.statusCode = 404;
    res.write(JSON.stringify({ error: "Endpoint no encontrado" }));
    res.end();
  }
});


server.listen(3000, () => {
  console.log("API corriendo en http://localhost:3000");
});
