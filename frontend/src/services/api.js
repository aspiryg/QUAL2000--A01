const API = import.meta.env.VITE_API_URL || "/api";

export async function fetchEvents() {
  const res = await fetch(`${API}/events`);
  if (!res.ok) throw new Error("Failed to fetch events");
  // console.log("Fetched events:", res);
  return res.json();
}

export async function createEvent(data) {
  console.log("Creating event with data:", data);
  const res = await fetch(`${API}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to create event");
  return json;
}

export async function fetchAttendees(eventId) {
  const res = await fetch(`${API}/events/${eventId}/attendees`);
  if (!res.ok) throw new Error("Failed to fetch attendees");
  return res.json();
}

export async function registerAttendee(eventId, data) {
  console.log("Registering attendee:", { ...data, eventId });
  const res = await fetch(`${API}/events/${eventId}/attendees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to register");
  return json;
}

export async function checkInAttendee(eventId, attendeeId) {
  const res = await fetch(
    `${API}/events/${eventId}/attendees/${attendeeId}/checkin`,
    { method: "PUT" },
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to check in");
  return json;
}

export async function fetchReport(eventId, format = "json") {
  const res = await fetch(`${API}/events/${eventId}/report?format=${format}`);
  if (format === "csv") {
    if (!res.ok) throw new Error("Failed to download CSV");
    return res.blob();
  }
  if (!res.ok) throw new Error("Failed to fetch report");
  return res.json();
}
