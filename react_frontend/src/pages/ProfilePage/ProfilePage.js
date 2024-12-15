import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axios';
import './ProfilePage.css';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Availability now has start_time AND end_time instead of a single slot
  const [availability, setAvailability] = useState([
    { day: '', start_time: '', end_time: '', duration: '', service_id: '' }
  ]);

  const [services, setServices] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const loggedInUserId = 1;

  useEffect(() => {
    fetchUserData();
    fetchServices();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/user/${loggedInUserId}`);
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
      const response = await axiosInstance.get(`/services?provider_id=${loggedInUserId}`);
      setServices(response.data);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const handleAvailabilityChange = (index, field, value) => {
    const updated = [...availability];
    updated[index][field] = value;
    setAvailability(updated);
  };

  const addAvailabilitySlot = () => {
    setAvailability([...availability, { day: '', start_time: '', end_time: '', duration: '', service_id: '' }]);
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

    // Validate input
    if (availability.some(a => !a.day || !a.start_time || !a.end_time || !a.duration || !a.service_id)) {
      setSubmitError('Please fill in all fields for each availability slot.');
      return;
    }

    try {
      const formattedAvailability = availability.map(slot => ({
        day: slot.day,
        start_time: slot.start_time,
        end_time: slot.end_time,
        duration: parseInt(slot.duration, 10),
        service_id: slot.service_id,
      }));

      const response = await axiosInstance.post('/availability/generate', {
        provider_id: loggedInUserId,
        availability: formattedAvailability
      });
      setSuccessMessage('Availability schedule created successfully!');
    } catch (err) {
      console.error('Error submitting availability:', err);
      setSubmitError('Failed to create availability schedule.');
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // A helper function to preview how many slots will be created
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
    if (remainder > 0) {
      return `${numberOfSlots} full slots will be created (some leftover time is unused).`;
    } else {
      return `${numberOfSlots} slots will be created.`;
    }
  };

  if (loading) {
    return <div className="profile-page"><p>Loading profile...</p></div>;
  }

  if (error) {
    return <div className="profile-page"><p>{error}</p></div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>{user.name}</h1>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      {user.type === 'customer' && (
        <div className="profile-appointments">
          <h2>Your Appointments</h2>
          {appointments.length === 0 ? (
            <p>No appointments found.</p>
          ) : (
            <ul>
              {appointments.map(appointment => (
                <li key={appointment.id}>
                  <h3>{appointment.service.title}</h3>
                  <p><strong>Status:</strong> {appointment.status}</p>
                  <p><strong>Time Slot:</strong> {appointment.time_slot?.start_time} - {appointment.time_slot?.end_time}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {(user.type === 'freelancer' || user.type === 'company') && (
        <div className="availability-form">
          <h2>Define Your Weekly Availability</h2>
          <p>Set a day, start & end times, and a duration. We'll generate slots for the next month.</p>

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
                    {daysOfWeek.map(day => (
                      <option key={day} value={day}>{day}</option>
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
                    {services.map(svc => (
                      <option key={svc.id} value={svc.id}>{svc.title}</option>
                    ))}
                  </select>

                  {availability.length > 1 && (
                    <button type="button" onClick={() => removeAvailabilitySlot(index)}>Remove</button>
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
