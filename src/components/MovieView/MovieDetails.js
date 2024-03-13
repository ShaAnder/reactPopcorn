import { useEffect, useState } from "react";
import StarRating from "../Utils/components/StarRating";
import { Key } from "../../App";
import { Loader } from "../Utils/components/Loader";

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
}) {
  // State for the movie details and setting our star rating
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState("");

  // Derived state to check what movies we have watched, to accomplish this we map over the watched movies array and get the movie id that matches. This enables us to run a check later
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

  // Now to derive the rating, to do this we map over the watched array and get the movies userrating and store this in an array.
  const watchedUserRating = watched.map((movie) => movie.userRating);

  // Here we destructure the date of the movie object so we can clean up the title and better read our data
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
    };

    // now that we have added our movie, we want to add it to our watched array and close the movie screen
    onAddWatched(newWatchedMovie);
    onCloseMovie(selectedId);
  }

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
    [selectedId]
  );

  // our jsx for the movie, this is our entire string of jsx used to create the detailed movie view when we click on the movie
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
