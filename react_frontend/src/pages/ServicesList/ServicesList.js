import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../../api/axios';
import { Link } from 'react-router-dom';
import './ServicesList.css';

function ServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]); 
  const [sortOption, setSortOption] = useState('title-asc'); 

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axiosInstance.get('/services');
      setServices(response.data);
      setFilteredServices(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services.');
      setLoading(false);
    }
  };

  const applyFiltersAndSorting = useCallback(() => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.provider.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered = filtered.filter(
      service => service.price >= priceRange[0] && service.price <= priceRange[1]
    );

    if (sortOption === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'title-asc') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'title-desc') {
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    }

    setFilteredServices(filtered);
  }, [services, searchTerm, priceRange, sortOption]);

  useEffect(() => {
    applyFiltersAndSorting();
  }, [applyFiltersAndSorting]);

  if (loading) {
    return <div className="services-list"><p>Loading services...</p></div>;
  }

  if (error) {
    return <div className="services-list"><p>{error}</p></div>;
  }

  return (
    <div className="services-list">
      <h1>Available Services</h1>

      <div className="filters-row">
        <input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <label>
          Min Price:
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
          />
        </label>
        <label>
          Max Price:
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
          />
        </label>
        <label>
          Sort By:
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </label>
      </div>

      {filteredServices.length === 0 ? (
        <p>No services found.</p>
      ) : (
        <ul className="service-items">
          {filteredServices.map(service => (
            <li key={service.id} className="service-item">
              <h2><Link to={`/service/${service.id}`}>{service.title}</Link></h2>
              <p>{service.description}</p>
              <p><strong>Price:</strong> ${service.price}</p>
              <p><strong>Provider:</strong> <Link to={`/provider/${service.provider.id}`}>{service.provider.name}</Link></p>
              </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ServicesList;
