import { useEffect, useRef, useState } from "react";
import StarRating from "../../components/utils/StarRating";

import { Loader } from "../../components/utils/Loader";
import { useKey } from "../../components/hooks/useKey";

/**
 * Movie Details component
 * Detailed component that shows all the movie information
 * @param {*} params -> children props (selectedId isLoading watched (state)) / OnCloseMovie and onAddWatched handlers for handling the movie close and adding to the watched list
 * @returns the jsx that shows the movie details, rating and ability to add movie to the watched list
 * @author ShaAnder
 */
export function MovieDetails({
  selectedId,
  onCloseMovie,
  isLoading,
  onAddWatched,
  watched,
  Key,
}) {
  // State for movie details and star rating
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState("");

  // Count Ref for checking user rating changes
  const countRef = useRef(0);

  // Effect to mutate the ref, to keep it out of renderlogic
  useEffect(
    function () {
      // check if there is a user rating, if not count ref
      if (userRating) {
        countRef.current = countRef.current++;
      }
    },
    [userRating]
  );

  // Derived state to check what movies we have watched, map over the watched movies array and get the movie id that matches.
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

  // Derive the rating, map over the watched array and get the movies userrating and store this in an array.
  const watchedUserRating = watched.map((movie) => movie.userRating);

  // Destructure the data of the movie object so we can clean up the title and better read our data
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  /**
   * AddMovie Handler function
   * On click function for adding moview to our watched list, takes the selected movie (which we have from clicking on the movie) then strips the relevant information we want and creates a new movie object with it
   * No return
   * @author ShaAnder
   */
  function handleAddMovie() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      // Ref here for keeping track of count
      countRatingDecisions: countRef.current,
    };

    // Add it to watched array and close the movie
    onAddWatched(newWatchedMovie);
    onCloseMovie(selectedId);
  }

  // Use key hook for escape command
  useKey("Escape", onCloseMovie);

  // Use effect hook to get our movie details
  useEffect(
    function () {
      // async function for our fetching
      async function getMovieDetails() {
        const res = await fetch(
          // the open movie db api
          `http://www.omdbapi.com/?apikey=${Key}&i=${selectedId}`
        );
        // turn it into a json
        const data = await res.json();
        // set iyr nivue
        setMovie(data);
      }
      // get the movie details
      getMovieDetails();
    },
    // we want this to run only when it has a relevant id
    [selectedId, Key]
  );

  // Use effect to set title to current movie
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie: ${title}`;
      // Clean up the effect / reset title
      return () => {
        document.title = "Use Popcorn";
      };
    },
    // Use title in dependency array as selected ID is stale state
    [title]
  );

  // our jsx for the movie
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAddMovie}>
                      Add To Watched
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You Have Already Rated This Movie with {watchedUserRating}
                  <span>⭐</span>
                </p>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring: {actors}</p>
            <p>Directed By: {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
