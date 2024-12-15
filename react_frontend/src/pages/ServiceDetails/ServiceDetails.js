import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios'; // Your axios instance
import './ServiceDetails.css';

function ServiceDetails() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  
  // Hardcoded customer ID (simulate a logged-in customer)
  const customerId = 2; 

  useEffect(() => {
    fetchService();
    fetchTimeSlots();
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

  const fetchTimeSlots = async () => {
    try {
        const response = await axios.get('/time-slots');
        // Filter slots by this service and those not booked
        const freeSlots = response.data.filter(slot => slot.service_id == id && !slot.booked);
        setTimeSlots(freeSlots);
    } catch (err) {
        console.error('Error fetching time slots:', err);
        setError('Failed to load time slots.');
    }
};


const bookAppointment = async (timeSlotId) => {
  setBookingError(null);
  setBookingSuccess(null);
  try {
      // Create a new appointment
      await axios.post('/appointment', {
          service_id: id,
          customer_id: customerId,
          time_slot_id: timeSlotId,
          status: 'pending'
      });

      // After successful booking, remove the booked slot from the list
      setTimeSlots(prevSlots => prevSlots.filter(slot => slot.id !== timeSlotId));
  } catch (err) {
      console.error('Error booking appointment:', err);
      if (err.response && err.response.status === 422) {
          // Extract validation errors from the response
          const validationErrors = err.response.data.errors;
          const errorMessages = Object.values(validationErrors).flat().join(' ');
          setBookingError(errorMessages);
      } else if (err.response && err.response.status === 409) {
          setBookingError('Time slot is already booked.');
      } else {
          setBookingError('Failed to book the selected time slot.');
      }
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

      <h2>Available Time Slots</h2>
      {bookingError && <p className="error">{bookingError}</p>}
      {timeSlots.length === 0 ? (
        <p>No available time slots for this service.</p>
      ) : (
        <ul className="time-slot-list">
          {timeSlots.map(slot => (
            <li key={slot.id}>
              <p><strong>Start:</strong> {slot.start_time}</p>
              <p><strong>End:</strong> {slot.end_time}</p>
              <button onClick={() => bookAppointment(slot.id)}>Book this slot</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ServiceDetails;
