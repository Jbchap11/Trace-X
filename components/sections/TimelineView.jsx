import { useState, useEffect } from "react";
import { getTimeline } from "../../services/dataProvider";

function TimelineView() {
  const [timeline, setTimeline] = useState(null);

  useEffect(() => {
    getTimeline().then((result) => setTimeline(result));
  }, []);

  if (!timeline) return <p>Loading timeline...</p>;

  return (
    <div style={styles.card}>
      <span style={styles.cornerTL} />
      <span style={styles.cornerTR} />
      <span style={styles.cornerBL} />
      <span style={styles.cornerBR} />

      <div style={styles.headerRow}>
        <p style={styles.title}>TIMELINE</p>
        <span style={styles.copyIcon}>⧉</span>
      </div>

      {timeline.map((item, i) => (
        <div key={i}>
          <p style={styles.time}>{item.time}</p>

          <div style={styles.branchRow}>
            <div style={styles.connector}>
              <div style={styles.vLine} />

              {i !== timeline.length - 1 && (
                <div style={styles.vLineContinue} />
              )}
            </div>

            <p style={styles.event}>{item.event}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: {
    width: "min(680px, 95%)",

    // Transparent glass background
    background:
      "linear-gradient(135deg, rgba(10, 22, 38, 0.48), rgba(12, 25, 42, 0.30))",

    // Keeps the background visible
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",

    // Subtle cyan glass border
    border: "1px solid rgba(39, 216, 242, 0.45)",
    borderRadius: "12px",

    padding: "26px 30px",
    position: "relative",

    // Soft shadow/glow
    boxShadow:
      "0 12px 35px rgba(0, 0, 0, 0.22), inset 0 0 25px rgba(39, 216, 242, 0.025)",

    overflow: "hidden",
  },

  cornerTL: {
    position: "absolute",
    top: "8px",
    left: "8px",
    width: "16px",
    height: "16px",
    borderTop: "2px solid var(--soc-cyan)",
    borderLeft: "2px solid var(--soc-cyan)",
  },

  cornerTR: {
    position: "absolute",
    top: "8px",
    right: "8px",
    width: "16px",
    height: "16px",
    borderTop: "2px solid var(--soc-cyan)",
    borderRight: "2px solid var(--soc-cyan)",
  },

  cornerBL: {
    position: "absolute",
    bottom: "8px",
    left: "8px",
    width: "16px",
    height: "16px",
    borderBottom: "2px solid var(--soc-cyan)",
    borderLeft: "2px solid var(--soc-cyan)",
  },

  cornerBR: {
    position: "absolute",
    bottom: "8px",
    right: "8px",
    width: "16px",
    height: "16px",
    borderBottom: "2px solid var(--soc-cyan)",
    borderRight: "2px solid var(--soc-cyan)",
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  title: {
    color: "var(--soc-cyan)",
    fontSize: "0.78rem",
    letterSpacing: "1px",
    fontWeight: "bold",
    margin: 0,

    textShadow: "0 0 12px rgba(39, 216, 242, 0.35)",
  },

  copyIcon: {
    color: "var(--soc-cyan)",
    cursor: "pointer",
    fontSize: "1rem",

    textShadow: "0 0 10px rgba(39, 216, 242, 0.3)",
  },

  time: {
    fontSize: "0.88rem",

    // Brighter for transparent background
    color: "#F2F7FA",

    margin: "0 0 4px 0",
    fontWeight: "500",

    textShadow: "0 1px 3px rgba(0, 0, 0, 0.55)",
  },

  branchRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    paddingBottom: "18px",
  },

  connector: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "14px",
  },

  vLine: {
    width: "1px",
    height: "20px",
    backgroundColor: "var(--soc-border-bright)",
    opacity: 0.8,
  },

  vLineContinue: {
    width: "1px",
    flex: 1,
    backgroundColor: "var(--soc-border-bright)",
    marginTop: "-2px",
    opacity: 0.65,
  },

  event: {
    fontSize: "0.88rem",

    // Slightly brighter than before
    color: "#B8C8D3",

    margin: 0,
    paddingTop: "2px",

    textShadow: "0 1px 3px rgba(0, 0, 0, 0.45)",
  },
};

export default TimelineView;