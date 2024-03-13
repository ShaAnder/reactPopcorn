/**
 * Num results component for the nav bar
 * @param {*} params -> children props (our movies)
 * @returns the jsx that displays the number of movies, just gets the length of the movie results and models it as a number to view
 * @author ShaAnder
 */
export function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong> results
    </p>
  );
}
