import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../../api/axios';
import { Link } from 'react-router-dom';
import './ProvidersList.css';

function ProvidersList() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [minAppointments, setMinAppointments] = useState(0);
  const [sortOption, setSortOption] = useState('name-asc');

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await axiosInstance.get('/providers');
      setProviders(response.data);
      setFilteredProviders(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load providers.');
      setLoading(false);
    }
  };

  const applyFiltersAndSorting = useCallback(() => {
    let filtered = [...providers];

    if (searchTerm) {
      filtered = filtered.filter(provider =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (minRating > 0) {
      filtered = filtered.filter(provider => provider.average_rating >= minRating);
    }

    if (minAppointments > 0) {
      filtered = filtered.filter(provider => provider.total_appointments >= minAppointments);
    }

    switch (sortOption) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating-asc':
        filtered.sort((a, b) => a.average_rating - b.average_rating);
        break;
      case 'rating-desc':
        filtered.sort((a, b) => b.average_rating - a.average_rating);
        break;
      case 'appointments-asc':
        filtered.sort((a, b) => a.total_appointments - b.total_appointments);
        break;
      case 'appointments-desc':
        filtered.sort((a, b) => b.total_appointments - a.total_appointments);
        break;
      default:
        break;
    }

    setFilteredProviders(filtered);
  }, [providers, searchTerm, minRating, minAppointments, sortOption]);

  useEffect(() => {
    applyFiltersAndSorting();
  }, [applyFiltersAndSorting]);

  if (loading) {
    return <div className="providers-list"><p>Loading providers...</p></div>;
  }

  if (error) {
    return <div className="providers-list"><p>{error}</p></div>;
  }

  return (
    <div className="providers-list">
      <h1>Available Providers</h1>
      <div className="filters-container">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search providers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
        </div>
        <div className="advanced-filters">
          <div className="filter-group">
            <label>
              Min Rating:
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={minRating}
                onChange={(e) => setMinRating(+e.target.value)}
                className="filter-input"
              />
            </label>
          </div>
          <div className="filter-group">
            <label>
              Min Appointments:
              <input
                type="number"
                min="0"
                value={minAppointments}
                onChange={(e) => setMinAppointments(+e.target.value)}
                className="filter-input"
              />
            </label>
          </div>
          <div className="filter-group">
            <label>
              Sort By:
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="filter-select"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="rating-asc">Rating (Low to High)</option>
                <option value="rating-desc">Rating (High to Low)</option>
                <option value="appointments-asc">Appointments (Low to High)</option>
                <option value="appointments-desc">Appointments (High to Low)</option>
              </select>
            </label>
          </div>
        </div>
      </div>
      {filteredProviders.length === 0 ? (
        <p>No providers found.</p>
      ) : (
        <ul className="provider-items">
          {filteredProviders.map(provider => (
            <li key={provider.id} className="provider-item">
              <h2><Link to={`/provider/${provider.id}`}>{provider.name}</Link></h2>
              <p><strong>Type:</strong> {provider.type}</p>
              <p><strong>Email:</strong> {provider.email}</p>
              <p><strong>Rating:</strong> {provider.average_rating ? Number(provider.average_rating).toFixed(2) : 'N/A'}</p>
              <p><strong>Total Appointments:</strong> {provider.total_appointments}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProvidersList;
