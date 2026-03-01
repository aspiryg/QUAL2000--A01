import Event from "../models/Event.js";

// Event Controller
const eventController = {
  // --- Event CRUD Operations ---
  createEvent: async (req, res) => {
    try {
      const { name, date, location, description, capacity } = req.body;
      const newEvent = new Event({
        name,
        date,
        location,
        description,
        capacity,
      });
      await newEvent.save();
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get all events
  getAllEvents: async (req, res) => {
    try {
      const events = await Event.find().sort({ date: -1 });
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get event by ID
  getEventById: async (req, res) => {
    const { id } = req.params;
    try {
      const event = await Event.findById(id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // --- Attendee Management ---
};

export default eventController;
