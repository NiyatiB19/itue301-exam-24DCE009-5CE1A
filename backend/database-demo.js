const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const connectDatabase = require('./config/database');
const Patient = require('./models/Patient');

async function runDemo() {
  try {
    await connectDatabase();
    const patient = await Patient.create({ name: 'Demo Patient', email: `demo-${Date.now()}@medcare.com`, bloodGroup: 'O+', age: 30 });
    console.log('MongoDB operation succeeded:', patient.name);
    await patient.deleteOne();
    await Patient.validate({ name: 'Invalid Patient', email: 'invalid@medcare.com', bloodGroup: 'X+' });
  } finally {
    const mongoose = require('mongoose');
    await mongoose.disconnect();
  }
}

runDemo().catch((error) => {
  const messages = Object.values(error.errors || {}).map((item) => item.message);
  console.error('Validation failed:', messages.length ? messages : error.message);
  process.exitCode = 1;
});
