import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios';
import './ServiceDetails.css';

function ServiceDetails() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const response = await axios.get(`/service/${id}`);
      setService(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching service:', err);
      setError('Failed to load service.');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="service-details"><p>Loading service...</p></div>;
  }

  if (error) {
    return <div className="service-details"><p>{error}</p></div>;
  }

  return (
    <div className="service-details">
      <h1>{service.title}</h1>
      <p>{service.description}</p>
      <p><strong>Price:</strong> ${service.price}</p>
      <p><strong>Provider:</strong> {service.provider.name}</p>
      {/* Add more details as needed */}
    </div>
  );
}

export default ServiceDetails;
