const API_KEY="888ffa96";

document.getElementById("searchBtn").addEventListener("click", async () => {
    const searchTerm = document.getElementById("searchInput").value;
    if (!searchTerm) {
        alert("Please enter a movie title!");
        return;
    }

    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=${API_KEY}`);
        const data = await response.json();

        if (data.Response === "False") {
            alert(data.Error);
            return;
        }

        displayMovies(data.Search);
    } catch (error) {
        alert("Failed to fetch movie data. Please try again.");
    }
});

function displayMovies(movies) {
    const movieList = document.getElementById("movieList");
    movieList.innerHTML = ""; // Clear previous results

    movies.forEach(movie => {
        const movieDiv = document.createElement("div");
        movieDiv.classList.add("movie-item");
        movieDiv.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}">
            <p>${movie.Title} (${movie.Year})</p>
        `;
        movieDiv.addEventListener("click", () => fetchMovieDetails(movie.imdbID));
        movieList.appendChild(movieDiv);
    });
}

async function fetchMovieDetails(imdbID) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const text = await response.text();  // Read raw response
        console.log("Raw Response:", text);

        // Ensure valid JSON
        if (!text || text.trim().length === 0) {
            throw new Error("Empty response from API");
        }

        const data = JSON.parse(text);  // Convert text to JSON

        if (data.Response === "False") {
            throw new Error(data.Error);
        }

        const movieDetails = document.getElementById("movieDetails");
        movieDetails.innerHTML = `
            <h2>${data.Title}</h2>
            <img src="${data.Poster}" alt="${data.Title}">
            <p><strong>Plot:</strong> ${data.Plot}</p>
            <p><strong>Actors:</strong> ${data.Actors}</p>
            <button onclick="document.getElementById('movieDetails').innerHTML = ''">Back</button>
        `;
    } catch (error) {
        console.error("Fetch error:", error);
        alert(`Failed to fetch movie details: ${error.message}`);
    }
}



