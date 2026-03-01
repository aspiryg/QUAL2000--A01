# QUAL2000 - Assignment 01

A simple web application for managing events and attendee, built with **Express**, **Mongoose**, and **React**.
The purpose of this project is to demonstrate the use of different types of testing:

- Unit test
- Integrated test
- Continuous Integration (CI)

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

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/`directory:

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/event_db
```

Start the server:

```bash
npm run dev
```

The API will be available at `hhtp://localhost:5000/api`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The React app will open at `hhtp://localhost:3000` and proxy API requests to the backend.

---

## API Endpoints

| Method | Endpoint                                             | Description                           |
| ------ | ---------------------------------------------------- | ------------------------------------- |
| POST   | `/api/events`                                        | Create a new event                    |
| GET    | `/api/events`                                        | List all events                       |
| GET    | `/api/events/:id`                                    | Get a single event                    |
| POST   | `/api/events/:eventId/attendees`                     | Register an attendee                  |
| GET    | `/api/events/:eventId/attendees`                     | List attendees of a given event       |
| PUT    | `/api/events/:eventId/attendees/:attendeeId/checkin` | Check in an attendee                  |
| GET    | `/api/events/:eventId/report?format=json\|csv`       | Get attendance report                 |
| DELETE | `/api/events/:eventId/attendees/:attendeeId`         | Delete a given attendee from an event |

---

## How to Run Tests

```bash
cd backend

# Run all tests (unit + intgration)
npm test

# Run only integration tests
npm run test:integration
```

**Unit tests**

- email validation
- event capacity check
- duplicate prevevtion
- check-in rules
- report building

**Integration tests**

---

## GitHub Actions (CI)

The repository includes a CI workflow at `.gethub/workflows/ci.yml` that:

- Triggers on every **push** and **pull request**
- Installs dependencies
- Run all unit and integration tests
- Fail the build if any test fails

---

## Tech Stack

- **Backend:** Node.js, Express. Mongoose, json-2-csv
- **Frontend:** React (Vite)
- **Testing:** Jest, Supertest, moongodb-memory-server
- **CI:** GitHub Actions
