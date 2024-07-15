// src/App.js
import React, { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import "./index.css";
import { AppProvider } from "./context/Context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const App = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <div className="app">
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sidebar" element={<Sidebar />} />
            </Routes>
          </Router>
        </div>
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;
