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
    background: "rgba(26,26,46,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000,
  },
  dialog: {
    background: "#faf6ed",
    borderRadius: 10,
    padding: "24px 28px",
    maxWidth: 380,
    width: "90%",
    boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
    border: "1px solid #c4b08a",
  },
  message: {
    fontSize: 15,
    color: "#2b1d0e",
    margin: "0 0 20px",
    lineHeight: 1.5,
    fontFamily: '"Lora", serif',
  },
  actions: {
    display: "flex",
    gap: 10,
    justifyContent: "flex-end",
  },
  cancelBtn: {
    padding: "8px 18px",
    background: "#e8dcc8",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    fontFamily: '"Lora", serif',
  },
  confirmBtn: {
    padding: "8px 18px",
    background: "#740001",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: '"Cinzel", serif',
  },
};
