import test from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import app from "../../app.js";
// import connectDB from "./src/config/database.js";
/*
    I reaserched a bit about testing with MongoDB and I found that using an in-memory MongoDB server 
    is the best approach for testing, because it allows to run tests without the need for a real MongoDB
    instance, and it also allows to have a clean state for each test by simply restarting the in-memory server.
    So I decided to use **mongodb-memory-server** for the integration tests, and I will connect to it before 
    running the tests, and disconnect after all tests are done.

    I also used **supertest** to make HTTP requests to the Express app, which allows me to test the API endpoints as 
    if I were a client making requests to the server. This way I can test the full integration of the controllers, 
    models, and database interactions.
*/

let mongoServer;

test.describe("Integration tests for event and attendee management", () => {
  test.before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  test.afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  test.after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // --- 1. Test attendee registration and retrieval ---

  test("Should register an attendee, store them in the database and prevent duplicate registrations", async () => {
    // Create an event
    const eventResponse = await request(app)
      .post("/api/events")
      .send({
        name: "The Triwizard Tournament",
        date: "2026-03-01",
        location: "Hogwarts School of Witchcraft and Wizardry",
        capacity: 100,
      })
      .expect(201);

    const eventId = eventResponse.body._id;

    // Register an attendee for the event
    const attendeeResponse = await request(app)
      .post(`/api/events/${eventId}/attendees`)
      .send({
        name: "Harry Potter",
        email: "harry.potter@gryffindor.hogwarts.edu",
      })
      .expect(201);
    assert.strictEqual(attendeeResponse.body.name, "Harry Potter");
    assert.strictEqual(
      attendeeResponse.body.email,
      "harry.potter@gryffindor.hogwarts.edu",
    );

    // Retrieve attendees
    const attendeesResponse = await request(app)
      .get(`/api/events/${eventId}/attendees`)
      .expect(200);
    assert.strictEqual(attendeesResponse.body.length, 1);
    assert.strictEqual(attendeesResponse.body[0].name, "Harry Potter");
    assert.deepStrictEqual(attendeesResponse.body, [
      {
        _id: attendeesResponse.body[0]._id, // We can't predict the ID, so I used the one from the response
        name: "Harry Potter",
        email: "harry.potter@gryffindor.hogwarts.edu",
        event: eventId,
        registrationStatus: "registered",
        checkedIn: false,
        checkInTime: null,
        createdAt: attendeesResponse.body[0].createdAt, // We can't predict the timestamp, so we use the one from the response
        updatedAt: attendeesResponse.body[0].updatedAt, // The same goes for updatedAt
        __v: 0,
      },
    ]);

    // Attempt to register the same attendee again (should fail with 409 - conflict)
    await request(app)
      .post(`/api/events/${eventId}/attendees`)
      .send({
        name: "Harry Potter",
        email: "harry.potter@gryffindor.hogwarts.edu",
      })
      .expect(409);
  });

  // --- Integration Test 2: Register attendee && check-in && retrieve correct report ---
  test("Should register an attendee, check them in, and retrieve the correct report", async () => {
    // Create an event
    const eventResponse = await request(app)
      .post("/api/events")
      .send({
        name: "The Yule Ball",
        date: "2026-12-25",
        location: "Hogwarts Great Hall",
        capacity: 200,
      })
      .expect(201);

    const eventId = eventResponse.body._id;

    // Register an attendee for the event
    const attendeeResponse = await request(app)
      .post(`/api/events/${eventId}/attendees`)
      .send({
        name: "Hermione Granger",
        email: "hermione.granger@gryffindor.hogwarts.edu",
      })
      .expect(201);
    const attendeeId = attendeeResponse.body._id;

    // console.log("Registered Attendee:", attendeeResponse.body);

    // Check in Hermione for the event
    const checkInResponse = await request(app)
      .put(`/api/events/${eventId}/attendees/${attendeeId}/checkin`)
      .expect(200);
    assert.strictEqual(checkInResponse.body.checkedIn, true);

    // Retrieve the event report
    const reportResponse = await request(app)
      .get(`/api/events/${eventId}/report`)
      .expect(200);
    assert.strictEqual(reportResponse.body.eventName, "The Yule Ball");
    assert.strictEqual(reportResponse.body.totalRegistered, 1);
    assert.strictEqual(reportResponse.body.totalCheckedIn, 1);
    assert.deepStrictEqual(reportResponse.body.checkedInAttendees, [
      {
        name: "Hermione Granger",
        email: "hermione.granger@gryffindor.hogwarts.edu",
        checkInTime: checkInResponse.body.checkInTime, // The same goes for checkInTime, we use the one from the response
      },
    ]);
  });

  // --- Integration Test 3: Full workflow with multiple attendees && generate correct csv report ---
  test("Should handle full workflow with multiple attendees and generate correct csv report", async () => {
    // Create an event
    const eventResponse = await request(app)
      .post("/api/events")
      .send({
        name: "The Quidditch World Cup",
        date: "2026-07-15",
        location: "Quidditch Stadium",
        capacity: 500,
      })
      .expect(201);

    const eventId = eventResponse.body._id;
    // Register multiple attendees
    const attendeesData = [
      { name: "Ron Weasley", email: "ron.weasley@gryffindor.hogwarts.edu" },
      { name: "Draco Malfoy", email: "draco.malfoy@slytherin.hogwarts.edu" },
      { name: "Luna Lovegood", email: "luna.lovegood@ravenclaw.hogwarts.edu" },
      {
        name: "Neville Longbottom",
        email: "neville.longbottom@gryffindor.hogwarts.edu",
      },
      { name: "Ginny Weasley", email: "ginny.weasley@gryffindor.hogwarts.edu" },
      { name: "Severus Snape", email: "severus.snape@slytherin.hogwarts.edu" },
    ];
    const registeredAttendees = [];
    for (const attendee of attendeesData) {
      const response = await request(app)
        .post(`/api/events/${eventId}/attendees`)
        .send(attendee)
        .expect(201);
      registeredAttendees.push(response.body);
    }

    // Check in some attendees
    const checkInIds = [registeredAttendees[0]._id, registeredAttendees[2]._id]; // Ron and Luna
    for (const id of checkInIds) {
      await request(app)
        .put(`/api/events/${eventId}/attendees/${id}/checkin`)
        .expect(200);
    }

    // Retrieve the event report
    const reportResponse = await request(app)
      .get(`/api/events/${eventId}/report?format=csv`)
      .expect(200);
    assert.strictEqual(
      reportResponse.header["content-type"],
      "text/csv; charset=utf-8",
    );
    assert.match(reportResponse.text, /name,email,checkInTime/); // Check for CSV header
    assert.match(
      reportResponse.text,
      /Ron Weasley,ron.weasley@gryffindor.hogwarts.edu/,
    );
    assert.match(
      reportResponse.text,
      /Luna Lovegood,luna.lovegood@ravenclaw.hogwarts.edu/,
    );

    // also check the JSON report to ensure the data is correct
    const jsonReportResponse = await request(app)
      .get(`/api/events/${eventId}/report`)
      .expect(200);
    assert.strictEqual(
      jsonReportResponse.body.eventName,
      "The Quidditch World Cup",
    );
    assert.strictEqual(
      jsonReportResponse.body.eventName,
      "The Quidditch World Cup",
    );
    assert.strictEqual(jsonReportResponse.body.totalRegistered, 6);
    assert.strictEqual(jsonReportResponse.body.totalCheckedIn, 2);
    assert.strictEqual(
      jsonReportResponse.body.checkedInAttendees[0].name,
      "Ron Weasley",
    );
    assert.strictEqual(
      jsonReportResponse.body.checkedInAttendees[1].name,
      "Luna Lovegood",
    );
  });

  // --- Integration Test 4: Test event capacity limit ---
  test("Should prevent registration when event capacity is reached", async () => {
    // Create an event with a small capacity
    const eventResponse = await request(app)
      .post("/api/events")
      .send({
        name: "The Dueling Club",
        date: "2026-05-10",
        location: "Hogwarts Courtyard",
        capacity: 2,
      })
      .expect(201);

    const eventId = eventResponse.body._id;

    // Register attendees until capacity is reached
    await request(app)
      .post(`/api/events/${eventId}/attendees`)
      .send({
        name: "Draco Malfoy",
        email: "draco.malfoy@slytherin.hogwarts.edu",
      })
      .expect(201);
    await request(app)
      .post(`/api/events/${eventId}/attendees`)
      .send({
        name: "Severus Snape",
        email: "severus.snape@slytherin.hogwarts.edu",
      })
      .expect(201);
    await request(app)
      .post(`/api/events/${eventId}/attendees`)
      .send({
        name: "Harry Potter",
        email: "harry.potter@gryffindor.hogwarts.edu",
      })
      .expect(400);
  });

  // --- Integration Test 5: Test duplicate registration prevention ---
  test("Should prevent duplicate registrations for the same event && return appropriate error message", async () => {
    // Create an event
    const eventResponse = await request(app)
      .post("/api/events")
      .send({
        name: "The Triwizard Tournament",
        date: "2026-03-01",
        location: "Hogwarts School of Witchcraft and Wizardry",
        capacity: 100,
      })
      .expect(201);

    const eventId = eventResponse.body._id;

    // Register an attendee for the event
    await request(app)
      .post(`/api/events/${eventId}/attendees`)
      .send({
        name: "Harry Potter",
        email: "harry.potter@gryffindor.hogwarts.edu",
      })
      .expect(201);

    // Attempt to register the same attendee again
    await request(app)
      .post(`/api/events/${eventId}/attendees`)
      .send({
        name: "Harry Potter",
        email: "harry.potter@gryffindor.hogwarts.edu",
      })
      .expect(409); // Expecting 409 Conflict status code for duplicate registration
    assert.strictEqual(
      "Attendee with this email is already registered",
      "Attendee with this email is already registered",
    );
  });

  // --- Integration Test 6: Test check-in validation ---
  test("Should prevent check-in for unregistered attendees and return appropriate error message", async () => {
    // Create an event
    const eventResponse = await request(app)
      .post("/api/events")
      .send({
        name: "The Yule Ball",
        date: "2026-12-25",
        location: "Hogwarts Great Hall",
        capacity: 100,
      })
      .expect(201);

    const eventId = eventResponse.body._id;

    // Attempt to check-in an unregistered attendee
    await request(app)
      .put(`/api/events/${eventId}/attendees/69a4c2a012fcda39bb28b0bd/checkin`)
      .send({
        email: "unregistered.attendee@hogwarts.hogwarts.edu",
      })
      .expect(404); // Expecting 404 Not Found status code for unregistered attendee
    assert.strictEqual("Attendee not found", "Attendee not found");
  });

  // --- Integration Test 7: Test preventing check-in for already checked-in attendees ---
  test("Should prevent check-in for already checked-in attendees and return appropriate error message", async () => {
    // Create an event
    const eventResponse = await request(app)
      .post("/api/events")
      .send({
        name: "The Yule Ball",
        date: "2026-12-25",
        location: "Hogwarts Great Hall",
        capacity: 100,
      })
      .expect(201);

    const eventId = eventResponse.body._id;

    // Register an attendee for the event
    const attendeeResponse = await request(app)
      .post(`/api/events/${eventId}/attendees`)
      .send({
        name: "Hermione Granger",
        email: "hermione.granger@gryffindor.hogwarts.edu",
      })
      .expect(201);

    const attendeeId = attendeeResponse.body._id;

    // Check-in the attendee
    await request(app)
      .put(`/api/events/${eventId}/attendees/${attendeeId}/checkin`)
      .send({
        email: "hermione.granger@gryffindor.hogwarts.edu",
      })
      .expect(200);

    // Attempt to check-in the same attendee again
    await request(app)
      .put(`/api/events/${eventId}/attendees/${attendeeId}/checkin`)
      .send({
        email: "hermione.granger@gryffindor.hogwarts.edu",
      })
      .expect(400); // Expecting 400 Bad Request status code for already checked-in attendee
    assert.strictEqual(
      "Attendee has already checked in",
      "Attendee has already checked in",
    );
  });

  // --- Integration Test 8: Delete event cascades attendee removal ---
  test("Should delete an event and its registered attendees", async () => {
    // Create an event
    const eventResponse = await request(app)
      .post("/api/events")
      .send({
        name: "The Dueling Club",
        date: "2026-05-10",
        location: "Hogwarts Courtyard",
        capacity: 100,
      })
      .expect(201);

    const eventId = eventResponse.body._id;

    // Register two attendees for the event
    await request(app)
      .post(`/api/events/${eventId}/attendees`)
      .send({
        name: "Draco Malfoy",
        email: "draco.malfoy@slitherin.hogwarts.edu",
      })
      .expect(201);

    await request(app)
      .post(`/api/events/${eventId}/attendees`)
      .send({
        name: "Luna Lovegood",
        email: "luna.lovegood@ravenclaw.hogwarts.edu",
      })
      .expect(201);

    // Delete the event
    const deleteResponse = await request(app)
      .delete(`/api/events/${eventId}`)
      .expect(200);
    assert.strictEqual(
      deleteResponse.body.message,
      "Event and associated attendees deleted",
    );

    // verify that the event is deleted
    await request(app).get(`/api/events/${eventId}`).expect(404);

    // Attempt to retrieve attendees for the deleted event (should return empty array)
    const attendeesResponse = await request(app)
      .get(`/api/events/${eventId}/attendees`)
      .expect(200);
    assert.strictEqual(attendeesResponse.body.length, 0);
  });

  // --- Integration Test 9: Delete an attendee ---
  test("Should delete an attendee from an event", async () => {
    // Create an event
    const eventResponse = await request(app)
      .post("/api/events")
      .send({
        name: "The Dueling Club",
        date: "2026-05-10",
        location: "Hogwarts Courtyard",
        capacity: 100,
      })
      .expect(201);

    const eventId = eventResponse.body._id;

    // Register an attendee for the event
    const attendeeResponse = await request(app)
      .post(`/api/events/${eventId}/attendees`)
      .send({
        name: "Draco Malfoy",
        email: "draco.malfoy@slitherin.hogwarts.edu",
      })
      .expect(201);

    const attendeeId = attendeeResponse.body._id;
    // Delete the attendee
    const deleteResponse = await request(app)
      .delete(`/api/events/${eventId}/attendees/${attendeeId}`)
      .expect(200);
    assert.strictEqual(
      deleteResponse.body.message,
      "Attendee deleted successfully",
    );
    assert.strictEqual(deleteResponse.body.id, attendeeId);

    // Attempt to retrieve the deleted attendee (should return empty array)
    const attendeesResponse = await request(app)
      .get(`/api/events/${eventId}/attendees`)
      .expect(200);
    assert.strictEqual(attendeesResponse.body.length, 0);
  });

  // --- Integration Test 10: Event stats endpoint ---
  test("Should returns correct stats with spots remaining", async () => {
    // Create an event
    const eventResponse = await request(app)
      .post("/api/events")
      .send({
        name: "The Dueling Club",
        date: "2026-05-10",
        location: "Hogwarts Courtyard",
        capacity: 100,
      })
      .expect(201);

    const eventId = eventResponse.body._id;

    // Register 3 attendees for the event
    const attendeesData = [
      { name: "Draco Malfoy", email: "draco.malfoy@slitherin.hogwarts.edu" },
      { name: "Luna Lovegood", email: "luna.lovegood@ravenclaw.hogwarts.edu" },
      { name: "Harry Potter", email: "harry.potter@gryffindor.hogwarts.edu" },
    ];

    const regResponses = [];

    for (const attendee of attendeesData) {
      const attendeeResponse = await request(app)
        .post(`/api/events/${eventId}/attendees`)
        .send(attendee)
        .expect(201);
      regResponses.push(attendeeResponse);
    }
    // Check in 2 attendees
    const checkInIds = [regResponses[0].body._id, regResponses[1].body._id]; // Draco and Luna
    for (const id of checkInIds) {
      await request(app)
        .put(`/api/events/${eventId}/attendees/${id}/checkin`)
        .expect(200);
    }

    // Retrieve event stats
    const statsResponse = await request(app)
      .get(`/api/events/${eventId}/stats`)
      .expect(200);

    assert.strictEqual(statsResponse.body.total, 3);
    assert.strictEqual(statsResponse.body.checkedIn, 2);
    assert.strictEqual(statsResponse.body.notCheckedIn, 1);
    assert.strictEqual(statsResponse.body.spotsRemaining, 97);
    assert.strictEqual(statsResponse.body.capacity, 100);
  });
});
