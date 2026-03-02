import test from "node:test";
import assert from "node:assert/strict";

// I decided to use Jest for testing instead of the built-in node test module, just for learning purposes.
import {
  isValidEmailFormat,
  capacityExceeded,
  isDuplicateRegistration,
  canCheckIn,
  buildReport,
  formatEventDate,
  getCheckInPercentage,
  sortAttendeesByName,
  summarizeAttendees,
} from "../../utils/helpers.js";

// --- 1. Test isValidEmailFormat ---
// ─── 1. Email validation ─────────────────────────────────────────────────

test.describe("Test isValidEmailFormat function", () => {
  test("should return true for valid email formats", () => {
    assert.strictEqual(isValidEmailFormat("harry.potter@gryffindor.com"), true);
    assert.strictEqual(
      isValidEmailFormat("HERMIONE.GRANGER@GRYFFINDOR.COM"),
      true,
    );
    assert.strictEqual(
      isValidEmailFormat("draco.malfoy+hisFatherLuciusMalfoy@slytherin.com"),
      true,
    );
  });

  test("The function should reject email addresses without @ symbol", () => {
    assert.strictEqual(isValidEmailFormat("nevilllongbottom"), false);
    assert.strictEqual(isValidEmailFormat("hufflepuff.com"), false);
  });

  test("The function should reject email addresses without domain", () => {
    assert.strictEqual(isValidEmailFormat("nevill.longbottom@"), false);
    assert.strictEqual(isValidEmailFormat("seamus.finnigan@.com"), false);
  });
  test("The function should reject empty string and non-string inputs", () => {
    assert.strictEqual(isValidEmailFormat(""), false);
    assert.strictEqual(isValidEmailFormat(null), false);
    assert.strictEqual(isValidEmailFormat(undefined), false);
    assert.strictEqual(isValidEmailFormat(12345), false);
  });
  test("The function should trim whitespace and convert to lowercase before validation", () => {
    assert.strictEqual(
      isValidEmailFormat(" HARRY.POTTER@GRYFFINDOR.COM "),
      true,
    );
    assert.strictEqual(
      isValidEmailFormat(" hermione.granger@GRYFFINDOR.COM "),
      true,
    );
  });
});

// ─── 2. Capacity check ─────────────────────────────────────────────────

test.describe("Test capacityExceeded function", () => {
  test("should return true when current capacity is equal to max capacity", () => {
    assert.strictEqual(capacityExceeded(100, 100), true);
  });

  test("should return true when current capacity exceeds max capacity", () => {
    assert.strictEqual(capacityExceeded(101, 100), true);
  });

  test("should return false when current capacity is less than max capacity", () => {
    assert.strictEqual(capacityExceeded(99, 100), false);
  });

  test("should throw an error if inputs are not numbers", () => {
    assert.throws(
      () => capacityExceeded("100", "100"),
      /Both current and max should be numbers/,
    );
    assert.throws(
      () => capacityExceeded(null, null),
      /Both current and max should be numbers/,
    );
    assert.throws(
      () => capacityExceeded(undefined, undefined),
      /Both current and max should be numbers/,
    );
  });
});

// ─── 3. Duplicate registration check ─────────────────────────────────────────────────

test.describe("Test isDuplicateRegistration function", () => {
  const eventId = "event123";
  const attendees = [
    { email: "harry.potter@gryffindor.com", event: eventId },
    { email: "hermione.granger@gryffindor.com", event: eventId },
    { email: "draco.malfoy@slytherin.com", event: eventId },
  ];

  test("The function should return true if email is already registered", () => {
    assert.strictEqual(
      isDuplicateRegistration(
        attendees,
        "harry.potter@gryffindor.com",
        eventId,
      ),
      true,
    );
  });

  test("The function should return false if email is not registered", () => {
    assert.strictEqual(
      isDuplicateRegistration(
        attendees,
        "collin.Creevey@gryffindor.com",
        eventId,
      ),
      false,
    );
  });
  test("The function should return false if email is registered for a different event", () => {
    const differentEventId = "event456";
    assert.strictEqual(
      isDuplicateRegistration(
        attendees,
        "harry.potter@gryffindor.com",
        differentEventId,
      ),
      false,
    );
  });

  test("The function should handle case-insensitive email comparison", () => {
    assert.strictEqual(
      isDuplicateRegistration(
        attendees,
        "HARRY.POTTER@GRYFFINDOR.COM",
        eventId,
      ),
      true,
    );
  });

  test("The function should be able to handle empty attendees array", () => {
    assert.strictEqual(
      isDuplicateRegistration([], "hermione.granger@gryffindor.com", eventId),
      false,
    );
  });

  test("The function should throw an error if email is not a non-empty string", () => {
    assert.throws(
      () => isDuplicateRegistration(attendees, "", eventId),
      /Email should be a non-empty string/,
    );
    assert.throws(
      () => isDuplicateRegistration(attendees, null, eventId),
      /Email should be a non-empty string/,
    );
    assert.throws(
      () => isDuplicateRegistration(attendees, undefined, eventId),
      /Email should be a non-empty string/,
    );
    assert.throws(
      () => isDuplicateRegistration(attendees, 12345, eventId),
      /Email should be a non-empty string/,
    );
  });

  test("The function should throw an error if attendees is not an array", () => {
    assert.throws(
      () =>
        isDuplicateRegistration(
          { email: "harry.potter@gryffindor.com", event: eventId },
          "harry.potter@gryffindor.com",
          eventId,
        ),
      /Attendees should be an array/,
    );
    assert.throws(
      () =>
        isDuplicateRegistration(null, "harry.potter@gryffindor.com", eventId),
      /Attendees should be an array/,
    );
    assert.throws(
      () =>
        isDuplicateRegistration(
          undefined,
          "harry.potter@gryffindor.com",
          eventId,
        ),
      /Attendees should be an array/,
    );
    assert.throws(
      () =>
        isDuplicateRegistration(
          "not an array",
          "harry.potter@gryffindor.com",
          eventId,
        ),
      /Attendees should be an array/,
    );
  });
});

