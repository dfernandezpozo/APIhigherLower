const http = require("http");
const {
  getMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  getGame,
} = require("./controllers/moviesController");

const server = http.createServer((req, res) => {
  if (req.url === "/movies" && req.method === "GET") getMovies(req, res);
  else if (req.url === "/movies" && req.method === "POST") addMovie(req, res);
  else if (req.url.startsWith("/movies/") && req.method === "PUT")
    updateMovie(req, res);
  else if (req.url.startsWith("/movies/") && req.method === "DELETE")
    deleteMovie(req, res);
  else if (req.url === "/game" && req.method === "GET") getGame(req, res);
  else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Endpoint no encontrado" }));
  }
});

server.listen(3000, () =>
  console.log("API corriendo en http://localhost:3000")
);
