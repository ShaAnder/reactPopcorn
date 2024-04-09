/**
 * Nav bar component
 * Detailed component that shows all the movie information
 * @param {*} params -> children props (all the components that make up the navbar)
 * @returns the jsx that shows the nav bar, this includes the results, search and logo
 * @author ShaAnder
 */
export function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}
