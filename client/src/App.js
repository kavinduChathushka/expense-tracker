import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Upload from './components/Upload';
import CategoryView from './components/CategoryView';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/dashboard/:category" element={<CategoryView />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
