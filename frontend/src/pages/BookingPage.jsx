import { useEffect, useState } from 'react';

const initialForm = { patientName: '', doctorName: '', date: '', timeSlot: '' };

export default function BookingPage() {
  const [formData, setFormData] = useState(initialForm);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/v1/doctors')
      .then((response) => response.json())
      .then((result) => setDoctors(result.data || []))
      .catch(() => setMessage('Unable to load doctors.'))
      .finally(() => setLoadingDoctors(false));
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch('/api/v1/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setMessage('Appointment request submitted successfully.');
      setFormData(initialForm);
    } catch (requestError) {
      setMessage(requestError.message || 'Unable to submit appointment.');
    }
  }

  return (
    <section className="booking-layout">
      <div className="page-intro">
        <h2>Book appointment</h2>
      </div>
      <form className="booking-form" onSubmit={handleSubmit}>
        <label>Patient name<input name="patientName" value={formData.patientName} onChange={handleChange} required /></label>
        <label>Doctor<select name="doctorName" value={formData.doctorName} onChange={handleChange} required disabled={loadingDoctors}>
          <option value="">{loadingDoctors ? 'Loading doctors...' : 'Select a doctor'}</option>
          {doctors.map((doctor) => <option key={doctor._id || doctor.id} value={doctor.name}>{doctor.name} - {doctor.specialisation}</option>)}
        </select></label>
        <label>Date<input type="date" name="date" value={formData.date} onChange={handleChange} required /></label>
        <label>Time slot<select name="timeSlot" value={formData.timeSlot} onChange={handleChange} required>
          <option value="">Select a time</option>
          <option>09:00 AM</option>
          <option>10:00 AM</option>
          <option>02:00 PM</option>
          <option>04:00 PM</option>
        </select></label>
        <button type="submit">Request appointment</button>
      </form>
      {(formData.patientName || formData.doctorName || formData.date || formData.timeSlot) && (
        <p className="form-preview" aria-live="polite">
          {formData.patientName && <span>Patient: {formData.patientName}</span>}
          {formData.doctorName && <span>Doctor: {formData.doctorName}</span>}
          {formData.date && <span>Date: {formData.date}</span>}
          {formData.timeSlot && <span>Time: {formData.timeSlot}</span>}
        </p>
      )}
      {message && <p className="message">{message}</p>}
    </section>
  );
}
