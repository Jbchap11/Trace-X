import { useState, useEffect } from "react";
import { getIOCs } from "../../services/dataProvider";

function IOCExplorer({ caseId }) {
  const [iocs, setIocs] = useState(null);

  useEffect(() => {
    getIOCs(caseId).then((result) => setIocs(result));
  }, [caseId]);

  const statusColor = {
    Malicious: "var(--soc-danger)",
    Suspicious: "var(--soc-warning)",
    Clean: "var(--soc-safe)",
  };

  if (!iocs) return <p>Loading IOCs...</p>;

  return (
    <div style={styles.card}>
      <span style={styles.cornerTL} />
      <span style={styles.cornerTR} />
      <span style={styles.cornerBL} />
      <span style={styles.cornerBR} />

      <p style={styles.title}>IOC EXPLORER</p>

      <div style={styles.headerRow}>
        <span style={styles.headerCell}>Indicator</span>
        <span style={styles.headerCell}>Type</span>
        <span style={styles.headerCell}>Status</span>
      </div>

      {iocs.map((ioc, i) => (
        <div key={i} style={styles.row}>
          <span style={styles.cell}>{ioc.indicator}</span>

          <span style={styles.cellMuted}>{ioc.type}</span>

          <span
            style={{
              ...styles.cell,
              color: statusColor[ioc.status] || "var(--soc-text)",
              fontWeight: "500",
            }}
          >
            ● {ioc.status}
          </span>
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: {
    width: "min(680px, 95%)",

    // Transparent glass effect
    background:
      "linear-gradient(135deg, rgba(10, 22, 38, 0.48), rgba(12, 25, 42, 0.30))",

    // Keeps the background visible but slightly softened
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",

    border: "1px solid rgba(39, 216, 242, 0.45)",
    borderRadius: "12px",

    padding: "26px 30px",
    position: "relative",

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

  title: {
    color: "var(--soc-cyan)",
    fontSize: "0.78rem",
    letterSpacing: "1px",
    fontWeight: "bold",
    marginBottom: "18px",

    textShadow: "0 0 12px rgba(39, 216, 242, 0.35)",
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",

    paddingBottom: "10px",

    // Softer transparent separator
    borderBottom: "1px solid rgba(120, 160, 180, 0.22)",

    marginBottom: "10px",
  },

  headerCell: {
    fontSize: "0.75rem",
    color: "var(--soc-subtle)",
    flex: 1,
    letterSpacing: "0.4px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",

    padding: "10px 0",

    // Softer lines so the card doesn't look too boxed
    borderBottom: "1px solid rgba(120, 160, 180, 0.16)",

    fontSize: "0.88rem",
  },

  cell: {
    flex: 1,

    // Brighter text for readability
    color: "#F2F7FA",

    textShadow: "0 1px 3px rgba(0, 0, 0, 0.55)",
  },

  cellMuted: {
    flex: 1,
    color: "#A9BBC8",

    textShadow: "0 1px 3px rgba(0, 0, 0, 0.45)",
  },
};

export default IOCExplorer;