import { useState } from "react";

export default function EventList({ events, selected, onSelect, onDelete }) {
  const [search, setSearch] = useState("");

  const filtered = events.filter((ev) =>
    ev.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h3 style={styles.heading}>Events</h3>

      <input
        style={styles.search}
        type="text"
        placeholder="Search events…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <p style={{ color: "#999", fontStyle: "italic", fontSize: 14 }}>
          {events.length === 0
            ? "No events created yet."
            : "No matching events."}
        </p>
      ) : (
        <ul style={styles.list}>
          {filtered.map((ev) => {
            const isSelected = selected === ev._id;
            // console.log("Rendering event:", ev, "Selected:", isSelected);
            return (
              <li
                key={ev._id}
                style={{
                  ...styles.item,
                  background: isSelected ? "#e8f0fe" : "#fff",
                  borderColor: isSelected ? "#2563eb" : "#e0e0e0",
                }}
                onClick={() => onSelect(ev._id)}
              >
                <div style={styles.row}>
                  <strong style={{ fontSize: 14 }}>{ev.name}</strong>
                  {onDelete && (
                    <button
                      style={styles.deleteBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(ev._id, ev.name);
                      }}
                      title="Delete event"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div style={styles.meta}>
                  <span style={styles.date}>
                    {new Date(ev.date).toLocaleDateString()}
                  </span>
                  <span style={styles.badge}>
                    {ev.attendeeCount ?? 0}/{ev.capacity}
                    {ev.checkedInCount > 0 && (
                      <span style={styles.checkedBadge}>
                        {" "}
                        · {ev.checkedInCount} ✓
                      </span>
                    )}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const styles = {
  heading: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 600,
    color: "#1a1a1a",
  },
  search: {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #ccc",
    borderRadius: 5,
    boxSizing: "border-box",
    fontSize: 14,
    marginBottom: 10,
    outline: "none",
  },
  list: { listStyle: "none", padding: 0, margin: 0 },
  item: {
    border: "1px solid #e0e0e0",
    borderRadius: 6,
    padding: "10px 14px",
    marginBottom: 6,
    cursor: "pointer",
    transition: "border-color 0.15s, box-shadow 0.15s",
    fontSize: 14,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  date: { color: "#666", fontSize: 12 },
  badge: {
    marginLeft: "auto",
    fontSize: 12,
    color: "#555",
    whiteSpace: "nowrap",
    background: "#f3f4f6",
    padding: "2px 8px",
    borderRadius: 10,
  },
  checkedBadge: {
    color: "#16a34a",
    fontWeight: 600,
  },
  deleteBtn: {
    background: "none",
    border: "none",
    color: "#999",
    fontSize: 18,
    cursor: "pointer",
    lineHeight: 1,
    padding: "0 4px",
    borderRadius: 3,
    transition: "color 0.15s",
  },
};
