import { useState, useEffect } from "react";
import { getIOCs } from "../../services/dataProvider";

function IOCExplorer({ caseId, emailId }) {
  const [iocs, setIocs] = useState(null);

  useEffect(() => {
    getIOCs(caseId, emailId).then((result) => setIocs(result));
  }, [caseId, emailId]);

  const statusColor = {
    Malicious: "var(--soc-danger)",
    Suspicious: "var(--soc-warning)",
    Clean: "var(--soc-safe)",
    Active: "var(--soc-safe)",
    Blocked: "var(--soc-danger)",
  };

  if (!iocs) return <p>Loading IOCs...</p>;

  return (
    <div style={styles.card}>
      {/* Corner decorations */}
      <span style={styles.cornerTL} />
      <span style={styles.cornerTR} />
      <span style={styles.cornerBL} />
      <span style={styles.cornerBR} />

      <p style={styles.title}>IOC EXPLORER</p>

      {/* HEADER */}
      <div style={styles.headerRow}>
        <div style={{ ...styles.headerCell, ...styles.indicatorColumn }}>
          Indicator
        </div>

        <div style={{ ...styles.headerCell, ...styles.typeColumn }}>
          Type
        </div>

        <div style={{ ...styles.headerCell, ...styles.statusColumn }}>
          Status
        </div>
      </div>

      {/* IOC DATA */}
      {iocs.length === 0 ? (
        <p style={styles.emptyState}>
          ✅ No IOCs detected for this email/case.
        </p>
      ) : (
        <div style={styles.rowsContainer}>
          {iocs.map((ioc, i) => (
            <div key={`${ioc.indicator}-${i}`} style={styles.row}>

              {/* INDICATOR */}
              <div style={{ ...styles.cell, ...styles.indicatorColumn }}>
                {ioc.indicator || "Unknown"}
              </div>

              {/* TYPE */}
              <div style={{ ...styles.cellMuted, ...styles.typeColumn }}>
                {ioc.type || "Unknown"}
              </div>

              {/* STATUS */}
              <div
                style={{
                  ...styles.cell,
                  ...styles.statusColumn,
                  color:
                    statusColor[ioc.status] || "var(--soc-text)",
                  fontWeight: "500",
                }}
              >
                <span style={styles.statusDot}>●</span>
                {ioc.status || "Unknown"}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  /* ================= CARD ================= */

  card: {
    width: "min(900px, 95%)",
    maxWidth: "900px",

    background:
      "linear-gradient(135deg, rgba(10, 22, 38, 0.48), rgba(12, 25, 42, 0.30))",

    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",

    border: "1px solid rgba(39, 216, 242, 0.45)",
    borderRadius: "12px",

    padding: "26px 30px",

    position: "relative",

    boxShadow:
      "0 12px 35px rgba(0, 0, 0, 0.22), inset 0 0 25px rgba(39, 216, 242, 0.025)",

    overflow: "hidden",

    boxSizing: "border-box",
  },

  /* ================= CORNERS ================= */

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

  /* ================= TITLE ================= */

  title: {
    color: "var(--soc-cyan)",
    fontSize: "0.78rem",
    letterSpacing: "1px",
    fontWeight: "bold",
    marginBottom: "18px",

    textShadow: "0 0 12px rgba(39, 216, 242, 0.35)",
  },

  /* ================= COLUMNS ================= */

  indicatorColumn: {
    flex: "1.9",
    minWidth: 0,
  },

  typeColumn: {
    flex: "0.7",
    minWidth: "90px",
  },

  statusColumn: {
    flex: "0.8",
    minWidth: "100px",
  },

  /* ================= HEADER ================= */

  headerRow: {
    display: "flex",
    alignItems: "center",

    width: "100%",

    paddingBottom: "10px",

    borderBottom:
      "1px solid rgba(120, 160, 180, 0.22)",

    marginBottom: "0",

    boxSizing: "border-box",
  },

  headerCell: {
    fontSize: "0.75rem",

    color: "var(--soc-subtle)",

    letterSpacing: "0.4px",

    paddingRight: "15px",

    boxSizing: "border-box",
  },

  /* ================= ROWS ================= */

  rowsContainer: {
    width: "100%",
  },

  row: {
    display: "flex",
    alignItems: "flex-start",

    width: "100%",

    padding: "13px 0",

    borderBottom:
      "1px solid rgba(120, 160, 180, 0.16)",

    boxSizing: "border-box",

    gap: "0",
  },

  /* ================= TEXT ================= */

  cell: {
    color: "#F2F7FA",

    fontSize: "0.88rem",

    lineHeight: "1.5",

    paddingRight: "15px",

    boxSizing: "border-box",

    /* IMPORTANT:
       Long URLs/emails will wrap instead of becoming ... */
    overflowWrap: "anywhere",
    wordBreak: "break-word",

    whiteSpace: "normal",

    textShadow:
      "0 1px 3px rgba(0, 0, 0, 0.55)",
  },

  cellMuted: {
    color: "#A9BBC8",

    fontSize: "0.88rem",

    lineHeight: "1.5",

    paddingRight: "15px",

    boxSizing: "border-box",

    whiteSpace: "normal",

    overflowWrap: "anywhere",

    wordBreak: "break-word",

    textShadow:
      "0 1px 3px rgba(0, 0, 0, 0.45)",
  },

  /* ================= STATUS ================= */

  statusDot: {
    display: "inline-block",
    marginRight: "7px",
    fontSize: "0.75rem",
  },

  /* ================= EMPTY ================= */

  emptyState: {
    color: "var(--soc-safe)",
    fontSize: "0.9rem",

    padding: "20px 0",

    textAlign: "center",
  },
};

export default IOCExplorer;