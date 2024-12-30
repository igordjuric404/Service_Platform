import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axiosInstance from '../../api/axios';
import { Link } from 'react-router-dom';
import './ServicesList.css';
import Pagination from '../../components/Pagination/Pagination';
import debounce from 'lodash/debounce';

function ServicesList() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortOption, setSortOption] = useState('title-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 9;
  const totalPages = useMemo(() => Math.ceil(filteredServices.length / perPage), [filteredServices, perPage]);

  const fetchServices = async () => {
    try {
      const response = await axiosInstance.get('/services');
      setServices(response.data);
      setFilteredServices(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load services.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const applyFiltersAndSorting = useCallback(() => {
    let filtered = [...services];
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.provider && service.provider.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    filtered = filtered.filter(
      service => service.price >= priceRange[0] && service.price <= priceRange[1]
    );
    switch (sortOption) {
      case 'title-asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    setFilteredServices(filtered);
    setCurrentPage(1);
  }, [services, searchTerm, priceRange, sortOption]);

  const debouncedApplyFiltersAndSorting = useMemo(() => debounce(applyFiltersAndSorting, 300), [applyFiltersAndSorting]);

  useEffect(() => {
    debouncedApplyFiltersAndSorting();
    return () => {
      debouncedApplyFiltersAndSorting.cancel();
    };
  }, [debouncedApplyFiltersAndSorting, searchTerm, priceRange, sortOption]);

  const currentServices = useMemo(() => {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return filteredServices.slice(startIndex, endIndex);
  }, [filteredServices, currentPage, perPage]);

  if (loading) {
    return <div className="services-list"><p>Loading services...</p></div>;
  }

  if (error) {
    return <div className="services-list"><p>{error}</p></div>;
  }

  return (
    <div className="services-list">
      <h1>Available Services</h1>
      <div className="filters-container">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
        </div>
        <div className="advanced-filters">
          <div className="filter-group">
            <label>
              Min Price:
              <input
                type="number"
                min="0"
                value={priceRange[0]}
                onChange={(e) => {
                  const newMin = +e.target.value;
                  setPriceRange([newMin, priceRange[1]]);
                }}
                className="filter-input"
              />
            </label>
          </div>
          <div className="filter-group">
            <label>
              Max Price:
              <input
                type="number"
                min="0"
                value={priceRange[1]}
                onChange={(e) => {
                  const newMax = +e.target.value;
                  setPriceRange([priceRange[0], newMax]);
                }}
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
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </select>
            </label>
          </div>
        </div>
      </div>
      {filteredServices.length === 0 ? (
        <p>No services found.</p>
      ) : (
        <>
          <ul className="service-items">
            {currentServices.map(service => (
              <li key={service.id} className="service-item">
                <h2><Link to={`/service/${service.id}`}>{service.title}</Link></h2>
                <p>{service.description}</p>
                <p><strong>Price:</strong> ${service.price}</p>
                {service.provider && (
                  <p><strong>Provider:</strong> <Link to={`/provider/${service.provider.id}`}>{service.provider.name}</Link></p>
                )}
              </li>
            ))}
          </ul>
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
          <p>Total Services: {filteredServices.length}</p>
        </>
      )}
    </div>
  );
}

export default ServicesList;
