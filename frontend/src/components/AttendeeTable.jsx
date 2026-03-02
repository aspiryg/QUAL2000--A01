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
        <span>Summoning roster…</span>
      </div>
    );
  }

  if (!attendees.length)
    return (
      <p style={{ color: "#8b7355", fontStyle: "italic", fontSize: 14 }}>
        No witches or wizards enrolled yet.
      </p>
    );

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Witch / Wizard</th>
          <th style={styles.th}>Owl Post</th>
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
                  background: a.checkedIn ? "#d4edda" : "#fef3c7",
                  color: a.checkedIn ? "#155724" : "#856404",
                }}
              >
                {a.checkedIn ? "Arrived" : "Awaiting"}
              </span>
            </td>
            <td style={styles.td}>
              <div style={{ display: "flex", gap: 6 }}>
                {!a.checkedIn && (
                  <button
                    style={styles.checkInBtn}
                    onClick={() => onCheckIn(a._id)}
                  >
                    Mark Arrived
                  </button>
                )}
                {onDelete && (
                  <button
                    style={styles.removeBtn}
                    onClick={() => onDelete(a._id, a.name)}
                    title="Expel from event"
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
    borderBottom: "2px solid #c4b08a",
    padding: "8px 12px",
    background: "#ede4d0",
    fontSize: 12,
    fontWeight: 600,
    color: "#5c4033",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
    fontFamily: '"Cinzel", serif',
  },
  td: { padding: "8px 12px", borderBottom: "1px solid #e8dcc8" },
  row: { transition: "background 0.15s" },
  checkInBtn: {
    padding: "5px 12px",
    background: "#d3a625",
    color: "#1a1a2e",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    fontFamily: '"Lora", serif',
  },
  removeBtn: {
    padding: "5px 12px",
    background: "none",
    color: "#740001",
    border: "1px solid #c4a08a",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    fontFamily: '"Lora", serif',
    transition: "background 0.15s",
  },
  loading: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "20px 0",
    color: "#6b4c30",
    fontSize: 14,
  },
  spinner: {
    width: 18,
    height: 18,
    border: "2px solid #c4b08a",
    borderTopColor: "#d3a625",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
  },
};
