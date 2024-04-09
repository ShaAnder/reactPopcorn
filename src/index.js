import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/index.css";
import Appv1 from "./App.js";
// import StarRating from "./StarRating";

// function Test() {
//   const [movieRating, setMovieRating] = useState(0);

//   return (
//     <div>
//       <StarRating color="blue" maxRating={10} onSetRating={setMovieRating} />

//       <p>This movie was rated {movieRating} stars</p>
//     </div>
//   );
// }

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <StarRating maxRating={10} className="test" defaultRating={1} />
    <Test /> */}
    <Appv1 />
  </React.StrictMode>
);
