require('dotenv').config();
const connectDatabase = require('./config/database');
const Patient = require('./models/Patient');

async function runDemo() {
  await connectDatabase();
  const patient = await Patient.create({ name: 'Demo Patient', email: `demo-${Date.now()}@medcare.com`, bloodGroup: 'O+', age: 30 });
  console.log('MongoDB operation succeeded:', patient.name);
  await Patient.validate({ name: 'Invalid Patient', email: 'invalid@medcare.com', bloodGroup: 'X+' });
}

runDemo().catch((error) => {
  const messages = Object.values(error.errors || {}).map((item) => item.message);
  console.error('Validation failed:', messages.length ? messages : error.message);
  process.exitCode = 1;
});
