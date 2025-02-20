import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import Start from "./Components/Start";
import Home from "./Components/Home";

function ProtectedRoute({ children }) {
  const hasData = localStorage.getItem("user"); // Change key as needed
  return hasData ? children : <Navigate to="/" />;
}

function App() {
  return (
    <div id="background">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/start"
            element={
              <ProtectedRoute>
                <Start />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

