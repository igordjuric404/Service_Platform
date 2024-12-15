import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from '../components/Header/Header'; 
import HomePage from '../pages/HomePage/HomePage';
import Register from '../pages/Register/Register';
import Login from '../pages/Login/Login'; 
import ServicesList from '../pages/ServicesList/ServicesList';

function AppRoutes() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesList />} /> 
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;