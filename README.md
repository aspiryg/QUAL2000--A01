# QUAL2000 - Assignment 01

A simple web application for managing events and attendee, built with **Express**, **Mongoose**, and **React**.
The purpose of this project is to be used to demonstrate the different types of testing:

- Unit test
- Integrated test
- CI

## Features

- Create events
- Register Atendees
- Check in Atendees
- Generate Atendnace reports (visual or downlodable csv)

---

## Project Structure

```
TODO
```

---

## Requirements

- **Node.js** ≥ 18
- **npm**
- A MongoDB connection string (Atlas or local)

---

## How to run the Applciation

### 1. Backend

```bash or powershell
cd backend
npm install
```

Create a `.env` file in the `backend/`directory:

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/event_db
```

Start the server:

```bash or powershell
npm run dev
```

The API will be available at `hhtp://localhost:5000/api`.

### 2. Frontend

```bash or powershell
cd frontend && npm install && npm run dev
```

The React app will open at `hhtp://localhost:3000` and proxy API requests to the backend.

---

## API Endpoints

| Method | Endpoint                         | Description          |
| ------ | -------------------------------- | -------------------- |
| POST   | `/api/events`                    | Create a new event   |
| GET    | `/api/events`                    | List all events      |
| GET    | `/api/events/:id`                | Get a single event   |
| POST   | `/api/events/:eventId/attendees` | Register an attendee |
