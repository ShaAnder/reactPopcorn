import { useState } from "react";

/**
 * Box component
 * @param {*} params -> children props containing all the relevant children contained in that box
 * @returns a box component that holds all the relevent children, uses a simple piece of state to open and close the section
 * @author ShaAnder
 */
export function Box({ children }) {
  // state for toggling open and close of box
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
