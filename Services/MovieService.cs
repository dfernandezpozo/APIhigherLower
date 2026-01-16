using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using APIhl.Models;

namespace APIhl.Services
{
    public class MovieService
    {
        private readonly HttpClient client;
        private readonly string baseUrl = "http://localhost:3000"; 

        public MovieService()
        {
            client = new HttpClient();
        }

        public async Task CheckApi()
        {
            var response = await client.GetAsync($"{baseUrl}/movies");
            response.EnsureSuccessStatusCode(); 
        }


        // GET 
        public async Task GetMovies()
        {
            try
            {
                var movies = await client.GetFromJsonAsync<List<Movie>>($"{baseUrl}/movies");
                Console.WriteLine("\n--- LISTA DE PELÍCULAS ---");
                foreach (var m in movies!)
                    Console.WriteLine($"{m.Id} - {m.Title} ({m.Year}) - IMDb: {m.ImdbRating}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al obtener películas: {ex.Message}");
            }
        }

        // POST 
        public async Task AddMovie()
        {
            try
            {
                Console.Write("Título: ");
                string title = Console.ReadLine()!;
                Console.Write("Rating IMDb: ");
                double rating = double.Parse(Console.ReadLine()!);
                Console.Write("Año: ");
                int year = int.Parse(Console.ReadLine()!);

                var newMovie = new Movie { Title = title, ImdbRating = rating, Year = year };
                var response = await client.PostAsJsonAsync($"{baseUrl}/movies", newMovie);

                if (response.IsSuccessStatusCode)
                {
                    var created = await response.Content.ReadFromJsonAsync<Movie>();
                    Console.WriteLine($"Película añadida ✅ Id: {created!.Id}");
                }
                else
                {
                    Console.WriteLine($"Error al añadir película: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
        }

        // PUT 
        public async Task UpdateMovie()
        {
            try
            {
                Console.Write("ID de la película a modificar: ");
                int id = int.Parse(Console.ReadLine()!);

                Console.Write("Nuevo título: ");
                string title = Console.ReadLine()!;
                Console.Write("Nuevo rating IMDb: ");
                double rating = double.Parse(Console.ReadLine()!);
                Console.Write("Nuevo año: ");
                int year = int.Parse(Console.ReadLine()!);

                var updateMovie = new Movie { Title = title, ImdbRating = rating, Year = year };
                var response = await client.PutAsJsonAsync($"{baseUrl}/movies/{id}", updateMovie);

                if (response.IsSuccessStatusCode)
                {
                    var updated = await response.Content.ReadFromJsonAsync<Movie>();
                    Console.WriteLine($"Película modificada ✅ Id: {updated!.Id}");
                }
                else
                {
                    Console.WriteLine($"Error al modificar película: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
        }

        // DELETE
        public async Task DeleteMovie()
        {
            try
            {
                Console.Write("ID de la película a borrar: ");
                int id = int.Parse(Console.ReadLine()!);

                var response = await client.DeleteAsync($"{baseUrl}/movies/{id}");
                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine("Película eliminada ✅");
                }
                else
                {
                    Console.WriteLine($"Error al eliminar película: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
        }

        // GET 
        public async Task PlayGame()
        {
            try
            {
                var response = await client.GetAsync($"{baseUrl}/game");
                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine("No se pudo iniciar el juego ❌");
                    return;
                }

                var json = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(json);
                var root = doc.RootElement;

                var movieA = JsonSerializer.Deserialize<Movie>(root.GetProperty("movieA").GetRawText())!;
                var movieB = JsonSerializer.Deserialize<Movie>(root.GetProperty("movieB").GetRawText())!;

                int score = 0;

                while (true)
                {
                    Console.WriteLine($"\nA: {movieA.Title} ({movieA.Year})");
                    Console.WriteLine($"B: {movieB.Title} ({movieB.Year})");
                    Console.Write("¿Cuál tiene mayor rating IMDb? (A/B): ");
                    string guess = Console.ReadLine()!.ToUpper();

                    bool correct = (guess == "A" && movieA.ImdbRating >= movieB.ImdbRating)
                                  || (guess == "B" && movieB.ImdbRating >= movieA.ImdbRating);

                    Console.WriteLine($"Valoraciones: A: {movieA.ImdbRating}, B: {movieB.ImdbRating}");

                    if (correct)
                    {
                        score++;
                        Console.WriteLine("¡Correcto! Sigamos →");
                        movieA = movieB;

                        
                        response = await client.GetAsync($"{baseUrl}/game");
                        json = await response.Content.ReadAsStringAsync();
                        using var newDoc = JsonDocument.Parse(json);
                        var newRoot = newDoc.RootElement;
                        movieB = JsonSerializer.Deserialize<Movie>(newRoot.GetProperty("movieB").GetRawText())!;
                    }
                    else
                    {
                        Console.WriteLine("¡Incorrecto! ❌");
                        Console.WriteLine($"Puntuación final: {score}");
                        break;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al jugar: {ex.Message}");
            }
        }
    }
}
