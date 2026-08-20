import { useEffect, useState } from 'react';
import AppointmentCard from '../components/AppointmentCard';

export default function HomePage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/appointments')
      .then((response) => response.json())
      .then((result) => setAppointments(result.data || []))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="home-page">
      <div className="hero-copy">
        <p className="eyebrow">YOUR HEALTH, WELL ORGANIZED</p>
        <h2>Your care, scheduled.</h2>
        <p className="intro">Find a doctor, choose a time, and manage your appointments.</p>
      </div>
      <div className="home-grid">
        <div className="feature-panel">
          <span className="feature-number">01</span>
          <h3>Find a doctor</h3>
          <p>View the available specialists and their areas of expertise.</p>
        </div>
        <div className="feature-panel accent-panel">
          <span className="feature-number">02</span>
          <h3>Book a visit</h3>
          <p>Choose a date and time for your appointment.</p>
        </div>
      </div>
      <div className="sample-appointment">
        <div className="section-heading">
          <h3>Upcoming appointments</h3>
          <span className="record-count">{appointments.length} records</span>
        </div>
        {loading && <p className="message">Loading appointments...</p>}
        {!loading && appointments.length === 0 && <p className="empty-state">No appointments yet. Book the first visit.</p>}
        {!loading && appointments.map((appointment) => <AppointmentCard key={appointment.id} {...appointment} />)}
      </div>
    </section>
  );
}
