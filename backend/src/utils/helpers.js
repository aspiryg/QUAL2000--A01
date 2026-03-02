/* ---- Helpers that will be used for the unit tests ---- */

/**
 * Checks if the provided email is in a valid format.
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmailFormat = (email) => {
  if (!email || typeof email !== "string") {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // console.log(
  //   email,
  //   "is valid email format?",
  //   emailRegex.test(email.trim().toLowerCase()),
  // );
  return emailRegex.test(email.trim().toLowerCase());
};

/**
 * Checks if the current capacity of a given event has exceeded the maximum allowed capacity.
 * @param {*} current
 * @param {*} max
 * @returns {boolean}
 */
export const capacityExceeded = (current, max) => {
  if (typeof current !== "number" || typeof max !== "number") {
    throw new Error("Both current and max should be numbers");
  }
  return current >= max;
};

/**
 * Checks if a given email is already registered for an event.
 * @param {Array} attendees
 * @param {string} email
 * @returns {boolean}
 */
export const isDuplicateRegistration = (attendees, email, eventId) => {
  if (!email || typeof email !== "string") {
    throw new Error("Email should be a non-empty string");
  }
  if (!Array.isArray(attendees)) {
    throw new Error("Attendees should be an array");
  }
  // console.log(
  //   "Checking for duplicate registration with email:",
  //   email,
  //   "and eventId:",
  //   eventId,
  // );

  const normalizedEmail = email.trim().toLowerCase();

  return attendees.some(
    (a) => a.email === normalizedEmail && a.event.toString() === eventId,
  );
};

/**
 * Checks if an attendee can check in based on their registration status and whether they have already checked in.
 * @param {Object} attendee
 * @returns {Object} An object containing 'allowed' (boolean) and 'reason' (string) properties.
 */
export const canCheckIn = (attendee) => {
  if (!attendee || typeof attendee !== "object") {
    throw new Error("Attendee should be an object");
  }
  if (
    !attendee.registrationStatus ||
    attendee.registrationStatus !== "registered"
  ) {
    return {
      allowed: false,
      reason: "Attendee is not registered for the event",
    };
  }
  if (attendee.checkedIn) {
    return {
      allowed: false,
      reason: "Attendee has already checked in",
    };
  }
  return {
    allowed: true,
    reason: "Attendee can check in",
  };
};

/**
 * Builds a report for a given event and its attendees.
 * @param {Object} event - The event object.
 * @param {Array} attendees - The array of attendee objects.
 * @returns {{
 *   eventName: string,
 *   eventDate: string,
 *   totalRegistered: number,
 *   totalCheckedIn: number,
 *   checkedInAttendees: Array,
 *   registrationStatusCounts: Object
 * }} The report object containing event and attendee information.
 */
export const buildReport = (event, attendees) => {
  if (!event || typeof event !== "object") {
    throw new Error("Event should be an object");
  }
  if (!Array.isArray(attendees)) {
    throw new Error("Attendees should be an array");
  }
  const checkedIn = attendees.filter((a) => a.checkedIn);
  const totalRegistered = attendees.filter(
    (a) => a.registrationStatus === "registered",
  ).length;
  return {
    eventName: event.name,
    eventDate: event.date,
    totalRegistered: totalRegistered,
    totalCheckedIn: checkedIn.length,
    checkedInAttendees: checkedIn.map((a) => ({
      name: a.name,
      email: a.email,
      checkInTime: a.checkInTime,
    })),
    registrationStatusCounts: attendees.reduce((acc, attendee) => {
      acc[attendee.registrationStatus] =
        (acc[attendee.registrationStatus] || 0) + 1;
      return acc;
    }, {}),
  };
};

/**
 * Formats an event date string into a human-readable format (YYYY-MM-DD).
 * Returns 'Invalid date' for bad inputs.
 * @param {string|Date} dateInput
 * @returns {string}
 */
export const formatEventDate = (dateInput) => {
  if (!dateInput) return "Invalid date";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Invalid date";
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Calculates the percentage of attendees who have checked in for an event.
 * Returns 0 if totalRegistered is 0 or negative, or if checkedIn is negative.
 * @param {number} checkedIn
 * @param {number} totalRegistered
 * @returns {number} percentage rounded to one decimal place
 */
export const getCheckInPercentage = (checkedIn, totalRegistered) => {
  if (typeof checkedIn !== "number" || typeof totalRegistered !== "number") {
    throw new Error("Both checkedIn and totalRegistered should be numbers");
  }
  if (!totalRegistered || totalRegistered <= 0) return 0;
  if (checkedIn < 0) return 0;
  return Math.round((checkedIn / totalRegistered) * 1000) / 10;
};

/**
 * Sorts an array of attendees alphabetically by their name property.
 * returns a new sorted array without mutating the original attendees array.
 * @param {Array} attendees
 * @returns {Array} A new array of attendees sorted by name.
 */
export const sortAttendeesByName = (attendees) => {
  if (!Array.isArray(attendees)) {
    throw new Error("Attendees should be an array");
  }
  return [...attendees].sort((a, b) =>
    (a.name || "").toLowerCase().localeCompare((b.name || "").toLowerCase()),
  );
};

/**
 * Summarizes the check-in status of attendees.
 * @param {Array} attendees
 * @returns {{total: number, checkedIn: number, notCheckedIn: number, rate: number}}
 */
export const summarizeAttendees = (attendees) => {
  if (!Array.isArray(attendees)) {
    throw new Error("Attendees should be an array");
  }
  if (attendees.length === 0) {
    return { total: 0, checkedIn: 0, notCheckedIn: 0, rate: 0 };
  }
  const checkedIn = attendees.filter((a) => a.checkedIn).length;
  const total = attendees.length;
  return {
    total,
    checkedIn,
    notCheckedIn: total - checkedIn,
    rate: getCheckInPercentage(checkedIn, total),
  };
};
