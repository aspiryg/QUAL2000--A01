import { useState, useEffect, useCallback } from "react";
import CreateEventForm from "./components/CreateEventForm.jsx";
import EventList from "./components/EventList.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import AttendeeTable from "./components/AttendeeTable.jsx";
import ReportView from "./components/ReportView.jsx";
import {
  fetchEvents,
  createEvent,
  fetchAttendees,
  registerAttendee,
  checkInAttendee,
  fetchReport,
} from "./services/api";

export default function App() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [report, setReport] = useState(null);
  const [tab, setTab] = useState("attendees");

  const loadEvents = useCallback(async () => {
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const loadAttendees = useCallback(async (eventId) => {
    try {
      const data = await fetchAttendees(eventId);
      setAttendees(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      loadAttendees(selectedEvent);
      setReport(null);
      setTab("attendees");
    }
  }, [selectedEvent, loadAttendees]);

  const handleCreateEvent = async (data) => {
    await createEvent(data);
    await loadEvents();
  };

  const handleRegister = async (data) => {
    await registerAttendee(selectedEvent, data);
    await loadAttendees(selectedEvent);
  };

  const handleCheckIn = async (attendeeId) => {
    try {
      await checkInAttendee(selectedEvent, attendeeId);
      await loadAttendees(selectedEvent);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleViewReport = async () => {
    try {
      const data = await fetchReport(selectedEvent, "json");
      setReport(data);
      setTab("report");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadCsv = async () => {
    try {
      const blob = await fetchReport(selectedEvent, "csv");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "report.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  const selectedEventObj = events.find((e) => e._id === selectedEvent);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Event Check-In System</h1>
        <p style={styles.subtitle}>
          Manage events, register attendees, and track check-ins
        </p>
      </header>

      <div style={styles.layout}>
        {/* Left sidebar */}
        <div style={styles.sidebar}>
          <CreateEventForm onCreated={handleCreateEvent} />
          <EventList
            events={events}
            selected={selectedEvent}
            onSelect={setSelectedEvent}
          />
        </div>

        {/* Main area */}
        <div style={styles.main}>
          {selectedEvent ? (
            <>
              <div style={styles.eventHeader}>
                <h2 style={{ margin: 0 }}>{selectedEventObj?.name}</h2>
                <span style={styles.eventDate}>
                  {selectedEventObj
                    ? new Date(selectedEventObj.date).toLocaleDateString()
                    : ""}
                </span>
              </div>

              <div style={styles.tabs}>
                <button
                  style={tab === "attendees" ? styles.tabActive : styles.tab}
                  onClick={() => setTab("attendees")}
                >
                  Attendees
                </button>
                <button
                  style={tab === "report" ? styles.tabActive : styles.tab}
                  onClick={handleViewReport}
                >
                  Report
                </button>
              </div>

              {tab === "attendees" && (
                <>
                  <RegisterForm onRegister={handleRegister} />
                  <AttendeeTable
                    attendees={attendees}
                    onCheckIn={handleCheckIn}
                  />
                </>
              )}

              {tab === "report" && (
                <ReportView report={report} onDownloadCsv={handleDownloadCsv} />
              )}
            </>
          ) : (
            <div style={styles.emptyState}>
              <p style={{ fontSize: 18, color: "#555", marginBottom: 4 }}>
                No event selected
              </p>
              <p style={{ color: "#999", fontSize: 14 }}>
                Pick an event from the sidebar or create a new one.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 1020,
    margin: "0 auto",
    padding: "24px 20px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: "#1a1a1a",
  },
  header: {
    marginBottom: 24,
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: 14,
  },
  title: { margin: "0 0 4px", fontSize: 26, fontWeight: 700 },
  subtitle: { margin: 0, fontSize: 14, color: "#666" },
  layout: { display: "flex", gap: 28 },
  sidebar: { width: 340, flexShrink: 0 },
  main: { flex: 1, minWidth: 0 },
  eventHeader: {
    display: "flex",
    alignItems: "baseline",
    gap: 12,
    marginBottom: 12,
  },
  eventDate: { fontSize: 13, color: "#777" },
  tabs: { display: "flex", gap: 4, marginBottom: 18 },
  tab: {
    padding: "7px 18px",
    background: "#e5e7eb",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 14,
    transition: "background 0.15s",
  },
  tabActive: {
    padding: "7px 18px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 14,
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    border: "1px dashed #d1d5db",
    borderRadius: 8,
  },
};
