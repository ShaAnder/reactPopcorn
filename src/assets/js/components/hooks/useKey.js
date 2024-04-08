import { useEffect } from "react";

/**
 * useKey Hook, small reusable hook to add event listeners to the document without mutating or interacting with the DOM
 * @param {*} params -> (key, action) key pressed down string as well as the callback function we're going to execute
 * @returns nothing
 * @author ShaAnder
 */
export function useKey(key, action) {
  useEffect(
    function () {
      function callback(e) {
        if (e.code.toLowerCase() === key.toLowerCase()) {
          action();
        }
      }

      document.addEventListener("keydown", callback);

      return function () {
        document.removeEventListener("keydown", callback);
      };
    },

    [action, key]
  );
}
