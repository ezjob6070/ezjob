
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import Schedule from './pages/Schedule';
import Clients from './pages/Clients';
import Technicians from './pages/Technicians';
import Projects from './pages/projects/Projects';
import { Toaster } from "sonner";
import { GlobalStateProvider } from './components/providers/GlobalStateProvider';

function App() {
  return (
    <Router>
      <GlobalStateProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/calendar" element={<Schedule />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/technicians" element={<Technicians />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
        <Toaster />
      </GlobalStateProvider>
    </Router>
  );
}

export default App;
