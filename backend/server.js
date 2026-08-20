const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const connectDatabase = require('./config/database');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

function requestLogger(request, response, next) {
  console.log(`[${request.method}] ${request.path} [${new Date().toISOString()}]`);
  next();
}

app.use(requestLogger);

app.get('/api/v1/appointments', async (request, response, next) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'name')
      .populate('doctorId', 'name')
      .sort({ date: 1, createdAt: -1 });
    response.status(200).json({ success: true, data: appointments.map(formatAppointment) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/v1/appointments', async (request, response, next) => {
  try {
    const { patientName, doctorName, date, timeSlot, reason = '' } = request.body;
    if (!patientName || !doctorName || !date || !timeSlot) {
      return response.status(400).json({ success: false, message: 'patientName, doctorName, date and timeSlot are required.' });
    }
    const doctor = await Doctor.findOne({ name: doctorName, available: true });
    if (!doctor) {
      return response.status(400).json({ success: false, message: 'The selected doctor is not available.' });
    }
    const patient = await Patient.findOneAndUpdate(
      { name: patientName },
      { name: patientName, email: `${patientName.toLowerCase().replace(/[^a-z0-9]+/g, '.')}@patient.medcare.local` },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    const appointment = await Appointment.create({ patientId: patient._id, doctorId: doctor._id, date, timeSlot, reason });
    const savedAppointment = await appointment.populate([
      { path: 'patientId', select: 'name' },
      { path: 'doctorId', select: 'name' }
    ]);
    response.status(201).json({ success: true, data: formatAppointment(savedAppointment) });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return response.status(400).json({
        success: false,
        message: 'Appointment validation failed.',
        errors: Object.values(error.errors).map((item) => item.message)
      });
    }
    next(error);
  }
});

app.patch('/api/v1/appointments/:id/status', async (request, response, next) => {
  try {
    const { status } = request.body;
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return response.status(400).json({ success: false, message: 'status must be pending, confirmed or cancelled.' });
    }
    const appointment = await Appointment.findByIdAndUpdate(
      request.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate([
      { path: 'patientId', select: 'name' },
      { path: 'doctorId', select: 'name' }
    ]);
    if (!appointment) {
      return response.status(404).json({ success: false, message: 'Appointment not found.' });
    }
    response.status(200).json({ success: true, data: formatAppointment(appointment) });
  } catch (error) {
    next(error);
  }
});

app.get('/api/v1/doctors', async (request, response, next) => {
  try {
    const data = await Doctor.find().sort({ name: 1 });
    response.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

app.post('/api/v1/mongodb/validation-demo', async (request, response) => {
  try {
    const patient = new Patient(request.body);
    await patient.validate();
    response.status(200).json({ success: true, message: 'Patient schema validation passed.' });
  } catch (error) {
    response.status(400).json({ success: false, message: 'Validation failed.', errors: Object.values(error.errors || {}).map((item) => item.message) });
  }
});

app.use((error, request, response, next) => {
  console.error(error.message);
  response.status(500).json({ success: false, message: 'Something went wrong on the server.' });
});

function formatAppointment(appointment) {
  return {
    id: appointment._id,
    patientName: appointment.patientId.name,
    doctorName: appointment.doctorId.name,
    date: appointment.date,
    timeSlot: appointment.timeSlot,
    status: appointment.status,
    reason: appointment.reason || ''
  };
}

if (require.main === module) {
  connectDatabase()
    .then(() => app.listen(port, () => console.log(`MedCare Plus API running at http://localhost:${port}`)))
    .catch((error) => {
      console.error(`MongoDB startup failed: ${error.message}`);
      process.exitCode = 1;
    });
}

module.exports = app;
