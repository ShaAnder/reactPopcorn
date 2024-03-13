import { WatchedMovie } from "./WatchedMovie";

/**
 * Watched list component
 * @param {*} params -> our watched movies and the delete watched movie handler to remove from the list
 * @returns the jsx list showing all the movies watched, we map over the watched array to get the movie list
 * @author ShaAnder
 */
export function WatchedMovieList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}
