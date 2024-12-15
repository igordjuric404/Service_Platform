import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axios'; // Use the configured axiosInstance
import { Link } from 'react-router-dom';
import './ServicesList.css';

function ServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, services]);

  const fetchServices = async () => {
    try {
      // Fetch services using axiosInstance
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

  const handleSearch = () => {
    if (searchTerm === '') {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.provider.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  };

  if (loading) {
    return <div className="services-list"><p>Loading services...</p></div>;
  }

  if (error) {
    return <div className="services-list"><p>{error}</p></div>;
  }

  return (
    <div className="services-list">
      <h1>Available Services</h1>
      <input
        type="text"
        placeholder="Search services..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />
      {filteredServices.length === 0 ? (
        <p>No services found.</p>
      ) : (
        <ul className="service-items">
          {filteredServices.map(service => (
            <li key={service.id} className="service-item">
              <h2><Link to={`/service/${service.id}`}>{service.title}</Link></h2>
              <p>{service.description}</p>
              <p><strong>Price:</strong> ${service.price}</p>
              <p><strong>Provider:</strong> {service.provider.name}</p>
              {/* Add more details or actions */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ServicesList;
