import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from '../../api/axios'; // Your axios instance
import { format, parseISO, isToday } from 'date-fns';
import './ServiceDetails.css';

function ServiceDetails() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // Start with no date selected
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const customerId = 2;

  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    fetchService();
    fetchTimeSlots();
  }, [id]);

  useEffect(() => {
    filterSlotsByDate();
  }, [selectedDate, timeSlots]);

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
      const freeSlots = response.data.filter(
        (slot) => slot.service_id == id && !slot.booked
      );
      setTimeSlots(freeSlots);

      const dates = freeSlots.map((slot) =>
        format(parseISO(slot.start_time), 'yyyy.MM.dd')
      );
      const uniqueDates = [...new Set(dates)];
      setAvailableDates(uniqueDates);
    } catch (err) {
      console.error('Error fetching time slots:', err);
      setError('Failed to load time slots.');
    }
  };

  const filterSlotsByDate = () => {
    if (!selectedDate) {
      setAvailableSlots([]);
      return;
    }

    const formattedDate = format(selectedDate, 'yyyy-MM-dd');

    const slotsForDate = timeSlots.filter((slot) => {
      const slotDate = format(parseISO(slot.start_time), 'yyyy-MM-dd');
      return slotDate === formattedDate;
    });

    setAvailableSlots(slotsForDate);
  };

  const bookAppointment = async (timeSlotId) => {
    setBookingError(null);
    setBookingSuccess(null);
    try {
      await axios.post('/appointment', {
        service_id: id,
        customer_id: customerId,
        time_slot_id: timeSlotId,
        status: 'pending',
      });

      setTimeSlots((prevSlots) => {
        const updatedSlots = prevSlots.filter((slot) => slot.id !== timeSlotId);

        const bookedSlot = prevSlots.find((slot) => slot.id === timeSlotId);
        const slotDate = format(parseISO(bookedSlot.start_time), 'yyyy.MM.dd');

        if (!updatedSlots.some((slot) =>
          format(parseISO(slot.start_time), 'yyyy.MM.dd') === slotDate
        )) {
          setAvailableDates((prevDates) =>
            prevDates.filter((date) => date !== slotDate)
          );

          // Clear available slots if no slots remain for the selected date
          if (format(selectedDate, 'yyyy.MM.dd') === slotDate) {
            setAvailableSlots([]);
          }
        }

        return updatedSlots;
      });

      setBookingSuccess('Appointment booked successfully!');
    } catch (err) {
      console.error('Error booking appointment:', err);
      if (err.response && err.response.status === 422) {
        const validationErrors = err.response.data.errors;
        const errorMessages = Object.values(validationErrors)
          .flat()
          .join(' ');
        setBookingError(errorMessages);
      } else if (err.response && err.response.status === 409) {
        setBookingError('Time slot is already booked.');
      } else {
        setBookingError('Failed to book the selected time slot.');
      }
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const formattedDate = format(date, 'yyyy.MM.dd');
      if (availableDates.includes(formattedDate)) {
        return 'available';
      } else {
        return 'unavailable';
      }
    }
  };

  const tileDisabled = ({ date, view }) => {
    if (view === 'month') {
      const formattedDate = format(date, 'yyyy.MM.dd');
      return !availableDates.includes(formattedDate);
    }
    return false;
  };

  const displaySelectedDate = () => {
    if (selectedDate && isToday(selectedDate)) {
      return 'Today';
    }
    return selectedDate ? format(selectedDate, 'dd.MM.yyyy') : null;
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

      <h2>Select a Date to View Available Time Slots</h2>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileDisabled={tileDisabled}
        tileClassName={tileClassName}
      />

      {/* Display success or error messages */}
      {bookingError && <p className="error">{bookingError}</p>}
      {bookingSuccess && <p className="success">{bookingSuccess}</p>}

      {/* Conditionally render available slots */}
      {selectedDate && availableSlots.length > 0 && (
        <>
          <h2>Available Time Slots for {displaySelectedDate()}</h2>
          <ul className="time-slot-list">
            {availableSlots.map((slot) => (
              <li key={slot.id}>
                <p><strong>Start:</strong> {format(parseISO(slot.start_time), 'HH:mm')}</p>
                <p><strong>End:</strong> {format(parseISO(slot.end_time), 'HH:mm')}</p>
                <button onClick={() => bookAppointment(slot.id)}>Book this slot</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default ServiceDetails;
