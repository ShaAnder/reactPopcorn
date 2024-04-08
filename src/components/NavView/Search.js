import { useEffect, useRef } from "react";

/**
 * Search results component for nav bar
 * Detailed component that shows all the movie information
 * @param {*} params -> children props (query, setquery (state and setter)) our query state that we get from the value of the input
 * @returns the jsx that shows the input bar, and has an on change handler to grab the value inputted into the search bar
 * @author ShaAnder
 */
export function Search({ query, setQuery, onCloseMovie, selectedId }) {
  const inputEl = useRef(null);

  useEffect(
    function () {
      // we want to stick our ref usage into a callback function for cleaning later

      function callback(e) {
        // we also need to make sure that hitting enter does not search when clearing fields
        if (document.activeElement === inputEl.current) return;

        // check if it's actually the enter key
        if (e.code === "Enter") {
          inputEl.current.focus();
          // now we want to clear fields and close the windows when it's not focus
          setQuery("");
          // finally closing the selected movie too in case one is open
          onCloseMovie(selectedId);
        }
      }

      // now let's add a new feature in the form of using a keypress to select the input field whenever it's pressed (no refresh needed)

      document.addEventListener("keydown", callback);
      return () => document.addEventListener("keydown", callback);

      // finally set our dependency
    },
    [setQuery, onCloseMovie, selectedId]
  );

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
