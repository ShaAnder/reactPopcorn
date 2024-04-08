//------- IMPORTS -------//

import { useState } from "react";

import { useMovies } from "./components/Utils/hooks/useMovies";
import { useLocalStorageState } from "./components/Utils/hooks/useLocalStorageState";

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

export default function App() {
  //------- STATE -------//
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  //------- CUSTOM HOOKS -------//

  // destructure our custom hook returns back to their own data here
  const { movies, isLoading, error } = useMovies(
    query,
    handleCloseSelectedMovie
  );

  const [watched, setWatched] = useLocalStorageState([], "watched");

  //------- HANDLERS -------//[]

  // handler for selecting the movies
  function handleMovieSelection(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseSelectedMovie() {
    setSelectedId(null);
  }

  // Handles adding a new movie
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  // Handles deleting a movie
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      {/* Prop drilling solved thanks to composition below */}
      <NavBar>
        <Logo />
        <Search
          query={query}
          setQuery={setQuery}
          onCloseMovie={handleCloseSelectedMovie}
          selectedId={selectedId}
        />
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
