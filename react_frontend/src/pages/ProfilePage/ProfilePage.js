import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../../api/axios';
import { format, parseISO } from 'date-fns';
import './ProfilePage.css';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [availability, setAvailability] = useState([
    { day: '', start_time: '', end_time: '', duration: '', service_id: '' },
  ]);

  const [services, setServices] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const [reviewingAppointmentId, setReviewingAppointmentId] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    fetchUserData();
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (user) {
      fetchServices();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/user');
      const userData = response.data;
      setUser(userData);
      setAppointments(userData.appointments || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load profile.');
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axiosInstance.get('/my-services');
      setServices(response.data);
    } catch (err) {
      console.error('Error fetching services:', err);
      setServices([]);
    }
  };

  const handleAvailabilityChange = (index, field, value) => {
    const updated = [...availability];
    updated[index][field] = value;
    setAvailability(updated);
  };

  const addAvailabilitySlot = () => {
    setAvailability([
      ...availability,
      { day: '', start_time: '', end_time: '', duration: '', service_id: '' },
    ]);
  };

  const removeAvailabilitySlot = (index) => {
    const updated = [...availability];
    updated.splice(index, 1);
    setAvailability(updated);
  };

  const handleSubmitAvailability = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setSubmitError(null);

    if (
      availability.some(
        (a) =>
          !a.day ||
          !a.start_time ||
          !a.end_time ||
          !a.duration ||
          !a.service_id
      )
    ) {
      setSubmitError('Please fill in all fields for each availability slot.');
      return;
    }

    try {
      const formattedAvailability = availability.map((slot) => ({
        day: slot.day,
        start_time: slot.start_time,
        end_time: slot.end_time,
        duration: parseInt(slot.duration, 10),
        service_id: slot.service_id,
      }));

      await axiosInstance.post('/availability/generate', {
        provider_id: user.id,
        availability: formattedAvailability,
      });

      setSuccessMessage('Availability schedule created successfully!');
    } catch (err) {
      console.error('Error submitting availability:', err);
      setSubmitError('Failed to create availability schedule.');
    }
  };

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const previewSlots = (start, end, duration) => {
    if (!start || !end || !duration) return null;
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    const startTotal = startHour * 60 + startMinute;
    const endTotal = endHour * 60 + endMinute;
    const totalMinutes = endTotal - startTotal;

    if (totalMinutes <= 0) return 'Invalid time range';

    const numberOfSlots = Math.floor(totalMinutes / duration);
    const remainder = totalMinutes % duration;

    return remainder > 0
      ? `${numberOfSlots} full slots will be created (some leftover time is unused).`
      : `${numberOfSlots} slots will be created.`;
  };

  const openReviewForm = (appointmentId) => {
    setReviewingAppointmentId(appointmentId);
    setReviewData({ rating: 5, comment: '' });
    setReviewError(null);
    setReviewSuccess(null);
  };

  const closeReviewForm = () => {
    setReviewingAppointmentId(null);
  };

  const handleReviewChange = (field, value) => {
    setReviewData({ ...reviewData, [field]: value });
  };

  const handleSubmitReview = async (appointmentId) => {
    setReviewError(null);
    setReviewSuccess(null);
    try {
      const response = await axiosInstance.post('/reviews', {
        appointment_id: appointmentId,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });

      setReviewSuccess('Review submitted successfully!');
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, review: response.data.review }
            : appointment
        )
      );

      closeReviewForm();
    } catch (err) {
      console.error('Error submitting review:', err);
      if (err.response && err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors)
          .flat()
          .join(' ');
        setReviewError(errorMessages);
      } else if (err.response && err.response.data.error) {
        setReviewError(err.response.data.error);
      } else {
        setReviewError('Failed to submit review.');
      }
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>{user.name}</h1>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        {/* Optionally, add a logout button here */}
      </div>

      {user.type === 'customer' && (
        <div className="profile-appointments">
          <h2>Your Appointments</h2>
          {appointments.length === 0 ? (
            <p>No appointments found.</p>
          ) : (
            <ul>
              {appointments.map((appointment) => (
                <li key={appointment.id}>
                  <h3>{appointment.service.title}</h3>
                  <p>
                    <strong>Status:</strong> {appointment.status}
                  </p>
                  <p>
                    <strong>Time Slot:</strong>{' '}
                    {appointment.time_slot
                      ? `${format(parseISO(appointment.time_slot.start_time), 'HH:mm')} - ${format(
                          parseISO(appointment.time_slot.end_time),
                          'HH:mm'
                        )}`
                      : 'N/A'}
                  </p>

                  {/* Display Review if exists */}
                  {appointment.review ? (
                    <div className="review">
                      <p>
                        <strong>Your Rating:</strong> {appointment.review.rating}/5
                      </p>
                      <p>
                        <strong>Your Comment:</strong> {appointment.review.comment}
                      </p>
                    </div>
                  ) : appointment.status === 'confirmed' ? (
                    <button onClick={() => openReviewForm(appointment.id)}>
                      Leave a Review
                    </button>
                  ) : null}

                  {/* Review Form */}
                  {reviewingAppointmentId === appointment.id && (
                    <div className="review-form">
                      <h4>Leave a Review</h4>
                      {reviewError && <p className="error">{reviewError}</p>}
                      {reviewSuccess && <p className="success">{reviewSuccess}</p>}
                      <label>
                        Rating:
                        <select
                          value={reviewData.rating}
                          onChange={(e) => handleReviewChange('rating', e.target.value)}
                        >
                          {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Comment:
                        <textarea
                          value={reviewData.comment}
                          onChange={(e) => handleReviewChange('comment', e.target.value)}
                          maxLength="1000"
                        />
                      </label>
                      <button onClick={() => handleSubmitReview(appointment.id)}>
                        Submit Review
                      </button>
                      <button type="button" onClick={closeReviewForm}>
                        Cancel
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {(user.type === 'freelancer' || user.type === 'company') && (
        <div className="availability-form">
          <h2>Define Your Weekly Availability</h2>
          <p>
            Set a day, start & end times, and a duration. We'll generate slots for the next month.
          </p>

          {submitError && <p className="error">{submitError}</p>}
          {successMessage && <p className="success">{successMessage}</p>}

          <form onSubmit={handleSubmitAvailability}>
            {availability.map((slot, index) => {
              const previewMessage = previewSlots(slot.start_time, slot.end_time, slot.duration);

              return (
                <div key={index} className="availability-slot">
                  <select
                    value={slot.day}
                    onChange={(e) => handleAvailabilityChange(index, 'day', e.target.value)}
                  >
                    <option value="">Select Day</option>
                    {daysOfWeek.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>

                  <input
                    type="time"
                    value={slot.start_time}
                    onChange={(e) => handleAvailabilityChange(index, 'start_time', e.target.value)}
                    placeholder="Start Time"
                  />

                  <input
                    type="time"
                    value={slot.end_time}
                    onChange={(e) => handleAvailabilityChange(index, 'end_time', e.target.value)}
                    placeholder="End Time"
                  />

                  <input
                    type="number"
                    value={slot.duration}
                    onChange={(e) => handleAvailabilityChange(index, 'duration', e.target.value)}
                    placeholder="Duration (minutes)"
                    min="15"
                    step="15"
                  />

                  <select
                    value={slot.service_id}
                    onChange={(e) => handleAvailabilityChange(index, 'service_id', e.target.value)}
                  >
                    <option value="">Select Service</option>
                    {services.map((svc) => (
                      <option key={svc.id} value={svc.id}>
                        {svc.title}
                      </option>
                    ))}
                  </select>

                  {availability.length > 1 && (
                    <button type="button" onClick={() => removeAvailabilitySlot(index)}>
                      Remove
                    </button>
                  )}

                  {previewMessage && <p className="preview">{previewMessage}</p>}
                </div>
              );
            })}

            <button type="button" onClick={addAvailabilitySlot}>
              Add Another Availability Window
            </button>

            <button type="submit">Generate Availability</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
