/**
 * Movie Component
 * @param {*} params -> children props (movie) / onmovieselection handler for when we select a movie
 * @returns the movie title year and poster to be modelled into the movie box / view
 * @author ShaAnder
 */
export function Movie({ movie, onMovieSelection }) {
  return (
    <li
      className="hover-pointer"
      onClick={() => onMovieSelection(movie.imdbID)}
    >
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
