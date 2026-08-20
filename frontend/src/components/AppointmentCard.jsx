export default function AppointmentCard({ patientName, doctorName, date, timeSlot, status }) {
  return (
    <article className="appointment-card">
      <div>
        <p className="card-label">Appointment</p>
        <h3>{doctorName}</h3>
        <p>{patientName}</p>
      </div>
      <div className="appointment-details">
        <span>{date}</span>
        <span>{timeSlot}</span>
      </div>
      <span className={`status status-${status}`}>{status}</span>
    </article>
  );
}
