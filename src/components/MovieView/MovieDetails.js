import { useEffect, useState } from "react";
import StarRating from "../Utils/StarRating";
import { Key } from "../../App";
import { Loader } from "../Utils/Loader";

export function MovieDetails({
  selectedId,
  onCloseMovie,
  isLoading,
  onAddWatched,
  watched,
}) {
  // some state for the movie details
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState("");

  // we want to make some derived state to do a check on which movies have been watched. To accomplish this we will map over the watched movies, then just take the imdbDB entry and add it to a new array, we can now compare and hide the rating / add buttons based on if the imdb entry is in the array
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

  // now we want to derive the rating for a specific movie
  const watchedUserRating = watched.map((movie) => movie.userRating);

  // now we destructure the data out of the movie object, it will initially render as undefined until effect kicks in and sets the movie object (inital render bs)
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

    onAddWatched(newWatchedMovie);
    onCloseMovie(selectedId);
  }

  // we want to create a function to get the details whenever the movie details load, so an effect is required
  useEffect(
    function () {
      async function getMovieDetails() {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${Key}&i=${selectedId}`
        );
        const data = await res.json();

        setMovie(data);
      }
      getMovieDetails();
    },
    [selectedId]
  );

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
