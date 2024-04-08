//------- IMPORTS -------//

import { useState } from "react";

import { useMovies } from "./assets/js/components/hooks/useMovies";
import { useLocalStorageState } from "./assets/js/components/hooks/useLocalStorageState";

// Watched View Imports
import { WatchedSummary } from "./assets/js/views/WatchedView/WatchedSummary";
import { WatchedMovieList } from "./assets/js/views/WatchedView/WatchedMovieList";

// Movie View Imports
import { MovieDetails } from "./assets/js/views/MovieView/MovieDetails";
import { MovieList } from "./assets/js/views/MovieView/MovieList";

// Container Imports
import { Box } from "./assets/js/components/utils/Box";
import { Main } from "./assets/js/components/utils/Main";

//NAVbar imports
import { NumResults } from "./assets/js/views/NavView/NumResults";
import { Search } from "./assets/js/views/NavView/Search";
import { Logo } from "./assets/js/views/NavView/Logo";
import { NavBar } from "./assets/js/views/NavView/NavBar";

// Helper Imports
import { ErrorMessage } from "./assets/js/components/utils/ErrorMessage";
import { Loader } from "./assets/js/components/utils/Loader";

export default function App() {
  //------- STATE -------//
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  //------- CUSTOM HOOKS -------//

  // destructure our custom hook returns back to their own data here
  const { movies, isLoading, error, Key } = useMovies(
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
              Key={Key}
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
