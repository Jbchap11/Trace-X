import { useState, useEffect } from "react";
import { getReport } from "../services/dataProvider";
import ForensicReportCard from "../components/sections/ForensicReportCard";

const tabs = [
  { id: "evidence", label: "Evidence" },
  { id: "aiSummary", label: "AI Summary" },
  { id: "iocExplorer", label: "IOC Explorer" },
  { id: "graphView", label: "Graph View" },
  { id: "timeline", label: "Timeline" },
  { id: "threatMap", label: "Threat Map" },
];

function FinalReportPage({ onOpenSection, showBackButton, onBack, emailId }) {
  const [report, setReport] = useState(null);

  useEffect(() => {
    getReport().then((result) => setReport(result));
  }, []);

  if (!report) {
    return (
      <div style={styles.container}>
        <p>Loading report...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {showBackButton && (
        <button style={styles.backButton} className="efa-btn-secondary"onClick={onBack}>
          ← Back to Case
        </button>
      )}

      <div style={styles.reportCard} className="efa-card">
        <span style={styles.cornerTL} />
        <span style={styles.cornerTR} />
        <span style={styles.cornerBL} />
        <span style={styles.cornerBR} />
        <p style={styles.reportLabel}>FORENSIC REPORT — {report.caseId}</p>
        <p style={styles.verdict}>{report.verdict}</p>

        <ForensicReportCard
          report={report}
          onOpen={() => onOpenSection?.("forensicReport")}
        />
      </div>

      <div style={styles.tabBar}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              onOpenSection?.(tab.id);
            }}
            style={{
              ...styles.tabButton,
              borderBottom: "2px solid transparent",
              color: "var(--soc-muted)",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  reportCard: {
    width: "min(640px, 92%)",
    backgroundColor: "rgba(18, 29, 46, 0.72)",
    backdropFilter: "blur(6px)",
    border: "1px solid var(--soc-border-bright)",
    borderRadius: "12px",
    padding: "28px",
    marginBottom: "24px",
    boxShadow: "0 18px 44px rgb(0 0 0 / 24%)",
    position: "relative",
  },
  reportLabel: {
    color: "var(--soc-cyan)",
    fontSize: "0.8rem",
    letterSpacing: "1px",
    fontWeight: "bold",
    margin: "0 0 8px 0",
  },
  verdict: {
    color: "var(--soc-text)",
    fontSize: "1.1rem",
    fontWeight: "bold",
    margin: "0 0 16px 0",
  },
  container: {
    minHeight: "100vh",
    backgroundColor: "transparent",
    color: "var(--soc-text)",
    padding: "40px 20px",
    fontFamily: "var(--font-ui)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    background: "none",
    border: "1px solid var(--soc-border-bright)",
    color: "var(--soc-cyan)",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "0.85rem",
    cursor: "pointer",
    marginBottom: "20px",
    fontFamily: "var(--font-ui)",
  },
  tabBar: {
    display: "flex",
    gap: "24px",
    width: "500px",
    borderBottom: "1px solid var(--soc-border)",
    marginBottom: "24px",
  },
  tabButton: {
    background: "none",
    border: "none",
    padding: "10px 0",
    fontSize: "0.9rem",
    cursor: "pointer",
    fontFamily: "var(--font-ui)",
  },
};

export default FinalReportPage;