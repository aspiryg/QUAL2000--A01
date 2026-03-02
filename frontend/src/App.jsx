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

export default function App() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [report, setReport] = useState(null);
  const [tab, setTab] = useState("attendees");
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [confirm, setConfirm] = useState(null); // { message, onConfirm }
  const confirmResolveRef = useRef(null);

  // ─── Toast helpers ──────────────────────────────────────────────────

  const addToast = useCallback((message, type = "success") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ─── Confirm dialog ─────────────────────────────────────────────────

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

  // ─── Data loading ───────────────────────────────────────────────────

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

  // ─── Handlers ───────────────────────────────────────────────────────

  const handleCreateEvent = async (data) => {
    await createEvent(data);
    await loadEvents();
    addToast(`Event "${data.name}" created`);
  };

  const handleDeleteEvent = async (eventId, eventName) => {
    const ok = await showConfirm(
      `Delete "${eventName}" and all its attendees? This cannot be undone.`,
    );
    if (!ok) return;
    try {
      await deleteEvent(eventId);
      addToast(`Event "${eventName}" deleted`);
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
    addToast(`${data.name} registered successfully`);
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
      addToast("Attendee checked in");
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
      addToast("CSV downloaded");
    } catch (err) {
      addToast("CSV download failed", "error");
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
        <p style={styles.subtitle}>
          Create magical events, manage your attendees, and conjure up
          insightful reports with ease. Whether you're organizing a Quidditch
          match or a Potions class, our platform has you covered.
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
                    {selectedEventObj.capacity} registered
                  </span>
                )}
              </div>

              <div style={styles.tabs}>
                <button
                  style={tab === "attendees" ? styles.tabActive : styles.tab}
                  onClick={() => setTab("attendees")}
                >
                  Attendees
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
    maxWidth: 1060,
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
    flexWrap: "wrap",
  },
  eventDate: { fontSize: 13, color: "#777" },
  capacityBadge: {
    marginLeft: "auto",
    fontSize: 12,
    color: "#555",
    background: "#f3f4f6",
    padding: "3px 10px",
    borderRadius: 10,
  },
  tabs: { display: "flex", gap: 4, marginBottom: 18 },
  tab: {
    padding: "7px 18px",
    background: "#e5e7eb",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 14,
    transition: "background 0.15s",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  tabActive: {
    padding: "7px 18px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  tabBadge: {
    fontSize: 11,
    background: "rgba(255,255,255,0.25)",
    padding: "1px 7px",
    borderRadius: 8,
    fontWeight: 600,
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    border: "1px dashed #d1d5db",
    borderRadius: 8,
  },
};
