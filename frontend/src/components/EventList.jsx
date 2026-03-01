export default function EventList({ events, selected, onSelect }) {
  if (!events.length)
    return (
      <p style={{ color: "#999", fontStyle: "italic", fontSize: 14 }}>
        No events created yet.
      </p>
    );

  return (
    <div>
      <h3
        style={{
          marginBottom: 10,
          fontSize: 16,
          fontWeight: 600,
          color: "#1a1a1a",
        }}
      >
        Events
      </h3>
      <ul style={styles.list}>
        {events.map((ev) => (
          <li
            key={ev._id}
            style={{
              ...styles.item,
              background: selected === ev._id ? "#e8f0fe" : "#fff",
              borderColor: selected === ev._id ? "#2563eb" : "#e0e0e0",
            }}
            onClick={() => onSelect(ev._id)}
          >
            <strong>{ev.name}</strong>
            <span style={styles.date}>
              {new Date(ev.date).toLocaleDateString()}
            </span>
            <span style={styles.cap}>Capacity: {ev.capacity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  list: { listStyle: "none", padding: 0, margin: 0 },
  item: {
    border: "1px solid #e0e0e0",
    borderRadius: 6,
    padding: "10px 14px",
    marginBottom: 6,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 12,
    transition: "border-color 0.15s, box-shadow 0.15s",
    fontSize: 14,
  },
  date: { color: "#666", fontSize: 12 },
  cap: {
    marginLeft: "auto",
    fontSize: 12,
    color: "#999",
    whiteSpace: "nowrap",
  },
};
