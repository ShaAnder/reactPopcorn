/**
 * Search results component for nav bar
 * Detailed component that shows all the movie information
 * @param {*} params -> children props (query, setquery (state and setter)) our query state that we get from the value of the input
 * @returns the jsx that shows the input bar, and has an on change handler to grab the value inputted into the search bar
 * @author ShaAnder
 */
export function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
