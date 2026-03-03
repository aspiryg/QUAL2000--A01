# Setup & Test Guide

_Hogwarts Event Management System_

A guide explains how to install, configure, run the application, and execute the tests.

---

# Requirements

- **Node.js ≥ 18**
- **npm**
- A **MongoDB connection string** (Atlas or local instance)

---

# Application Setup

## Clone the Repository

```bash
git clone https://github.com/aspiryg/QUAL2000--A01.git
cd event_system
```

---

## Backend Setup

```bash
cd backend
npm install
```

### Create Environment File

Inside `backend/`, create a `.env` file:

```env
PORT=5000
MONGO_URI=
```

### Start Backend Server

```bash
npm run dev
```

The API will be available at:

```
http://localhost:5000/api
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at:

```
http://localhost:3000
```

The frontend automatically connects to the backend API.

---

# Running Tests

All backend tests use the **Node.js built-in test runner**.

---

## Run All Backend Tests

```bash
cd backend
npm test
```

This runs:

- Unit tests
- Integration tests

---

## Run Only Integration Tests

```bash
npm run test:integration
```

---

## Run Only Unit Tests

```bash
npm run test:unit
```

---

# Frontend Tests

Frontend tests focus on the API service. I didn't create tests for the components.

```bash
cd frontend

# Run once
npm test

# Watch mode
npm run test:watch
```

---

# Continuous Integration CI

GitHub Actions automatically:

- Run on push or pull_request
- Installs dependencies
- Runs all backend tests
- Run all frontend test
- Fails the build if any test fails

Workflow location:

```
.github/workflows/ci-testing.yml
```
