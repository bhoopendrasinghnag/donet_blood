import { useEffect } from "react";

const Popup = ({ message, type, onClose, duration = 2000 }) => {

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const styles = {

    overlay: {
      position: "fixed",
      top: "20px",
      // right: "20px",
      zIndex: 9999,
      pointerEvents: "none"
    },

    box: {
      minWidth: "220px",
      maxWidth: "320px",
      backgroundColor: type === "success" ? "#4caf50" : "#f44336",
      color: "#fff",
      padding: "12px 16px",
      borderRadius: "8px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
      animation: "popupSlide 0.3s ease",
      pointerEvents: "auto",
      fontSize: "14px",
      fontWeight: "500"
    },

    closeBtn: {
      background: "none",
      border: "none",
      color: "white",
      fontSize: "18px",
      cursor: "pointer",
      marginLeft: "10px",
      fontWeight: "bold"
    }

  };

  return (
    <div style={styles.overlay}>

      <style>
        {`
          @keyframes popupSlide {
            from {
              transform: translateY(-20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>

      <div style={styles.box}>
        <span>{message}</span>
        <button style={styles.closeBtn} onClick={onClose}>
          ×
        </button>
      </div>

    </div>
  );
};

export default Popup;