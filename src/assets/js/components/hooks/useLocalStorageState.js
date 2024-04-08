import { useEffect, useState } from "react";

/**
 * useLocal storage hook for saving and loading to the local storage
 * @param {*} params -> (initialstate, key) -> takes the initial state argument ("") and our key which is whatever the state is saved under
 * @returns the value currently in local storage as well as the setter to set new local storage data
 * @author ShaAnder
 */
export function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
