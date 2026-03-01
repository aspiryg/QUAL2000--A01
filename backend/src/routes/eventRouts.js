import express from "express";
import eventController from "../controllers/eventController.js";

const router = express.Router();

//Event Routes
router.post("/events", eventController.createEvent);
router.get("/events", eventController.getAllEvents);
router.get("/events/:id", eventController.getEventById);
router.delete("/events/:id", eventController.deleteEvent);

// ---- Report && Statistics Route ----
router.get("/events/:eventId/stats", eventController.getEventStats);

export default router;
