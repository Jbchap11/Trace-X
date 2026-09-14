import { useState, useEffect } from "react";
import { getThreatAnalysis } from "../services/dataProvider";

function ThreatAnalysisPage({ onNext , emailId}) {
  const [data, setData] = useState(null);

  useEffect(() => {
    getThreatAnalysis(emailId).then((result) => setData(result));
  }, [emailId]);

  if (!data) {
    return (
      <div style={styles.container}>
        <p>Loading...</p>
      </div>
    );
  }

  const { suspicious, category, riskLevel, confidence, reasons } = data;

  const riskColor =
    riskLevel === "High Risk"
      ? "var(--soc-danger)"
      : riskLevel === "Medium Risk"
      ? "var(--soc-warning)"
      : "var(--soc-safe)";

  return (
    <div style={styles.container}>
      <h2 style={styles.title} className="efa-glow-title">Threat Analysis</h2>

          <div style={styles.card}>
            <span style={styles.cornerTL} />
            <span style={styles.cornerTR} />
            <span style={styles.cornerBL} />
            <span style={styles.cornerBR} />
            <div style={styles.row}>
          <span style={styles.label}>Status</span>
          <span style={{ ...styles.value, color: suspicious ? "var(--soc-danger)" : "var(--soc-safe)" }}>
            {suspicious ? "⚠ Suspicious" : "✔ Not Suspicious"}
          </span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Category</span>
          <span style={styles.value}>{category}</span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Risk Level</span>
          <span style={{ ...styles.value, color: riskColor, fontWeight: "bold" }}>
            {riskLevel}
          </span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Confidence</span>
          <span style={styles.value}>{confidence}%</span>
        </div>

        <div style={styles.whySection}>
          <p style={styles.whyTitle}>WHY?</p>
          <ul style={styles.reasonsList}>
            {reasons.map((reason, i) => (
              <li key={i} style={styles.reasonItem}>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button style={styles.nextButton} className="efa-btn-primary" onClick={onNext}>
        NEXT
      </button>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "transparent",
    color: "var(--soc-text)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "50px 20px",
    fontFamily: "var(--font-ui)",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    marginBottom: "30px",
  },
  card: {
    backgroundColor: "rgba(18, 29, 46, 0.72)",
    backdropFilter: "blur(6px)",
    border: "1px solid var(--soc-border)",
    borderRadius: "14px",
    padding: "32px 40px",
    width: "min(560px, 90%)",
    marginBottom: "30px",
    position: "relative",
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
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "16px",
    fontSize: "0.95rem",
    paddingLeft: "12px",
    borderLeft: "2px solid var(--soc-border-bright)",
  },
  label: {
    color: "var(--soc-muted)",
  },
  value: {
    fontWeight: "500",
  },
  whySection: {
    marginTop: "20px",
    borderTop: "1px solid var(--soc-border)",
    paddingTop: "16px",
  },
  whyTitle: {
    fontWeight: "bold",
    marginBottom: "10px",
    letterSpacing: "1px",
  },
  reasonsList: {
    margin: 0,
    paddingLeft: "18px",
    color: "var(--soc-muted)",
    fontSize: "0.88rem",
    lineHeight: "1.6",
  },
  reasonItem: {
    marginBottom: "6px",
  },
  nextButton: {
    backgroundColor: "var(--soc-blue)",
    color: "var(--soc-text)",
    border: "1px solid var(--soc-blue)",
    padding: "14px 40px",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 0 24px rgb(61 139 253 / 20%)",
  },
};

export default ThreatAnalysisPage;