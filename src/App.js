import { useEffect, useState } from "react";

// Watched View Imports
import { WatchedSummary } from "./components/WatchedView/WatchedSummary";
import { WatchedMovieList } from "./components/WatchedView/WatchedMovieList";

// Movie View Imports
import { MovieDetails } from "./components/MovieView/MovieDetails";
import { MovieList } from "./components/MovieView/MovieList";

// Container Imports
import { Box } from "./components/Utils/components/Box";
import { Main } from "./components/Utils/components/Main";

//NAVbar imports
import { NumResults } from "./components/NavView/NumResults";
import { Search } from "./components/NavView/Search";
import { Logo } from "./components/NavView/Logo";
import { NavBar } from "./components/NavView/NavBar";

// Helper Imports
import { ErrorMessage } from "./components/Utils/components/ErrorMessage";
import { Loader } from "./components/Utils/components/Loader";

// we want to keep this out of the render logic or it will be rerendered everytime the component is, we don't need or want this
// so outside it stays
export const Key = "4b956081";

export default function App() {
  // query state
  const [query, setQuery] = useState("");
  // searched movies state
  const [movies, setMovies] = useState([]);
  // watched movies state
  const [watched, setWatched] = useState([]);
  // loading state for our loading message
  const [isLoading, setIsLoading] = useState(false);
  // state for showing if we have an error
  const [error, setError] = useState("");
  // setting our selected movie, we only want to save the id
  // instead of the full object
  const [selectedId, setSelectedId] = useState(null);

  // handler for selecting the movies
  function handleMovieSelection(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseSelectedMovie() {
    setSelectedId(null);
  }

  // we're creating a new array of watched movies, by setting the state. In this state setting we spread the watched movies array and append the new movie to the end
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  // Now we want a function to handle deleting watched movies, this will filter the movie list and return all entries that are not our movie as a new list. Then set it as our watched list.
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  // we want to fetch our api data and while we can use promises we're going to use good old async functions we also need to note that we need to put the async function inside a new function to prevent race conditions
  useEffect(
    function () {
      async function fetchMovies() {
        // create a loading state
        try {
          // set loading state
          setIsLoading(true);
          setError("");
          // get our data
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${Key}&s=${query}`
          );
          // error handling, if no response, throw an error
          if (!res.ok) throw new Error("Movie Fetching Failed");
          // save our response
          const data = await res.json();
          if (data.response === "False") throw new Error("Movie Not Found");
          // set our movie state
          setMovies(data.Search);
        } catch (err) {
          // display error
          setError(err.message);
        } finally {
          // we need to log the data search for movies, can't use the movies state or else stale
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
    },
    // the effect is triggered when query is populated
    [query]
  );

  // this is actually the correct albeit barebones way to fetch data esp on mount, in larger apps we will use ext libraries
  // but that's a larger application

  return (
    <>
      {/* Prop drilling solved thanks to composition below */}
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              onMovieSelection={handleMovieSelection}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseSelectedMovie}
              isLoading={isLoading}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
