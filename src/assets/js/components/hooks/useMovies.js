import { useEffect, useState } from "react";

/**
 * useMovies Hook for finding the movie data
 * @param {*} params -> (query, callback) -> takes the query (our movie selection) and the callback(our function as arguments)
 * @returns the movie, isLoading, error state and the Key variable for use throughout the codebase
 * @author ShaAnder
 */
export function useMovies(query, callback) {
  // searched movies state
  const [movies, setMovies] = useState([]);
  // loading state for our loading message
  const [isLoading, setIsLoading] = useState(false);
  // state for showing if we have an error
  const [error, setError] = useState("");

  // key stays in here because it's coupled with the hook
  const Key = "4b956081";

  // Fetch our API data for the movies
  useEffect(
    function () {
      // any callback functions exectured here, we shall optional chain incase it does not exist
      callback?.();

      // using abort controller to clean up data fetching
      const controller = new AbortController();

      async function fetchMovies() {
        // create a loading state
        try {
          // set loading state
          setIsLoading(true);
          setError("");
          // get our data
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${Key}&s=${query}`,
            // Connect abort conroller
            { signal: controller.signal }
          );
          // error handling, if no response, throw an error
          if (!res.ok) throw new Error("Movie Fetching Failed");
          // save our response
          const data = await res.json();
          if (data.response === "False") throw new Error("Movie Not Found");
          // set our movie state
          setMovies(data.Search);
          // set error to empty initially (cos no error)
          setError("");
        } catch (err) {
          // display error / exclude abort error
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          // log the data search for movies
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      // fetch our movies
      fetchMovies();
      // return controller here
      return function () {
        controller.abort();
      };
    },
    // the effect is triggered when query is populated
    [query]
  );
  // now we return these state pieces
  return { movies, isLoading, error, Key };
}
