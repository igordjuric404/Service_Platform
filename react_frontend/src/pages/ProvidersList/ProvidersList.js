import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../../api/axios';
import { Link } from 'react-router-dom';
import './ProvidersList.css';
import Pagination from '../../components/Pagination/Pagination';

function ProvidersList() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters and Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [minAppointments, setMinAppointments] = useState(0);
  const [sortOption, setSortOption] = useState('name-asc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProviders, setTotalProviders] = useState(0);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        search: searchTerm,
        min_rating: minRating,
        min_appointments: minAppointments,
        sort: sortOption,
        page: currentPage,
        per_page: perPage,
      };

      const response = await axiosInstance.get('/providers', { params });
      console.log('Fetching providers with params:', params);

      setProviders(response.data.data);
      setCurrentPage(response.data.current_page);
      setTotalPages(response.data.last_page);
      setTotalProviders(response.data.total);
      setLoading(false);
    } catch (err) {
      setError('Failed to load providers.');
      setLoading(false);
    }
  }, [searchTerm, minRating, minAppointments, sortOption, currentPage, perPage]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  useEffect(() => {
    setCurrentPage(1);
    
  }, [searchTerm, minRating, minAppointments, sortOption]);

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
                onChange={(e) => setMinRating(e.target.value)}
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
                onChange={(e) => setMinAppointments(e.target.value)}
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
      {providers.length === 0 ? (
        <p>No providers found.</p>
      ) : (
        <>
          <ul className="provider-items">
            {providers.map(provider => (
              <li key={provider.id} className="provider-item">
                <h2><Link to={`/provider/${provider.id}`}>{provider.name}</Link></h2>
                <p><strong>Type:</strong> {provider.type}</p>
                <p><strong>Email:</strong> {provider.email}</p>
                <p><strong>Rating:</strong> {provider.average_rating !== 'N/A' ? Number(provider.average_rating).toFixed(2) : 'N/A'}</p>
                <p><strong>Total Appointments:</strong> {provider.total_appointments}</p>
              </li>
            ))}
          </ul>
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
          <p>Total Providers: {totalProviders}</p>
        </>
      )}
    </div>
  );
}

export default ProvidersList;
