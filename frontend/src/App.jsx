import { useState, useEffect, useCallback, useRef } from "react";
import CreateEventForm from "./components/CreateEventForm.jsx";
import EventList from "./components/EventList.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import AttendeeTable from "./components/AttendeeTable.jsx";
import ReportView from "./components/ReportView.jsx";
import { ToastContainer } from "./components/Toast.jsx";
import ConfirmDialog from "./components/ConfirmDialog.jsx";
import {
  fetchEvents,
  createEvent,
  fetchAttendees,
  registerAttendee,
  checkInAttendee,
  fetchReport,
  deleteEvent,
  deleteAttendee,
} from "./services/api";

let toastId = 0;

// Accent colors for each Hogwarts house, used in the UI
const houseAccents = [
  { name: "Gryffindor", color: "#740001", border: "#d3a625" },
  { name: "Slytherin", color: "#1f5f3a", border: "#c4b08a" },
  { name: "Ravenclaw", color: "#1a1a2e", border: "#d3a625" },
  { name: "Hufflepuff", color: "#2b1d0e", border: "#d3a625" },
];

export default function App() {
  // --- State ---
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [report, setReport] = useState(null);
  const [tab, setTab] = useState("attendees");
  // UI state
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [confirm, setConfirm] = useState(null); // { message, onConfirm }
  const confirmResolveRef = useRef(null);

  // --- Toast helpers ---
  const addToast = useCallback((message, type = "success") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // --- Confirm dialog ---
  const showConfirm = useCallback((message) => {
    return new Promise((resolve) => {
      confirmResolveRef.current = resolve;
      setConfirm({ message });
    });
  }, []);

  const handleConfirmYes = () => {
    confirmResolveRef.current?.(true);
    setConfirm(null);
  };

  const handleConfirmNo = () => {
    confirmResolveRef.current?.(false);
    setConfirm(null);
  };

  // --- Data Loading ---

  const loadEvents = useCallback(async () => {
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (err) {
      addToast("Failed to load events", "error");
    }
  }, [addToast]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const loadAttendees = useCallback(
    async (eventId) => {
      setLoadingAttendees(true);
      try {
        const data = await fetchAttendees(eventId);
        setAttendees(data);
      } catch (err) {
        addToast("Failed to load attendees", "error");
      } finally {
        setLoadingAttendees(false);
      }
    },
    [addToast],
  );

  useEffect(() => {
    if (selectedEvent) {
      loadAttendees(selectedEvent);
      setReport(null);
      setTab("attendees");
    }
  }, [selectedEvent, loadAttendees]);

  // --- Handlers ---

  const handleCreateEvent = async (data) => {
    await createEvent(data);
    await loadEvents();
    addToast(`"${data.name}" has been scheduled`);
  };

  const handleDeleteEvent = async (eventId, eventName) => {
    const ok = await showConfirm(
      `Vanish "${eventName}" and all enrolled witches & wizards? This cannot be undone.`,
    );
    if (!ok) return;
    try {
      await deleteEvent(eventId);
      addToast(`"${eventName}" has been vanished`);
      if (selectedEvent === eventId) {
        setSelectedEvent(null);
        setAttendees([]);
        setReport(null);
      }
      await loadEvents();
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  const handleRegister = async (data) => {
    await registerAttendee(selectedEvent, data);
    await loadAttendees(selectedEvent);
    await loadEvents(); // refresh attendee counts
    addToast(`${data.name} has been enrolled`);
  };

  const handleDeleteAttendee = async (attendeeId, attendeeName) => {
    const ok = await showConfirm(`Remove "${attendeeName}" from this event?`);
    if (!ok) return;
    try {
      await deleteAttendee(selectedEvent, attendeeId);
      addToast(`${attendeeName} removed`);
      await loadAttendees(selectedEvent);
      await loadEvents(); // refresh attendee counts
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  const handleCheckIn = async (attendeeId) => {
    try {
      await checkInAttendee(selectedEvent, attendeeId);
      await loadAttendees(selectedEvent);
      await loadEvents(); // refresh checked-in counts
      addToast("Arrival recorded");
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  const handleViewReport = async () => {
    try {
      const data = await fetchReport(selectedEvent, "json");
      setReport(data);
      setTab("report");
    } catch (err) {
      addToast("Failed to load report", "error");
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
      addToast("Scroll downloaded");
    } catch (err) {
      addToast("Scroll download failed", "error");
    }
  };

  const selectedEventObj = events.find((e) => e._id === selectedEvent);

  return (
    <div style={styles.container}>
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Confirm dialog */}
      {confirm && (
        <ConfirmDialog
          message={confirm.message}
          onConfirm={handleConfirmYes}
          onCancel={handleConfirmNo}
        />
      )}

      <header style={styles.header}>
        <h1 style={styles.title}>Hogwarts School of Witchcraft and Wizardry</h1>
        <p style={styles.subtitle}>Event Management &amp; Attendance Office</p>
      </header>
      <div style={styles.houseRow}>
        {houseAccents.map((house) => (
          <span
            key={house.name}
            style={{
              ...styles.houseBadge,
              background: house.color,
              borderColor: house.border,
            }}
          >
            {house.name}
          </span>
        ))}
      </div>

      <div style={styles.layout}>
        {/* Left sidebar */}
        <div style={styles.sidebar}>
          <CreateEventForm onCreated={handleCreateEvent} />
          <EventList
            events={events}
            selected={selectedEvent}
            onSelect={setSelectedEvent}
            onDelete={handleDeleteEvent}
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
                {selectedEventObj && (
                  <span style={styles.capacityBadge}>
                    {selectedEventObj.attendeeCount ?? 0}/
                    {selectedEventObj.capacity} enrolled
                  </span>
                )}
              </div>

              <div style={styles.tabs}>
                <button
                  style={tab === "attendees" ? styles.tabActive : styles.tab}
                  onClick={() => setTab("attendees")}
                >
                  Roster
                  {attendees.length > 0 && (
                    <span style={styles.tabBadge}>{attendees.length}</span>
                  )}
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
                    onDelete={handleDeleteAttendee}
                    loading={loadingAttendees}
                  />
                </>
              )}

              {tab === "report" && (
                <ReportView report={report} onDownloadCsv={handleDownloadCsv} />
              )}
            </>
          ) : (
            <div style={styles.emptyState}>
              <p style={{ fontSize: 18, color: "#5c4033", marginBottom: 4 }}>
                No event selected
              </p>
              <p style={{ color: "#8b7355", fontSize: 14 }}>
                Select an event from the notice board or schedule a new
                inter-house gathering..
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
    maxWidth: 1060,
    margin: "0 auto",
    padding: "24px 20px",
    fontFamily: '"Lora", "Georgia", serif',
    color: "#2b1d0e",
  },
  header: {
    marginBottom: 24,
    borderBottom: "2px solid #d3a625",
    paddingBottom: 14,
    textAlign: "center",
    background: "#faf6ed",
    borderRadius: 10,
    paddingTop: 12,
  },
  title: {
    margin: "0 0 4px",
    fontSize: 28,
    fontWeight: 700,
    fontFamily: '"Cinzel", "Georgia", serif',
    color: "#1a1a2e",
    letterSpacing: "0.5px",
  },
  subtitle: {
    margin: 0,
    fontSize: 14,
    color: "#740001",
    fontStyle: "italic",
  },
  houseRow: {
    marginTop: 10,
    display: "flex",
    gap: 8,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  houseBadge: {
    fontSize: 11,
    color: "#fff",
    border: "1px solid",
    padding: "2px 10px",
    borderRadius: 999,
    fontFamily: '"Cinzel", serif',
    letterSpacing: "0.3px",
  },
  layout: { display: "flex", gap: 28 },
  sidebar: { width: 340, flexShrink: 0 },
  main: { flex: 1, minWidth: 0 },
  eventHeader: {
    display: "flex",
    alignItems: "baseline",
    gap: 12,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  eventDate: { fontSize: 13, color: "#6b4c30" },
  capacityBadge: {
    marginLeft: "auto",
    fontSize: 12,
    color: "#5c4033",
    background: "#ede4d0",
    padding: "3px 10px",
    borderRadius: 10,
  },
  tabs: { display: "flex", gap: 4, marginBottom: 18 },
  tab: {
    padding: "7px 18px",
    background: "#e8dcc8",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 14,
    fontFamily: '"Lora", serif',
    transition: "background 0.15s",
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#2b1d0e",
  },
  tabActive: {
    padding: "7px 18px",
    background: "#1a1a2e",
    color: "#d3a625",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 14,
    fontFamily: '"Lora", serif',
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  tabBadge: {
    fontSize: 11,
    background: "rgba(211,166,37,0.35)",
    padding: "1px 7px",
    borderRadius: 8,
    fontWeight: 600,
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    border: "1px dashed #c4b08a",
    borderRadius: 8,
    background: "#faf6ed",
  },
};
