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
  registerAttendee: async (request, response) => {
    try {
      const { name, email } = request.body;
      const { eventId } = request.params;

      // console.log("Registering attendee:", { name, email, eventId });

      // Validate input
      if (!name || !email) {
        return response
          .status(400)
          .json({ error: "Name and email are requestuired" });
      }

      // is valid email
      if (!isValidEmailFormat(email)) {
        return response.status(400).json({ error: "Invalid email format" });
      }
      const event = await Event.findById(eventId);
      if (!event) {
        return response.status(404).json({ error: "Event not found" });
      }

      // I mean I could have done this without using the helper function, this just for the unit tests purpose
      // Check if attendee is already registered for the event
      const existingAttendees = await Attendee.find({ event: eventId });
      if (isDuplicateRegistration(existingAttendees, email, eventId)) {
        return response
          .status(409)
          .json({ error: "Attendee with this email is already registered" });
      }

      // Check if event capacity is reached
      if (capacityExceeded(existingAttendees.length, event.capacity)) {
        return response
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
      response.status(201).json(newAttendee);
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
  },

  // get attendees for an event
  getAttendeesByEvent: async (request, response) => {
    try {
      const { eventId } = request.params;
      const attendees = await Attendee.find({ event: eventId });
      response.status(200).json(attendees);
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  },

  // ---- delete an attendee (not required but I thought it would be useful for testing purposes) ----
  deleteAttendee: async (request, response) => {
    const { eventId, attendeeId } = request.params;
    if (!eventId || !attendeeId) {
      return response
        .status(400)
        .json({ error: "Event ID and Attendee ID are required" });
    }
    try {
      const attendee = await Attendee.findOneAndDelete({
        _id: attendeeId,
        event: eventId,
      });
      if (!attendee) {
        return response
          .status(404)
          .json({ error: "Attendee not found for this event" });
      }
      return response
        .status(200)
        .json({ message: "Attendee deleted successfully", id: attendeeId });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  },

  // ----- Check-in Management -----
  checkInAttendee: async (request, response) => {
    const { attendeeId, eventId } = request.params;
    try {
      const attendee = await Attendee.findOne({
        _id: attendeeId,
        event: eventId,
      });
      if (!attendee) {
        return response
          .status(404)
          .json({ error: "Attendee not found for this event" });
      }
      const checkInStatus = canCheckIn(attendee);
      if (!checkInStatus.allowed) {
        return response.status(400).json({ error: checkInStatus.reason });
      }

      attendee.checkedIn = true;
      attendee.checkInTime = new Date();
      await attendee.save();
      response.status(200).json(attendee);
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  },

  // --- Reporting ---
  getEventReport: async (request, response) => {
    const { eventId } = request.params;
    try {
      if (!eventId) {
        return response.status(400).json({ error: "Event ID is required" });
      }
      const event = await Event.findById(eventId);
      if (!event) {
        return response.status(404).json({ error: "Event not found" });
      }
      const attendees = await Attendee.find({ event: eventId });
      const report = buildReport(event, attendees);
      const format = request.query.format || "json";

      // documentation for json2csv: https://www.npmjs.com/package/json-2-csv
      // if the client requests CSV format, convert the checked-in attendees to CSV and send as a file download
      if (format === "csv") {
        const csv = json2csv(report.checkedInAttendees, {
          keys: ["name", "email", "checkInTime"],
        });
        response.header("Content-Type", "text/csv");
        response.attachment(`${event.name}-report.csv`);
        return response.send(csv);
      }
      // default to JSON response
      return response.status(200).json(report);
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  },
};

export default attendeeController;
