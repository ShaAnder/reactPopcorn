// Importing our movie component
import { Movie } from "./Movie";

/**
 * Movie List component
 * Detailed component that shows all the movie information
 * @param {*} params -> children props (movies) / onMovieSelection handler for handling the selected movie
 * @returns the jsx that models the list of movies
 * @author ShaAnder
 */
export function MovieList({ movies, onMovieSelection }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          onMovieSelection={onMovieSelection}
        />
      ))}
    </ul>
  );
}
