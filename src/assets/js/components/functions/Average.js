/**
 * Averageing function
 * Simple function to average the array of numbers pushed into it
 * @param {*} params -> (arr) this is going to be an array of numbers, in this specific case the user and imdb scores that are averaged for the total averages of the movies
 * @returns the averaged number
 * @author ShaAnder
 */
export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
