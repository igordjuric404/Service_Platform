import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../../api/axios';
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import './ProvidersList.css';
import Pagination from '../../components/Pagination/Pagination';


function ProvidersList() {
  // **Input States**
  const [searchInput, setSearchInput] = useState('');
  const [minRatingInput, setMinRatingInput] = useState(0);
  const [minAppointmentsInput, setMinAppointmentsInput] = useState(0);
  const [sortOptionInput, setSortOptionInput] = useState('name-asc');

  // **Filters State**
  const [filters, setFilters] = useState({
    search: '',
    min_rating: 0,
    min_appointments: 0,
    sort: 'name-asc',
  });

  // **Providers Data**
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // **Pagination**
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProviders, setTotalProviders] = useState(0);

  // **Fetch Providers Based on Applied Filters**
  const fetchProviders = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        search: filters.search,
        min_rating: filters.min_rating,
        min_appointments: filters.min_appointments,
        sort: filters.sort,
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
  }, [filters, currentPage, perPage]);

  // **Effect to Fetch Providers When Filters Change**
  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  // **Handler to Apply Filters**
  const handleApplyFilters = () => {
    setFilters({
      search: searchInput,
      min_rating: minRatingInput,
      min_appointments: minAppointmentsInput,
      sort: sortOptionInput,
    });
    setCurrentPage(1); // Reset to first page when filters are applied
  };

  return (
    <div className="providers-list">
      <h1>Available Providers</h1>
      
      {/* **Filters Form** */}
      <form onSubmit={(e) => { e.preventDefault(); handleApplyFilters(); }}>
        <div className="filters-container">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search providers..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
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
                  value={minRatingInput}
                  onChange={(e) => setMinRatingInput(e.target.value)}
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
                  value={minAppointmentsInput}
                  onChange={(e) => setMinAppointmentsInput(e.target.value)}
                  className="filter-input"
                />
              </label>
            </div>
            
            <div className="filter-group">
              <label>
                Sort By:
                <select
                  value={sortOptionInput}
                  onChange={(e) => setSortOptionInput(e.target.value)}
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
            
            {/* **Apply Filters Button** */}
            <div className="filter-group apply-filters">
              <button type="submit" className="apply-filters-button">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </form>
      
      {/* **Loading, Error, and Providers List** */}
      {loading ? (
        <p>Loading providers...</p>
      ) : error ? (
        <p>{error}</p>
      ) : providers.length === 0 ? (
        <p>No providers found.</p>
      ) : (
        <>
          <ul className="provider-items">
            {providers.map(provider => {
              console.log(provider); // Debugging: Log each provider
              return (
                <li key={provider.id} className="provider-item">
                  <h2>
                    <Link to={`/provider/${provider.id}`}>{provider.name}</Link>
                    {provider.is_verified && (
                      <span className="verified-checkmark" title="Verified Provider"><RiVerifiedBadgeFill/></span>
                    )}
                  </h2>
                  <p><strong>Type:</strong> {provider.type}</p>
                  <p><strong>Email:</strong> {provider.email}</p>
                  <p><strong>Rating:</strong> {provider.average_rating !== 'N/A' ? Number(provider.average_rating).toFixed(2) : 'No rating'}</p>
                  <p><strong>Total Appointments:</strong> {provider.total_appointments}</p>
                </li>
              );
            })}
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
