import express from "express";
import eventController from "../controllers/eventController.js";

const router = express.Router();

//Event Routes
router.post("/events", eventController.createEvent);
router.get("/events", eventController.getAllEvents);
router.get("/events/:id", eventController.getEventById);

export default router;
