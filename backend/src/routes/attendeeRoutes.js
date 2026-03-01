import attendeeController from "../controllers/attendeeController.js";
import express from "express";

const router = express.Router();

// Attendee Routes
router.post("/events/:eventId/attendees", attendeeController.registerAttendee);
router.get(
  "/events/:eventId/attendees",
  attendeeController.getAttendeesByEvent,
);
router.delete(
  "/events/:eventId/attendees/:attendeeId",
  attendeeController.deleteAttendee,
);

// Check-in route
router.put(
  "/events/:eventId/attendees/:attendeeId/checkin",
  attendeeController.checkInAttendee,
);

// Reporting route
router.get("/events/:eventId/report", attendeeController.getEventReport);

export default router;
