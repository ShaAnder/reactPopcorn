/**
 * Error message function
 * @param {*} params -> message to be passed in as an error
 * @returns the styled error message
 * @author ShaAnder
 */
export function ErrorMessage({ message }) {
  return <p className="error">{message}</p>;
}
