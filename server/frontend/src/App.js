import React from "react";
import LoginPanel from "./components/Login/Login";
import Register from "./components/Register/Register";
import { Routes, Route } from "react-router-dom";
import Dealers from './components/Dealers/Dealers';
import DealerDetails from './components/DealerDetails/DealerDetails';
import ReviewSubmission from './components/ReviewSubmission/ReviewSubmission';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPanel />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dealers" element={<Dealers/>} />
      <Route path="/dealer/:id" element={<DealerDetails />} />
      <Route path="/postreview/:id" element={<ReviewSubmission />} />
    </Routes>
  );
}

export default App;
