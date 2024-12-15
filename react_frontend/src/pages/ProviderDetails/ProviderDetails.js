import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import './ProviderDetails.css';

function ProviderDetails() {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProvider();
  }, [id]);

  const fetchProvider = async () => {
    try {
      const response = await axiosInstance.get(`/provider/${id}`);
      setProvider(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching provider details:', err);
      setError('Failed to load provider details.');
      setLoading(false);
    }
  };

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
      
      <h2>Services</h2>
      {provider.services.length > 0 ? (
        <ul className="service-items">
          {provider.services.map(service => (
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

      <h2>Reviews</h2>
      {provider.reviews.length > 0 ? (
        <ul className="review-items">
          {provider.reviews.map(review => (
            <li key={review.id} className="review-item">
              <p><strong>Customer:</strong> {review.customer.name}</p>
              <p><strong>Rating:</strong> {review.rating} / 5</p>
              <p>{review.comment}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  );
}

export default ProviderDetails;
