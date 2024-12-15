import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axios';
import './ProfilePage.css';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loggedInUserId = 3;

  useEffect(() => {
    fetchUserData();
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

      {user.type !== 'customer' && (
        <p>This profile type does not have appointments.</p>
      )}
    </div>
  );
}

export default ProfilePage;
