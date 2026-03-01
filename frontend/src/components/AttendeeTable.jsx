export default function AttendeeTable({
  attendees,
  onCheckIn,
  onDelete,
  loading,
}) {
  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
        <span>Loading attendees…</span>
      </div>
    );
  }

  if (!attendees.length)
    return (
      <p style={{ color: "#999", fontStyle: "italic", fontSize: 14 }}>
        No attendees registered yet.
      </p>
    );

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Name</th>
          <th style={styles.th}>Email</th>
          <th style={styles.th}>Status</th>
          <th style={styles.th}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {attendees.map((a) => (
          <tr key={a._id} style={styles.row}>
            <td style={styles.td}>{a.name}</td>
            <td style={styles.td}>{a.email}</td>
            <td style={styles.td}>
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 500,
                  background: a.checkedIn ? "#dcfce7" : "#fef3c7",
                  color: a.checkedIn ? "#166534" : "#92400e",
                }}
              >
                {a.checkedIn ? "Checked In" : "Pending"}
              </span>
            </td>
            <td style={styles.td}>
              <div style={{ display: "flex", gap: 6 }}>
                {!a.checkedIn && (
                  <button
                    style={styles.checkInBtn}
                    onClick={() => onCheckIn(a._id)}
                  >
                    Check In
                  </button>
                )}
                {onDelete && (
                  <button
                    style={styles.removeBtn}
                    onClick={() => onDelete(a._id, a.name)}
                    title="Remove attendee"
                  >
                    Remove
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 16,
    fontSize: 14,
  },
  th: {
    textAlign: "left",
    borderBottom: "2px solid #e5e7eb",
    padding: "8px 12px",
    background: "#f9fafb",
    fontSize: 12,
    fontWeight: 600,
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },
  td: { padding: "8px 12px", borderBottom: "1px solid #f0f0f0" },
  row: { transition: "background 0.15s" },
  checkInBtn: {
    padding: "5px 12px",
    background: "#f59e0b",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
  },
  removeBtn: {
    padding: "5px 12px",
    background: "none",
    color: "#dc2626",
    border: "1px solid #fca5a5",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    transition: "background 0.15s",
  },
  loading: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "20px 0",
    color: "#777",
    fontSize: 14,
  },
  spinner: {
    width: 18,
    height: 18,
    border: "2px solid #e5e7eb",
    borderTopColor: "#2563eb",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
  },
};
