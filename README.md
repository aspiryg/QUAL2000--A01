# QUAL2000 - Assignment 01

A simple web application for managing **magical events and attendees** at _Hogwarts School of Witchcraft and Wizardry_, built with the modern “spells” of **Express**, **Mongoose**, and **React**.

All magic aside — the true purpose of this project is to demonstrate the proper implementation of different types of testing:

- Unit test
- Integrated test
- Continuous Integration (CI)

## Features

- Create magical events (Triwizard Tournament, Yule Ball, Duelling Club, etc.)
- Register witches and wizards as attendees
- Check in attendees at the Great Hall gates
- Generate attendance reports (visual dashboard or downloadable CSV scroll)

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

| Method | Endpoint                                             | Description                                  |
| ------ | ---------------------------------------------------- | -------------------------------------------- |
| POST   | `/api/events`                                        | Create a new magical event                   |
| GET    | `/api/events`                                        | List all events                              |
| GET    | `/api/events/:id`                                    | Retrieve a single event                      |
| POST   | `/api/events/:eventId/attendees`                     | Register an attendee                         |
| GET    | `/api/events/:eventId/attendees`                     | List attendees of a given event              |
| PUT    | `/api/events/:eventId/attendees/:attendeeId/checkin` | Check in an attendee                         |
| GET    | `/api/events/:eventId/report?format=json\|csv`       | Get attendance report                        |
| DELETE | `/api/events/:eventId/attendees/:attendeeId`         | Delete an attendee from an event             |
| DELETE | `/api/events/:eventId`                               | Delete an event and its registered attendees |
| GET    | `/api/events/:eventId/stats`                         | Retrieve event statistics                    |

---

## How to Run Tests

### 1. Backend Tests

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

### 2. Frontend Tests

```
TODO
```

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

---

> Even at Hogwarts, good magic requires discipline.

---
