export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.dialog}>
        <p style={styles.message}>{message}</p>
        <div style={styles.actions}>
          <button style={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button style={styles.confirmBtn} onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000,
  },
  dialog: {
    background: "#fff",
    borderRadius: 10,
    padding: "24px 28px",
    maxWidth: 380,
    width: "90%",
    boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
  },
  message: {
    fontSize: 15,
    color: "#1a1a1a",
    margin: "0 0 20px",
    lineHeight: 1.5,
  },
  actions: {
    display: "flex",
    gap: 10,
    justifyContent: "flex-end",
  },
  cancelBtn: {
    padding: "8px 18px",
    background: "#e5e7eb",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
  },
  confirmBtn: {
    padding: "8px 18px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
  },
};
