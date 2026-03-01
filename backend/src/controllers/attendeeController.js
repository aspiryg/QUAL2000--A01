import Attendee from "../models/Attendee.js";
import Event from "../models/Event.js";
import {
  canCheckIn,
  buildReport,
  isValidEmailFormat,
  isDuplicateRegistration,
  capacityExceeded,
} from "../utils/helpers.js";
import { json2csv } from "json-2-csv";

const attendeeController = {
  // --- Attendee Management ---
  registerAttendee: async (req, res) => {
    try {
      const { name, email } = req.body;
      const { eventId } = req.params;

      // console.log("Registering attendee:", { name, email, eventId });

      // Validate input
      if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
      }

      // is valid email
      if (!isValidEmailFormat(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Check if attendee is already registered for the event
      const existingAttendees = await Attendee.find({ event: eventId });
      if (isDuplicateRegistration(existingAttendees, email)) {
        return res
          .status(409)
          .json({ error: "Attendee with this email is already registered" });
      }

      // Check if event capacity is reached
      if (capacityExceeded(existingAttendees.length, event.capacity)) {
        return res
          .status(400)
          .json({ error: "Event capacity has been reached" });
      }

      // Create new attendee
      const newAttendee = new Attendee({
        name,
        email: email,
        event: eventId,
      });

      // console.log("Saving new attendee:", newAttendee);
      await newAttendee.save();
      res.status(201).json(newAttendee);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // get attendees for an event
  getAttendeesByEvent: async (req, res) => {
    try {
      const { eventId } = req.params;
      const attendees = await Attendee.find({ event: eventId });
      res.status(200).json(attendees);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // ----- Check-in Management -----
  checkInAttendee: async (req, res) => {
    const { attendeeId, eventId } = req.params;
    try {
      const attendee = await Attendee.findOne({
        _id: attendeeId,
        event: eventId,
      });
      if (!attendee) {
        return res
          .status(404)
          .json({ error: "Attendee not found for this event" });
      }
      const checkInStatus = canCheckIn(attendee);
      if (!checkInStatus.allowed) {
        return res.status(400).json({ error: checkInStatus.reason });
      }

      attendee.checkedIn = true;
      attendee.checkInTime = new Date();
      await attendee.save();
      res.status(200).json(attendee);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // --- Reporting ---
  getEventReport: async (req, res) => {
    const { eventId } = req.params;
    try {
      if (!eventId) {
        return res.status(400).json({ error: "Event ID is required" });
      }
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      const attendees = await Attendee.find({ event: eventId });
      const report = buildReport(event, attendees);
      const format = req.query.format || "json";

      if (format === "csv") {
        const csv = json2csv(report.checkedInAttendees, {
          keys: ["name", "email", "checkInTime"],
        });
        res.header("Content-Type", "text/csv");
        res.attachment(`${event.name}-report.csv`);
        return res.send(csv);
      }
      return res.status(200).json(report);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default attendeeController;
