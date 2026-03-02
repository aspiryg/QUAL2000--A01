export default function ReportView({ report, onDownloadCsv }) {
  if (!report) return null;

  return (
    <div style={styles.container}>
      <h4
        style={{
          margin: "0 0 14px",
          fontSize: 16,
          fontWeight: 600,
          fontFamily: '"Cinzel", serif',
          color: "#1a1a2e",
        }}
      >
        Attendance Scroll
      </h4>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <span style={styles.statValue}>{report.totalRegistered}</span>
          <span style={styles.statLabel}>Enrolled</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statValue}>{report.totalCheckedIn}</span>
          <span style={styles.statLabel}>Arrived</span>
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

      <p style={{ fontSize: 13, color: "#6b4c30", margin: "0 0 8px" }}>
        <strong>Event:</strong> {report.eventName} &mdash;{" "}
        {new Date(report.eventDate).toLocaleDateString()}
      </p>

      {report.checkedInAttendees.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Witch / Wizard</th>
              <th style={styles.th}>Owl Post</th>
              <th style={styles.th}>Arrival Time</th>
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
        Download Scroll (CSV)
      </button>
    </div>
  );
}

const styles = {
  container: {
    border: "1px solid #c4b08a",
    borderRadius: 8,
    padding: 18,
    marginTop: 12,
    background: "#faf6ed",
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
    border: "1px solid #c4b08a",
    borderRadius: 6,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 700,
    color: "#740001",
    fontFamily: '"Cinzel", serif',
  },
  statLabel: {
    fontSize: 11,
    color: "#6b4c30",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
    fontFamily: '"Cinzel", serif',
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    margin: "10px 0",
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
  btn: {
    padding: "8px 16px",
    background: "#1a1a2e",
    color: "#d3a625",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    marginTop: 10,
    fontSize: 14,
    fontWeight: 600,
    fontFamily: '"Cinzel", serif',
  },
};
