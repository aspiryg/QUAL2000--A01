# QUAL2000 - Assignment 01

A simple web application built for _Hogwarts School of Witchcraft and Wizardry_ to manage school eventd **(Quidditch matches, feasts, classes, the Yule Ball, etc.)**, enrol witches & wizards, record arrivals, and generate attendance scrolls. Built with the modern “spells” of **Express**, **Mongoose**, and **React**.

All magic aside — the true purpose of this project is to demonstrate the proper implementation of different types of testing:

- Unit test
- Integrated test
- Continuous Integration (CI)

## Features

- **Schedule events** - create magical events (Triwizard Tournament, Yule Ball, Duelling Club, etc.)
- **Enrol witches & wizards** - register attendees with unique Owl Post (email) validation
- **Record arrival** - mark attendees as arrived at the Great Hall gates
- **Attendance scrolls** - generate attendance reports (visual dashboard or downloadable CSV scroll)
- **Delete events & attendees** - with confirmation dialogs and attendees cascade removal
- **Event stats**
- **Search & filter**
- **Toast notifications**

---

## Project Structure

```bash
## TODO
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
| POST   | `/api/events`                                        | Schedule a new event                         |
| GET    | `/api/events`                                        | List all events (with attendee counts)       |
| GET    | `/api/events/:id`                                    | Retrieve a single event                      |
| DELETE | `/api/events/:eventId`                               | Delete an event and its registered attendees |
| POST   | `/api/events/:eventId/attendees`                     | Enrol a witch/wizard                         |
| GET    | `/api/events/:eventId/attendees`                     | List enrolled witches & wizards              |
| DELETE | `/api/events/:eventId/attendees/:attendeeId`         | Remove an attendee                           |
| PUT    | `/api/events/:eventId/attendees/:attendeeId/checkin` | Record arrival                               |
| GET    | `/api/events/:eventId/report?format=json\|csv`       | Get attendance scroll                        |
| GET    | `/api/events/:eventId/stats`                         | Get event stats & spots remaining            |

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
- and

**Integration tests**

- register an attendee, store them in the database and prevent duplicate registrations
- register an attendee, check them in, and retrieve the correct report
- handle full workflow with multiple attendees and generate correct csv report
- prevent registration when event capacity is reached
- prevent duplicate registrations for the same event
- prevent check-in for unregistered attendees
- prevent check-in for already checked-in attendees
- delete an event and its registered attendees
- delete an attendee from an event
- returns correct stats

---

### 2. Frontend Tests

I decided to apply the tests to the API service only, as testing React components
turend out to be a task that required more research from me.

```bash
cd frontend

# Run frontend tests once
npm test

# Run in watch mode
npm run test:watch

# Test React Components: TODO
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
