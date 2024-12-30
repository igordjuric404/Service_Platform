import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import './ProviderDetails.css';

function ProviderDetails() {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  const [sortServicesOption, setSortServicesOption] = useState('title-asc');
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const [minRating, setMinRating] = useState(0);
  const [sortReviewsOption, setSortReviewsOption] = useState('rating-desc');
  const [filteredReviews, setFilteredReviews] = useState([]);

  const fetchProvider = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/provider/${id}`);
      setProvider(response.data);
      setFilteredServices(response.data.services);
      setFilteredReviews(response.data.reviews);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching provider details:', err);
      setError('Failed to load provider details.');
      setLoading(false);
    }
  }, [id]);

  const filterAndSortServices = useCallback(() => {
    if (!provider) return;

    let filtered = [...provider.services];

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered = filtered.filter(
      service => service.price >= priceRange[0] && service.price <= priceRange[1]
    );

    switch (sortServicesOption) {
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
  }, [provider, searchTerm, sortServicesOption, priceRange]);

  const filterAndSortReviews = useCallback(() => {
    if (!provider) return;

    let filtered = [...provider.reviews];

    if (minRating > 0) {
      filtered = filtered.filter(review => review.rating >= minRating);
    }

    switch (sortReviewsOption) {
      case 'rating-asc':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'rating-desc':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    setFilteredReviews(filtered);
  }, [provider, minRating, sortReviewsOption]);

  useEffect(() => {
    fetchProvider();
  }, [fetchProvider]);

  useEffect(() => {
    filterAndSortServices();
    filterAndSortReviews();
  }, [filterAndSortServices, filterAndSortReviews]);

  if (loading) {
    return <div className="provider-details"><p>Loading provider details...</p></div>;
  }

  if (error) {
    return <div className="provider-details"><p>{error}</p></div>;
  }

  if (!provider) {
    return <div className="provider-details"><p>Provider not found.</p></div>;
  }

  return (
    <div className="provider-details">
      <h1>{provider.name}</h1>
      <p><strong>Type:</strong> {provider.type}</p>
      <p><strong>Email:</strong> {provider.email}</p>
      
      {/* Services Section */}
      <section className="services-section">
        <h2>Services</h2>
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
                  onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
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
                  onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                  className="filter-input"
                />
              </label>
            </div>
            <div className="filter-group">
              <label>
                Sort By:
                <select
                  value={sortServicesOption}
                  onChange={(e) => setSortServicesOption(e.target.value)}
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
        {filteredServices.length > 0 ? (
          <ul className="service-items">
            {filteredServices.map(service => (
              <li key={service.id} className="service-item">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <p><strong>Price:</strong> ${service.price}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No services available.</p>
        )}
      </section>

      <section className="reviews-section">
        <h2>Reviews</h2>
        <div className="filters-container">
          <div className="advanced-filters">
            <div className="filter-group">
              <label>
                Min Rating:
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="1"
                  value={minRating}
                  onChange={(e) => setMinRating(+e.target.value)}
                  className="filter-input"
                />
              </label>
            </div>
            <div className="filter-group">
              <label>
                Sort By:
                <select
                  value={sortReviewsOption}
                  onChange={(e) => setSortReviewsOption(e.target.value)}
                  className="filter-select"
                >
                  <option value="rating-desc">Rating (High to Low)</option>
                  <option value="rating-asc">Rating (Low to High)</option>
                </select>
              </label>
            </div>
          </div>
        </div>
        {filteredReviews.length > 0 ? (
          <ul className="review-items">
            {filteredReviews.map(review => (
              <li key={review.id} className="review-item">
                <p>
                  <strong>Customer:</strong> {review.customer?.name || 'Unknown'}
                </p>
                <p>
                  <strong>Rating:</strong> {review.rating} / 5
                </p>
                <p>{review.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}
      </section>
    </div>
  );
}

export default ProviderDetails;
