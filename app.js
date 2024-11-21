const apiKey = '7a54111a';
let currentPage = 1;
let searchTerm = '';

const searchInput = document.getElementById('searchInput');
const moviesContainer = document.getElementById('moviesContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let debounceTimeout;

// Debounce function
const debounce = (func, delay) => {
  return (...args) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => func(...args), delay);
  };
};

// Fetch movie data
const fetchMovies = async () => {
  if (!searchTerm.trim()) return;

  loadingSpinner.classList.remove('hidden');
  moviesContainer.innerHTML = '';

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}&page=${currentPage}`
    );
    const data = await response.json();
    loadingSpinner.classList.add('hidden');

    if (data.Response === 'True') {
      renderMovies(data.Search);
      nextBtn.disabled = currentPage >= Math.ceil(data.totalResults / 10);
      prevBtn.disabled = currentPage === 1;
    } else {
      moviesContainer.innerHTML = `<p class="text-center text-red-500">${data.Error}</p>`;
    }
  } catch (error) {
    loadingSpinner.classList.add('hidden');
    moviesContainer.innerHTML = `<p class="text-center text-red-500">An error occurred. Please try again later.</p>`;
  }
};

// Render movies
const renderMovies = (movies) => {
  moviesContainer.innerHTML = movies
    .map(
      (movie) => `
      <div class="bg-white rounded shadow p-4">
        <img src="${movie.Poster}" alt="${movie.Title}" class="w-full h-48 object-cover rounded">
        <h3 class="text-lg font-bold mt-2">${movie.Title}</h3>
        <p>${movie.Year}</p>
      </div>`
    )
    .join('');
};

// Event listeners
searchInput.addEventListener(
  'input',
  debounce((e) => {
    searchTerm = e.target.value;
    currentPage = 1;
    fetchMovies();
  }, 100)
);

prevBtn.addEventListener('click', () => {
  currentPage--;
  fetchMovies();
});

nextBtn.addEventListener('click', () => {
  currentPage++;
  fetchMovies();
});
