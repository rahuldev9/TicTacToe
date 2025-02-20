import React from "react";
import { BrowserRouter, Routes, Route} from 'react-router-dom';

import './App.css';
import Start from "./Components/Start";
import Home from "./Components/Home";

function App() {
  
  return (
    <>
    <div id='background'>
      <BrowserRouter>
      <Routes>
      <Route path="/" element={<Home/>}></Route>
        <Route path="/start" element={<Start/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
    </>
  );
}

export default App;
