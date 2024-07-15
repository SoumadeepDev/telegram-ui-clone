// src/components/Sidebar.js
import React, { useContext, useRef } from "react";
import { ThemeContext } from "../context/ThemeContext";
import useClickOutside from "../hooks/useClickOutside";

const Sidebar = ({ showSidebar, setShowSidebar }) => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const sidebarRef = useRef();

  useClickOutside(sidebarRef, () => setShowSidebar(false));

  return (
    <div
      ref={sidebarRef}
      className={`sidebar ${showSidebar ? "active" : ""} ${
        darkMode ? "dark" : ""
      }`}
    >
      <button onClick={toggleDarkMode}>Toggle Dark Mode</button>
      {/* Additional Sidebar content */}
    </div>
  );
};

export default Sidebar;
