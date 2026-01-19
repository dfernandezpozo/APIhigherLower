# 🎬 Movie Higher or Lower

  

## Descripción

**Movie Higher or Lower** es un proyecto de consola en **C#** que se conecta a una **API Node.js** para gestionar películas y jugar al juego **Higher or Lower** basado en su rating IMDb.

Puedes ver, agregar, modificar y eliminar películas, y desafiarte adivinando cuál tiene mayor puntuación IMDb.

  

---

  

## Tecnologías usadas

  

-  **Cliente:** C# (.NET 7)

-  **Servidor:** Node.js

-  **Almacenamiento:** JSON (`movies.json`)

-  **Comunicación:** HTTP (GET, POST, PUT, DELETE)

  

---

  

## Instalación

  

### 1. Servidor Node.js

  

1. Asegúrate de tener Node.js instalado.

2. Abre la terminal en la carpeta del servidor.

3. Instala dependencias (si las hubiera, en este caso solo Node.js nativo):

```bash

npm install
```

Ejecuta el servidor:
```bash

  

node host.js
```

  
  

***El servidor escuchará en: http://localhost:3000***

  

### 2. Cliente C#

  

- Abre el proyecto en Visual Studio o VS Code.

  

- Asegúrate de tener .NET 7 instalado.
- **IMPORTANTE** hacerlo en otra terminal distinta a la que hemos usado para el **node host.js** 

  

**Ejecuta la aplicación:**

  
```bash
dotnet run
```

  
  

**La aplicación de consola se conectará automáticamente al servidor Node.js.**

  

### 3.Uso

  

Al iniciar la aplicación de consola, verás un menú:

  
```bash
--- MOVIE HIGHER OR LOWER ---

1. Ver películas (GET)

2. Añadir película (POST)

3. Modificar película (PUT)

4. Borrar película (DELETE)

5. Jugar Higher or Lower

0. Salir
```
  

***Funcionalidades***

  

***Ver películas***

- Muestra todas las películas con su Id, Título, Año y IMDb Rating.

  

***Añadir película***

- Ingresa Título, Rating IMDb y Año. La película se añade al JSON.

  

***Modificar película***

- Selecciona una película por Id y actualiza sus datos.

  

***Borrar película***

- Selecciona una película por Id y elimínala.

  

***Jugar Higher or Lower***

  

- El juego muestra dos películas: A y B.

  

- Adivina cuál tiene mayor rating IMDb escribiendo **A o B**.

  

- Si aciertas, la película B pasa a ser A y se genera una nueva B.

  

- Si fallas, termina el juego y muestra tu puntuación.

  

### 4.Endpoints del Servidor


- **GET** /movies Obtener todas las películas

- **POST** /movies Añadir una nueva película

- **PUT** /movies/:id Modificar película por id

- **DELETE** /movies/:id Borrar película por id

- **GET** /game Obtener dos películas aleatorias para el juego

***Ejemplo de movies.json***
```bash

[

{

"Id": 1,

"Title": "The Shawshank Redemption",

"ImdbRating": 9.3,

"Year": 1994

},

{

"Id": 2,

"Title": "The Godfather",

"ImdbRating": 9.2,

"Year": 1972

},

{

"Id": 3,

"Title": "The Dark Knight",

"ImdbRating": 9,

"Year": 2008

}

]

 ```

## Notas

  

- Orden obligatorio: primero iniciar el servidor Node.js y luego ejecutar el cliente C#.

  

- La aplicación maneja errores si la API no está disponible.

  

- Puedes añadir tus propias películas al JSON antes de ejecutar la aplicación.

  

- Para el juego, se necesitan al menos 2 películas cargadas.