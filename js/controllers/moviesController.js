const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "..", "Data", "movies.json");


function loadData() {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function saveData(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// GET 
function getMovies(req, res) {
    const movies = loadData();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(movies, null, 2));
}

// POST 
function addMovie(req, res) {
    const movies = loadData();
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
        try {
            const newMovie = JSON.parse(body);
            const newId = movies.length ? Math.max(...movies.map(m => m.Id)) + 1 : 1;
            newMovie.Id = newId;
            movies.push(newMovie);
            saveData(movies);
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify(newMovie, null, 2));
        } catch (err) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Datos inválidos" }));
        }
    });
}

// PUT 
function updateMovie(req, res) {
    const movies = loadData();
    const id = parseInt(req.url.split("/")[2]);
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
        const movie = movies.find(m => m.Id === id);
        if (movie) {
            try {
                const update = JSON.parse(body);
                movie.Title = update.Title ?? movie.Title;
                movie.ImdbRating = update.ImdbRating ?? movie.ImdbRating;
                movie.Year = update.Year ?? movie.Year;
                saveData(movies);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(movie, null, 2));
            } catch {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Datos inválidos" }));
            }
        } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Película no encontrada" }));
        }
    });
}

// DELETE 
function deleteMovie(req, res) {
    const movies = loadData();
    const id = parseInt(req.url.split("/")[2]);
    const index = movies.findIndex(m => m.Id === id);
    if (index !== -1) {
        const deleted = movies.splice(index, 1)[0];
        saveData(movies);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Película eliminada", deleted }, null, 2));
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Película no encontrada" }));
    }
}

// GET 
function getGame(req, res) {
    const movies = loadData();
    if (movies.length < 2) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "No hay suficientes películas" }));
        return;
    }

    const rnd = arr => arr[Math.floor(Math.random() * arr.length)];
    let movieA = rnd(movies);
    let movieB = rnd(movies);
    while (movieB.Id === movieA.Id) movieB = rnd(movies);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ movieA, movieB }, null, 2));
}

// Exportaamos las funciones
module.exports = { getMovies, addMovie, updateMovie, deleteMovie, getGame };
