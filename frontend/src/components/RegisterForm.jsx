import { useState } from "react";

export default function RegisterForm({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await onRegister({ name, email });
      setSuccess(`${name} has been enrolled`);
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
          color: "#1a1a2e",
          fontFamily: '"Cinzel", serif',
        }}
      >
        Enrol Witch / Wizard
      </h4>

      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      <label style={styles.label}>
        Witch / Wizard Name
        <input
          style={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Harry Potter"
          required
        />
      </label>

      <label style={styles.label}>
        Owl Post (Email)
        <input
          style={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g. harry@hogwarts.edu"
          required
        />
      </label>

      <button type="submit" style={styles.button}>
        Enrol
      </button>
    </form>
  );
}

const styles = {
  form: {
    border: "1px solid #c4b08a",
    borderRadius: 8,
    padding: 16,
    marginBottom: 18,
    maxWidth: 360,
    background: "#faf6ed",
  },
  label: {
    display: "block",
    marginBottom: 10,
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
    padding: "8px 16px",
    background: "#2d6a4f",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: '"Cinzel", serif',
  },
  error: { color: "#740001", fontSize: 13, margin: "0 0 6px" },
  success: { color: "#2d6a4f", fontSize: 13, margin: "0 0 6px" },
};
