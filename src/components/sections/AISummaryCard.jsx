import { useState, useEffect } from "react";
import { getAISummary } from "../../services/dataProvider";

function AISummaryCard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    getAISummary().then((result) => setSummary(result));
  }, []);

  if (!summary) return <p>Loading AI summary...</p>;

  return (
    <div style={styles.card}>
      <span style={styles.cornerTL} />
      <span style={styles.cornerTR} />
      <span style={styles.cornerBL} />
      <span style={styles.cornerBR} />

      <div style={styles.headerRow}>
        <p style={styles.title}>AI INVESTIGATION</p>
        <span style={styles.copyIcon}>⧉</span>
      </div>

      <p style={styles.paragraph}>{summary.paragraph}</p>
    </div>
  );
}

const styles = {
  card: {
    width: "min(680px, 95%)",

    // Transparent glass-style background
    background:
      "linear-gradient(135deg, rgba(10, 22, 38, 0.48), rgba(12, 25, 42, 0.30))",

    // Allows the background design to remain visible
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",

    // Subtle border instead of a heavy solid box
    border: "1px solid rgba(39, 216, 242, 0.45)",
    borderRadius: "12px",

    padding: "26px 30px",
    position: "relative",

    // Soft glow/shadow
    boxShadow:
      "0 12px 35px rgba(0, 0, 0, 0.22), inset 0 0 25px rgba(39, 216, 242, 0.025)",

    // Keeps text and content above the background
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
    marginBottom: "16px",
  },

  title: {
    color: "var(--soc-cyan)",
    fontSize: "0.78rem",
    letterSpacing: "1px",
    fontWeight: "bold",
    margin: 0,

    // Makes heading readable even with transparent background
    textShadow: "0 0 12px rgba(39, 216, 242, 0.35)",
  },

  copyIcon: {
    color: "var(--soc-cyan)",
    cursor: "pointer",
    fontSize: "1rem",

    // Slight glow
    textShadow: "0 0 10px rgba(39, 216, 242, 0.3)",
  },

  paragraph: {
    fontSize: "0.92rem",
    lineHeight: "1.75",

    // Brighter than before so transparency doesn't affect readability
    color: "#F2F7FA",

    margin: 0,
    maxHeight: "140px",
    overflowY: "auto",

    // Slight text shadow for contrast
    textShadow: "0 1px 3px rgba(0, 0, 0, 0.65)",
  },
};

export default AISummaryCard;