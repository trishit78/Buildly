import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import GenerationPage from './components/GenerationPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/generate" element={<GenerationPage />} />
        
      </Routes>
    </Router>
  );
}

export default App;