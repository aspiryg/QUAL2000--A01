export default function ReportView({ report, onDownloadCsv }) {
  if (!report) return null;

  return (
    <div style={styles.container}>
      <h4 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 600 }}>
        Attendance Report
      </h4>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <span style={styles.statValue}>{report.totalRegistered}</span>
          <span style={styles.statLabel}>Registered</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statValue}>{report.totalCheckedIn}</span>
          <span style={styles.statLabel}>Checked In</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statValue}>
            {report.totalRegistered > 0
              ? Math.round(
                  (report.totalCheckedIn / report.totalRegistered) * 100,
                )
              : 0}
            %
          </span>
          <span style={styles.statLabel}>Rate</span>
        </div>
      </div>

      <p style={{ fontSize: 13, color: "#666", margin: "0 0 8px" }}>
        <strong>Event:</strong> {report.eventName} &mdash;{" "}
        {new Date(report.eventDate).toLocaleDateString()}
      </p>

      {report.checkedInAttendees.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Check-In Time</th>
            </tr>
          </thead>
          <tbody>
            {report.checkedInAttendees.map((a, i) => (
              <tr key={i}>
                <td style={styles.td}>{a.name}</td>
                <td style={styles.td}>{a.email}</td>
                <td style={styles.td}>
                  {a.checkInTime
                    ? new Date(a.checkInTime).toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button style={styles.btn} onClick={onDownloadCsv}>
        Download CSV
      </button>
    </div>
  );
}

const styles = {
  container: {
    border: "1px solid #e0e0e0",
    borderRadius: 8,
    padding: 18,
    marginTop: 12,
    background: "#fafbfc",
  },
  statsRow: {
    display: "flex",
    gap: 12,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    padding: "12px 14px",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  statValue: { fontSize: 22, fontWeight: 700, color: "#2563eb" },
  statLabel: {
    fontSize: 11,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    margin: "10px 0",
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
    padding: "8px 16px",
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    marginTop: 10,
    fontSize: 14,
    fontWeight: 500,
  },
};
