import Event from "../models/Event.js";
import Attendee from "../models/Attendee.js";
import { summarizeAttendees } from "../utils/helpers.js";
// Event Controller
const eventController = {
  // --- Event CRUD Operations ---
  createEvent: async (request, response) => {
    try {
      const { name, date, location, description, capacity } = request.body;
      const newEvent = new Event({
        name,
        date,
        location,
        description,
        capacity,
      });
      await newEvent.save();
      response.status(201).json(newEvent);
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
  },

  // Get all events
  getAllEvents: async (request, response) => {
    try {
      const events = await Event.find().sort({ date: -1 }).lean(); // I used .lean() to get plain JS objects for easier manipulation

      // attach attendee count + summary to each event
      const enriched = await Promise.all(
        events.map(async (ev) => {
          const attendees = await Attendee.find({ event: ev._id }).lean();
          // console.log(`Event: ${ev.name}, Attendees:`, attendees);
          const summary = summarizeAttendees(attendees);
          // console.log(`Event: ${ev.name}, Attendee Summary:`, summary);
          return {
            ...ev,
            attendeeCount: summary.total,
            checkedInCount: summary.checkedIn,
          };
        }),
      );
      response.status(200).json(enriched);
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  },

  // Get event by ID
  getEventById: async (request, response) => {
    const { id } = request.params;
    try {
      const event = await Event.findById(id);
      if (!event) {
        return response.status(404).json({ error: "Event not found" });
      }
      response.status(200).json(event);
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  },

  // --- delete event and all associated attendees ---
  deleteEvent: async (request, response) => {
    const { id } = request.params;
    if (!id) {
      return response.status(400).json({ error: "Event ID is required" });
    }
    try {
      const event = await Event.findByIdAndDelete(id);
      if (!event) {
        return response.status(404).json({ error: "Event not found" });
      }
      await Attendee.deleteMany({ event: id });
      response.status(200).json({
        message: "Event and associated attendees deleted",
        eventId: id,
      });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  },

  // --- Get event statistics ---
  getEventStats: async (request, response) => {
    const { eventId } = request.params;
    if (!eventId) {
      return response.status(400).json({ error: "Event ID is required" });
    }
    try {
      const event = await Event.findById(eventId).lean();
      if (!event) {
        return response.status(404).json({ error: "Event not found" });
      }
      const attendees = await Attendee.find({ event: eventId }).lean();
      const summary = summarizeAttendees(attendees);
      response.status(200).json({
        eventName: event.name,
        capacity: event.capacity,
        ...summary,
        spotsRemaining: Math.max(0, event.capacity - summary.total),
      });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  },

  // --- Attendee Management ---
};

export default eventController;
