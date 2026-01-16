﻿using APIhl.Services;

namespace APIhl.Main
{
    class Program
    {
        static async Task Main(string[] args)
        {
            MovieService service = new MovieService();

            // 🔹 Ping inicial a la API
            try
            {
                await service.CheckApi(); // Llamada de verificación
            }
            catch
            {
                Console.WriteLine("❌ No se puede conectar con la API Node.js. Levanta host.js primero.");
                return; // Termina el programa
            }

            bool exit = false;

            while (!exit)
            {
                Console.WriteLine("\n--- MOVIE HIGHER OR LOWER ---");
                Console.WriteLine("1. Ver películas (GET)");
                Console.WriteLine("2. Añadir película (POST)");
                Console.WriteLine("3. Modificar película (PUT)");
                Console.WriteLine("4. Borrar película (DELETE)");
                Console.WriteLine("5. Jugar Higher or Lower");
                Console.WriteLine("0. Salir");
                Console.Write("Elige una opción: ");

                string option = Console.ReadLine()!;

                switch (option)
                {
                    case "1": await service.GetMovies(); break;
                    case "2": await service.AddMovie(); break;
                    case "3": await service.UpdateMovie(); break;
                    case "4": await service.DeleteMovie(); break;
                    case "5": await service.PlayGame(); break;
                    case "0": exit = true; break;
                    default: Console.WriteLine("Opción no válida"); break;
                }
            }
        }
    }
}
