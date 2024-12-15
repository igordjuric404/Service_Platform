import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "../components/Header/Header";
import HomePage from "../pages/HomePage/HomePage";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import ServicesList from "../pages/ServicesList/ServicesList";
import ServiceDetails from "../pages/ServiceDetails/ServiceDetails";
import ProvidersList from '../pages/ProvidersList/ProvidersList';
import ProviderDetails from '../pages/ProviderDetails/ProviderDetails';

function AppRoutes() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/services" element={<ServicesList />} />
                <Route path="/service/:id" element={<ServiceDetails />} />
                <Route path="/providers" element={<ProvidersList />} />
                <Route path="/provider/:id" element={<ProviderDetails />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;
