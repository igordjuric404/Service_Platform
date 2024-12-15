import React, { useEffect } from 'react';
import { setAuthToken } from './api/axios';
import './App.css';
import AppRoutes from './routes/AppRoutes'; 

function App() {

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;