// --- 4. Check-in eligibility check ─────────────────────────────────────────────────
test.describe("Test canCheckIn function", () => {
  test("The function should return true if attendee is registered and has not checked in", () => {
    const attendee = {
      name: "Harry Potter",
      email: "harry.potter@gryffindor.com",
      registrationStatus: "registered",
      checkedIn: false,
    };
    assert.deepStrictEqual(canCheckIn(attendee), {
      allowed: true,
      reason: "Attendee can check in",
    });
  });

  test("The function should return false if attendee is not registered", () => {
    const attendee = {
      name: "Draco Malfoy",
      email: "draco.malfoy@slytherin.com",
      registrationStatus: "cancelled",
      checkedIn: false,
    };
    assert.deepStrictEqual(canCheckIn(attendee), {
      allowed: false,
      reason: "Attendee is not registered for the event",
    });
  });

  test("The function should return false if attendee has already checked in", () => {
    const attendee = {
      name: "Luna Lovegood",
      email: "luna.lovegood@ravenclaw.com",
      registrationStatus: "registered",
      checkedIn: true,
    };
    assert.deepStrictEqual(canCheckIn(attendee), {
      allowed: false,
      reason: "Attendee has already checked in",
    });
  });

  test("The function should throw an error if attendee is not an object", () => {
    assert.throws(() => canCheckIn(null), /Attendee should be an object/);
    assert.throws(() => canCheckIn(undefined), /Attendee should be an object/);
    assert.throws(
      () => canCheckIn("not an object"),
      /Attendee should be an object/,
    );
    assert.throws(() => canCheckIn(12345), /Attendee should be an object/);
  });
});

// --- 5. Build report function ─────────────────────────────────────────────────
// (Tests for buildReport function would go here, but I'm skipping it for now since it's more complex and I want to focus on the simpler helper functions first)
test.describe("Test buildReport function", () => {
  const event = {
    name: "Workshop",
    date: "2026-03-01",
  };
  const attendees = [
    {
      name: "Harry Potter",
      email: "harry.potter@gryffindor.com",
      checkedIn: true,
      checkInTime: new Date("2026-03-01T10:00:00Z"),
      registrationStatus: "registered",
    },
    {
      name: "Hermione Granger",
      email: "hermione.granger@gryffindor.com",
      checkedIn: false,
      registrationStatus: "registered",
    },
    {
      name: "Ron Weasley",
      email: "ron.weasley@gryffindor.com",
      checkedIn: false,
      registrationStatus: "registered",
    },
    {
      name: "Draco Malfoy",
      email: "draco.malfoy@slytherin.com",
      checkedIn: false,
      registrationStatus: "cancelled",
    },
    {
      name: "Luna Lovegood",
      email: "luna.lovegood@ravenclaw.com",
      checkedIn: true,
      checkInTime: new Date("2026-03-01T10:30:00Z"),
      registrationStatus: "registered",
    },
  ];
  test("The function should return correct event name", () => {
    const report = buildReport(event, attendees);
    assert.strictEqual(report.eventName, "Workshop");
  });
  test("The function should return the correct total registered attendees count", () => {
    const report = buildReport(event, attendees);
    assert.strictEqual(report.totalRegistered, 4);
  });
  test("The function should return the correct total checked-in attendees count", () => {
    const report = buildReport(event, attendees);
    assert.strictEqual(report.totalCheckedIn, 2);
  });
  test("The function should return the correct list of checked-in attendees with their check-in times", () => {
    const report = buildReport(event, attendees);
    assert.deepStrictEqual(report.checkedInAttendees, [
      {
        name: "Harry Potter",
        email: "harry.potter@gryffindor.com",
        checkInTime: new Date("2026-03-01T10:00:00Z"),
      },
      {
        name: "Luna Lovegood",
        email: "luna.lovegood@ravenclaw.com",
        checkInTime: new Date("2026-03-01T10:30:00Z"),
      },
    ]);
  });
  test("The function should throw an error if event is not an object", () => {
    assert.throws(
      () => buildReport(null, attendees),
      /Event should be an object/,
    );
    assert.throws(
      () => buildReport(undefined, attendees),
      /Event should be an object/,
    );
    assert.throws(
      () => buildReport("not an object", attendees),
      /Event should be an object/,
    );
    assert.throws(
      () => buildReport(12345, attendees),
      /Event should be an object/,
    );
  });
  test("The function should throw an error if attendees is not an array", () => {
    assert.throws(
      () => buildReport(event, null),
      /Attendees should be an array/,
    );
    assert.throws(
      () => buildReport(event, undefined),
      /Attendees should be an array/,
    );
    assert.throws(
      () => buildReport(event, "not an array"),
      /Attendees should be an array/,
    );
    assert.throws(
      () => buildReport(event, 12345),
      /Attendees should be an array/,
    );
  });
});

//  TODO: Test for (formatEventDate, getCheckInPercentage, sortAttendeesByName, summarizeAttendees)
