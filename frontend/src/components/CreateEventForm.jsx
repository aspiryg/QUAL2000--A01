import { useState } from "react";

export default function CreateEventForm({ onCreated }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [capacity, setCapacity] = useState(100);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await onCreated({ name, date, capacity: Number(capacity) });
      setName("");
      setDate("");
      setCapacity(100);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={styles.heading}>Schedule Event</h3>

      {error && <p style={styles.error}>{error}</p>}

      <label style={styles.label}>
        Event Name
        <input
          style={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Quidditch Match"
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
        Schedule
      </button>
    </form>
  );
}

const styles = {
  form: {
    border: "1px solid #c4b08a",
    borderRadius: 8,
    padding: 18,
    marginBottom: 22,
    maxWidth: 400,
    background: "#faf6ed",
  },
  heading: {
    margin: "0 0 14px",
    fontSize: 16,
    fontWeight: 600,
    color: "#1a1a2e",
    fontFamily: '"Cinzel", serif',
  },
  label: {
    display: "block",
    marginBottom: 12,
    fontSize: 13,
    fontWeight: 500,
    color: "#5c4033",
    fontFamily: '"Lora", serif',
  },
  input: {
    display: "block",
    width: "100%",
    padding: "8px 10px",
    marginTop: 4,
    border: "1px solid #c4b08a",
    borderRadius: 5,
    boxSizing: "border-box",
    fontSize: 14,
    fontFamily: '"Lora", serif',
    background: "#fff",
    outline: "none",
  },
  button: {
    padding: "9px 20px",
    background: "#1a1a2e",
    color: "#d3a625",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: '"Cinzel", serif',
    letterSpacing: "0.3px",
    transition: "background 0.15s",
  },
  error: { color: "#740001", fontSize: 13, margin: "0 0 8px" },
};
