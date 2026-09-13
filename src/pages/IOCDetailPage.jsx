import { useState, useEffect } from "react";
import { getIOCDetail } from "../services/dataProvider";

function IOCDetailPage({ iocValue, onBack }) {
  const [ioc, setIoc] = useState(null);

  useEffect(() => {
    getIOCDetail(iocValue).then((result) => setIoc(result));
  }, [iocValue]);

  if (!ioc) return <p style={styles.loading}>Loading IOC...</p>;

  const confidenceColor = {
    High: "var(--soc-danger)",
    Medium: "var(--soc-warning)",
    Low: "var(--soc-safe)",
  };

  return (
    <div style={styles.container}>
      <div style={styles.frame} className="efa-card">
        <span style={styles.cornerTL} />
        <span style={styles.cornerTR} />
        <span style={styles.cornerBL} />
        <span style={styles.cornerBR} />
        <button style={styles.backButton} className="efa-btn-secondary"onClick={onBack}>
          ← Back to Case
        </button>

        <div style={styles.section}>
          <p style={styles.sectionTitle}>IOC PROFILE</p>
          <div style={styles.divider} />
          <p style={styles.line}><span style={styles.label}>Type:</span> {ioc.type}</p>
          <p style={styles.line}><span style={styles.label}>Value:</span> {ioc.value}</p>
          <p style={styles.line}>
            <span style={styles.label}>Confidence:</span>{" "}
            <span style={{ color: confidenceColor[ioc.confidence], fontWeight: "bold" }}>
              {ioc.confidence}
            </span>
          </p>
        </div>

        <div style={styles.section}>
          <p style={styles.sectionTitle}>DETECTION HISTORY</p>
          <div style={styles.divider} />
          <p style={styles.line}><span style={styles.label}>First Seen:</span> {ioc.firstSeen}</p>
          <p style={styles.line}><span style={styles.label}>Times Seen:</span> {ioc.timesSeen}</p>
          <p style={styles.line}><span style={styles.label}>Threat Source:</span> {ioc.threatSource}</p>
        </div>

        <div style={styles.section}>
          <p style={styles.sectionTitle}>RELATED CASES</p>
          <div style={styles.divider} />
          {ioc.relatedCases.map((caseId, i) => (
            <p key={i} style={styles.body}>CASE #{caseId}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "transparent",
    color: "var(--soc-text)",
    fontFamily: "var(--font-ui)",
    padding: "40px 40px 40px 110px",
    display: "flex",
    justifyContent: "center",
  },
  loading: {
    color: "var(--soc-muted)",
    padding: "40px",
  },
  frame: {
    width: "min(600px, 92%)",
    maxWidth: "100%",
    border: "1px solid var(--soc-border-bright)",
    borderRadius: "10px",
    backgroundColor: "rgba(18, 29, 46, 0.72)",
    backdropFilter: "blur(6px)",
    boxShadow: "0 18px 44px rgb(0 0 0 / 24%)",
    padding: "20px 0",
    position: "relative",
  },
  backButton: {
    margin: "0 24px 10px",
    border: "1px solid var(--soc-border-bright)",
    borderRadius: "8px",
    backgroundColor: "var(--soc-panel)",
    padding: "9px 14px",
    color: "var(--soc-cyan)",
    cursor: "pointer",
    fontFamily: "var(--font-ui)",
  },
  section: {
    borderBottom: "1px solid var(--soc-border)",
    padding: "16px 24px",
  },
  sectionTitle: {
    color: "var(--soc-cyan)",
    fontSize: "0.8rem",
    letterSpacing: "1px",
    fontWeight: "bold",
    margin: "0 0 8px 0",
  },
  divider: {
    borderBottom: "1px solid var(--soc-border)",
    marginBottom: "10px",
  },
  line: {
    fontSize: "0.88rem",
    margin: "0 0 6px 0",
    color: "var(--soc-text)",
  },
  label: {
    color: "var(--soc-muted)",
  },
  body: {
    fontSize: "0.88rem",
    color: "var(--soc-text)",
    margin: "0 0 4px 0",
  },
};

export default IOCDetailPage;