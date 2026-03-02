import { useEffect, useState } from "react";

export default function Toast({ message, type = "success", onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // wait for fade-out
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "error" ? "#740001" : type === "warning" ? "#d3a625" : "#2d6a4f";

  return (
    <div
      style={{
        ...styles.toast,
        background: bgColor,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-12px)",
      }}
    >
      <span style={styles.icon}>
        {type === "error" ? "✕" : type === "warning" ? "⚠" : "✓"}
      </span>
      <span>{message}</span>
    </div>
  );
}

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div style={styles.container}>
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          onClose={() => removeToast(t.id)}
        />
      ))}
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    top: 16,
    right: 16,
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    maxWidth: 360,
  },
  toast: {
    padding: "10px 16px",
    borderRadius: 6,
    color: "#fff",
    fontSize: 14,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: 8,
    boxShadow: "0 4px 12px rgba(26,26,46,0.25)",
    transition: "opacity 0.3s, transform 0.3s",
  },
  icon: {
    fontSize: 16,
    fontWeight: 700,
  },
};
