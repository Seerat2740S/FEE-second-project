const apiKey = 'ab993f27';
const searchInput = document.getElementById('searchInput');
const moviesContainer = document.getElementById('movies');

async function searchMovies(query) {
    try {
        const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`);
        const data = await response.json();
        return data.Search;
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

function displayMovies(movies) {
    moviesContainer.innerHTML = '';
    if (movies) {
        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('bg-white', 'p-4', 'rounded-md', 'shadow-md', 'mb-4');
            movieCard.innerHTML = `
                <img src="${movie.Poster}" alt="${movie.Title}" class="w-full mb-4">
                <h2 class="text-lg font-semibold mb-2">${movie.Title}</h2>
                <p class="text-gray-600 mb-2">Year: ${movie.Year}</p>
                <p class="text-gray-600 mb-2">IMDb Rating: ${movie.imdbRating}</p>
                <button class="bg-blue-500 text-white px-4 py-2 rounded-md" onclick="addToWatchLater('${movie.imdbID}')">Watch Later</button>
            `;
            movieCard.addEventListener('click', () => {
                window.location.href = `movieDetails.html?id=${movie.imdbID}`;
            });
            moviesContainer.appendChild(movieCard);
        });
    } else {
        moviesContainer.innerHTML = '<p class="text-red-500">No movies found!</p>';
    }
}

async function fetchRandomMovie() {
    const url = `http://www.omdbapi.com/?apikey=${apiKey}&type=movie&r=json`;
    const response = await fetch(url);
    const data = await response.json();
    const movies = data.Search;
    const randomIndex = Math.floor(Math.random() * movies.length);
    const randomMovie = movies[randomIndex];
    return randomMovie;
}

function displayMovie(movie) {
    const movieCard = document.querySelector('#randomMovieRecommendation.movie-card');
    movieCard.innerHTML = `
      <img src="${movie.Poster}" alt="${movie.Title} poster" class="w-full h-40 object-cover">
      <h2 class="text-xl font-bold mt-2">${movie.Title}</h2>
      <p class="text-gray-500">${movie.Year}</p>
    `;
}

async function showRandomMovie() {
    try {
        const movie = await fetchRandomMovie();
        displayMovie(movie);
    } catch (error) {
        console.error(error);
    }
}
window.addEventListener('load', showRandomMovie);

async function getRandomMovieByGenre(genre) {
    try {
        const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${genre}&type=movie&page=${Math.floor(Math.random() * 10) + 1}`);
        const data = await response.json();
        if (data.Search && data.Search.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.Search.length);
            return data.Search[randomIndex];
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error fetching random movie for genre ${genre}:`, error);
        return null;
    }
}

function addToWatchLater(movieId) {
    let watchLaterList = JSON.parse(localStorage.getItem('watchLater')) || [];
    if (!watchLaterList.includes(movieId)) {
        watchLaterList.push(movieId);
        localStorage.setItem('watchLater', JSON.stringify(watchLaterList));
        alert(`Added movie with ID ${movieId} to watch later list!`);
    } else {
        alert(`Movie with ID ${movieId} is already in your watch later list!`);
    }
}

async function displayRandomMovies() {
    for (const genre of genres) {
        const movie = await getRandomMovieByGenre(genre);
        if (movie) {
            const movieCard = document.createElement('div');
            movieCard.classList.add('bg-white', 'p-4', 'rounded-md', 'shadow-md', 'mb-4');
            movieCard.innerHTML = `
                <img src="${movie.Poster}" alt="${movie.Title}" class="w-full mb-4">
                <h2 class="text-lg font-semibold mb-2">${movie.Title}</h2>
                <p class="text-gray-600 mb-2">Genre: ${genre}</p>
                <p class="text-gray-600 mb-2">Year: ${movie.Year}</p>
                <button class="bg-blue-500 text-white px-4 py-2 rounded-md" onclick="addToWatchLater('${movie.imdbID}')">Watch Later</button>
            `;
            moviesContainer.appendChild(movieCard);
        }
    }
}

displayRandomMovies();

searchInput.addEventListener('input', async function () {
    const query = searchInput.value.trim();
    if (query) {
        const movies = await searchMovies(query);
        displayMovies(movies);
    } else {
        moviesContainer.innerHTML = '';
    }
});

