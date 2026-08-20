const path = require('path');
const mongoose = require('mongoose');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

async function connectDatabase() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing from the root .env file.');
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  const patient = await Patient.findOneAndUpdate(
    { email: 'asha.kumar@medcare.com' },
    { name: 'Asha Kumar', email: 'asha.kumar@medcare.com', phone: '0771234567', bloodGroup: 'O+', age: 29 },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  const doctorRecords = [
    { name: 'Dr. Anil Sharma', email: 'anil@medcare.com', specialisation: 'Cardiology', available: true },
    { name: 'Dr. Meera Joseph', email: 'meera@medcare.com', specialisation: 'Pediatrics', available: true },
    { name: 'Dr. Ravi Perera', email: 'ravi@medcare.com', specialisation: 'Dermatology', available: false }
  ];
  const doctors = await Promise.all(doctorRecords.map((doctorRecord) => Doctor.findOneAndUpdate(
    { email: doctorRecord.email },
    doctorRecord,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )));
  const doctor = doctors[0];
  await Appointment.findOneAndUpdate(
    { patientId: patient._id, doctorId: doctor._id, date: new Date('2026-08-25'), timeSlot: '10:00 AM' },
    { patientId: patient._id, doctorId: doctor._id, date: new Date('2026-08-25'), timeSlot: '10:00 AM', status: 'confirmed', reason: 'Regular health check-up' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log('MongoDB seed data ready: patients, doctors and appointments');
}

module.exports = connectDatabase;
