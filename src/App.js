import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MyAppBar from './components/AppBar';
import SessionLauncher from './components/SessionLauncher';
import StudentSession from './components/StudentSession'; // Correct import
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <MyAppBar />
        <div className="content">
          <Routes>
            <Route path="/" element={<SessionLauncher />} />
            <Route path="/session/:section" element={<StudentSession />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
