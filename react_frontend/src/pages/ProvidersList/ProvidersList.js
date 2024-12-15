import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axios';
import { Link } from 'react-router-dom';
import './ProvidersList.css';

function ProvidersList() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProviders, setFilteredProviders] = useState([]);

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, providers]);

  const fetchProviders = async () => {
    try {
      const response = await axiosInstance.get('/providers');
      setProviders(response.data);
      setFilteredProviders(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching providers:', err);
      setError('Failed to load providers.');
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm === '') {
      setFilteredProviders(providers);
    } else {
      const filtered = providers.filter(provider =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProviders(filtered);
    }
  };

  if (loading) {
    return <div className="providers-list"><p>Loading providers...</p></div>;
  }

  if (error) {
    return <div className="providers-list"><p>{error}</p></div>;
  }

  return (
    <div className="providers-list">
      <h1>Available Providers</h1>
      <input
        type="text"
        placeholder="Search providers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />
      {filteredProviders.length === 0 ? (
        <p>No providers found.</p>
      ) : (
        <ul className="provider-items">
          {filteredProviders.map(provider => (
            <li key={provider.id} className="provider-item">
              <h2><Link to={`/provider/${provider.id}`}>{provider.name}</Link></h2>
              <p><strong>Type:</strong> {provider.type}</p>
              <p><strong>Email:</strong> {provider.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProvidersList;
