import { useState } from "react";

export default function RegisterForm({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // console.log("Rendering RegisterForm with onRegister:", onRegister);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      // console.log("Submitting registration:", { name, email });
      await onRegister({ name, email });
      setSuccess(`${name} registered successfully`);
      setName("");
      setEmail("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h4
        style={{
          margin: "0 0 10px",
          fontSize: 15,
          fontWeight: 600,
          color: "#1a1a1a",
        }}
      >
        Register Attendee
      </h4>

      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      <label style={styles.label}>
        Name
        <input
          style={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label style={styles.label}>
        Email
        <input
          style={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <button type="submit" style={styles.button}>
        Register
      </button>
    </form>
  );
}

const styles = {
  form: {
    border: "1px solid #e0e0e0",
    borderRadius: 8,
    padding: 16,
    marginBottom: 18,
    maxWidth: 360,
    background: "#f8faf8",
  },
  label: {
    display: "block",
    marginBottom: 10,
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
    padding: "8px 16px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
  },
  error: { color: "#dc2626", fontSize: 13, margin: "0 0 6px" },
  success: { color: "#16a34a", fontSize: 13, margin: "0 0 6px" },
};
