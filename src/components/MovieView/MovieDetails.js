import { useEffect, useRef, useState } from "react";
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

  // aside from dom element saving we as stated before can use refs to save data and timeouts. SO what if we wanted to store data on how many times a user clicked on the rating (indicating potential indecisiveness when giving said rating)

  // well we use a ref, this way we can save the info into the state of the object WITHOUT causing a rerender, because it does not get rendered to the screen
  const countRef = useRef(0);

  // then we use an effect to mutate the ref, because it's disallowed in render logic

  useEffect(
    function () {
      // check if there is a user rating, if not count ref
      if (userRating) {
        countRef.current = countRef.current++;
      }
    },
    [userRating]
  );

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
      // now we add the ref here for tracking the number of reratings the user provided
      countRatingDecisions: countRef.current,
    };

    // now that we have added our movie, we want to add it to our watched array and close the movie screen
    onAddWatched(newWatchedMovie);
    onCloseMovie(selectedId);
  }

  // a common thing in apps is to allow select key presses to close modals / popups, we want to use the escape key to close the movie details. This is interacting with the dom and is thus a side effect so time for another effect (because we are using dom manipulation this is working oustide of react and it's why the useEffect hook actually is called an escape hatch so to speak)
  useEffect(
    function () {
      // So we firstly want this inside the movie details component as we don't want it to trigger all the time, rather just when a movie is open

      // now we need to create an actual function for the event listener to execute, we need to create the function here because it needs to be THE EXACT SAME function for addition and removal later. Cannot copy code
      function escape(e) {
        if (e.code === "Escape") {
          onCloseMovie();
        }
      }
      // now we do add a dom event listener, and pass in our escape function
      document.addEventListener("keydown", escape);

      // and of course we need to cleanup our effect because everytime this effect runs it adds an event listener we need to remove those event listeners when we are done with them
      return function () {
        document.removeEventListener("keydown", escape);
      };
    },
    // finally for our dependancy array, our onCloseMovie is needed in the dependancy array as react does not know onCloseMovie so we need it here to prevent unforseen errors
    [onCloseMovie]
  );

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

  // we should always use deff effects for different (singular) things never try and do a lot of things with one effect. For this we set the  document title to the movie title when a movie is selected, and it should run whenever a new title is selected.
  useEffect(
    function () {
      // we also want to have a guard clause in case the movie can't be found
      if (!title) return;
      document.title = `Movie: ${title}`;
      // now we want to cleanup the effect by returning it to the vanilla title we do this with a returnd arrow func (a cleaup function is a returned function from an effect)
      return () => {
        document.title = "Use Popcorn";
      };
    },
    // We don't want to use selectedID as the thing it should watch because of the issue with stale state it's going to get the id -> rerender -> then the title will be gotten. This means that it will show undefined until we click on a second option. We use title so the moment a title is found it selects that.
    [title]
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
