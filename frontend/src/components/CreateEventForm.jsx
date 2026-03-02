import { useState } from "react";

export default function CreateEventForm({ onCreated }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [capacity, setCapacity] = useState(10);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await onCreated({ name, date, capacity: Number(capacity) });
      setName("");
      setDate("");
      setCapacity(10);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={styles.heading}>Create a Magical Event</h3>

      {error && <p style={styles.error}>{error}</p>}

      <label style={styles.label}>
        Event Name
        <input
          style={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label style={styles.label}>
        Date
        <input
          style={styles.input}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>

      <label style={styles.label}>
        Capacity
        <input
          style={styles.input}
          type="number"
          min="1"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />
      </label>

      <button type="submit" style={styles.button}>
        Create
      </button>
    </form>
  );
}

const styles = {
  form: {
    border: "1px solid #e0e0e0",
    borderRadius: 8,
    padding: 18,
    marginBottom: 22,
    maxWidth: 400,
    background: "#fafbfc",
  },
  heading: {
    margin: "0 0 14px",
    fontSize: 16,
    fontWeight: 600,
    color: "#1a1a1a",
  },
  label: {
    display: "block",
    marginBottom: 12,
    fontSize: 13,
    fontWeight: 500,
    color: "#444",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "8px 10px",
    marginTop: 4,
    border: "1px solid #ccc",
    borderRadius: 5,
    boxSizing: "border-box",
    fontSize: 14,
    outline: "none",
  },
  button: {
    padding: "9px 20px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    transition: "background 0.15s",
  },
  error: { color: "#dc2626", fontSize: 13, margin: "0 0 8px" },
};
