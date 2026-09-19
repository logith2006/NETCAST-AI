import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import Purpose from './pages/Purpose';
import Setup from './pages/Setup';
import Dashboard from './pages/Dashboard';
import SpeedTest from './pages/SpeedTest';
import Devices from './pages/Devices';
import Latency from './pages/Latency';
import Diagnostics from './pages/Diagnostics';
import Documentation from './pages/Documentation';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading NetCast AI...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/welcome" /> : <Login />} />
        <Route path="/welcome" element={user ? <Welcome /> : <Navigate to="/login" />} />
        <Route path="/purpose" element={user ? <Purpose /> : <Navigate to="/login" />} />
        <Route path="/setup" element={user ? <Setup /> : <Navigate to="/login" />} />
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/speedtest" element={user ? <SpeedTest /> : <Navigate to="/login" />} />
        <Route path="/devices" element={user ? <Devices /> : <Navigate to="/login" />} />
        <Route path="/latency" element={user ? <Latency /> : <Navigate to="/login" />} />
        <Route path="/diagnostics" element={user ? <Diagnostics /> : <Navigate to="/login" />} />
        <Route path="/docs" element={user ? <Documentation /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
