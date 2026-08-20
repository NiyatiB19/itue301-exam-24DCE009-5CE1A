import { useEffect, useState } from 'react';

export default function DoctorsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDoctors() {
      try {
        const response = await fetch('/api/v1/doctors');
        if (!response.ok) throw new Error('Unable to load doctors.');
        const result = await response.json();
        setData(result.data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }
    loadDoctors();
  }, []);

  return (
    <section>
      <div className="page-intro">
        <h2>Doctors</h2>
      </div>
      {loading && <p className="message">Loading doctors...</p>}
      {error && <p className="message error-message">{error}</p>}
      {!loading && !error && (
        <div className="doctor-grid">
          {data.map((doctor) => (
            <article className="doctor-card" key={doctor.id}>
              <div className="doctor-avatar">{doctor.name.replace('Dr. ', '').charAt(0)}</div>
              <h3>{doctor.name}</h3>
              <p className="specialisation">{doctor.specialisation}</p>
              <p className={doctor.available ? 'available' : 'unavailable'}>
                {doctor.available ? 'Available' : 'Unavailable'}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
