export default function AttendeeTable({ attendees, onCheckIn }) {
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
          <th style={styles.th}>Checked In</th>
          <th style={styles.th}>Action</th>
        </tr>
      </thead>
      <tbody>
        {attendees.map((a) => (
          <tr key={a._id}>
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
                {a.checkedIn ? "Yes" : "No"}
              </span>
            </td>
            <td style={styles.td}>
              {!a.checkedIn && (
                <button style={styles.btn} onClick={() => onCheckIn(a._id)}>
                  Check In
                </button>
              )}
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
  btn: {
    padding: "5px 12px",
    background: "#f59e0b",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
  },
};
