# MedCare Plus Hospital Appointment System

A Hospital Appointment System built for ITUE301 Set A using React, Express.js, MongoDB and Mongoose.

## Project structure

- `frontend/` React application
- `backend/` Express API and Mongoose models
- `.env.example` environment variable template

## Prerequisites

- Node.js 18 or newer
- MongoDB running locally or a MongoDB Atlas connection string

## MongoDB setup

For local MongoDB, make sure the MongoDB service is running. For Atlas, create a cluster and copy its connection string. The backend creates the `medcare_plus` database and seed documents in the `patients`, `doctors`, and `appointments` collections when it starts.

## Environment variables

From the project root:

```bash
cp .env.example .env
```

Set `MONGO_URI` and `PORT` in `.env`. Never commit `.env`.

## Run the backend

```bash
cd backend
npm install
npm start
```

The API runs on `http://localhost:5050` when `PORT=5050` is used.

Endpoints:

- `GET /api/v1/appointments`
- `POST /api/v1/appointments`
- `GET /api/v1/doctors`
- `POST /api/v1/mongodb/validation-demo` validates a Patient payload and returns readable validation errors.

To demonstrate a MongoDB operation and validation failure after MongoDB is configured:

```bash
cd backend
node database-demo.js
```

## Run the frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Report submission

Create three screenshots: the React application, a successful Postman or Thunder Client API request, and MongoDB Compass or Atlas showing the `medcare_plus` database and a document. Place them in a PDF named `[RollNo]_SetA_Report.pdf`.

## Example appointment POST body

```json
{
  "patientName": "Nimal Silva",
  "doctorName": "Dr. Anil Sharma",
  "date": "2026-08-25",
  "timeSlot": "10:00 AM",
  "reason": "Regular check-up"
}
```
