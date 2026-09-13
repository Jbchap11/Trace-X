import { useEffect, useState } from "react";
import { getReport } from "../services/dataProvider";
import ThreatGlobe from "../components/sections/ThreatGlobe";
import EvidenceCard from "../components/sections/EvidenceCard";
import AISummaryCard from "../components/sections/AISummaryCard";
import IOCExplorer from "../components/sections/IOCExplorer";
import GraphView from "../components/sections/GraphView";
import TimelineView from "../components/sections/TimelineView";
import ForensicReportCard from "../components/sections/ForensicReportCard";

function ReportSectionPage({ section, onBack, backLabel, emailId, caseId }) {
  const [report, setReport] = useState(null);
  const sectionDetails = {
    evidence: {
      label: "Evidence",
      content: <EvidenceCard emailId={emailId} />,
    },
    threatMap: {
      label: "Threat Map",
      content: <ThreatGlobe caseId={caseId} />,
    },
    aiSummary: {
      label: "AI Summary",
      content: <AISummaryCard />,
      },
      iocExplorer: {
        label: "IOC Explorer",
        content: <IOCExplorer caseId={caseId} emailId={emailId} />,
      },
      graphView: {
        label: "Graph View",
        content: <GraphView caseId={caseId} />,
      },
      timeline: {
        label: "Timeline",
        content: <TimelineView />,
      },
    };
  const detail = sectionDetails[section];

  useEffect(() => {
    if (section === "forensicReport") {
      getReport().then((result) => setReport(result));
    }
  }, [section]);

  if (!detail && section !== "forensicReport") {
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} className="efa-btn-secondary"onClick={onBack}>
          {backLabel || "← Back to Full Report"}
        </button>
        <p style={styles.title} className="efa-glow-title">
          {section === "forensicReport" ? "Forensic Report" : detail.label}
        </p>
      </div>

      <div style={styles.content}>
        {section === "forensicReport" ? (
          report ? (
            <ForensicReportCard report={report} />
          ) : (
            <p style={styles.loading}>Loading report...</p>
          )
        ) : (
          detail.content
        )}
      </div>
    </div>
  );
}

const styles = {
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
  header: {
    width: "500px",
    maxWidth: "100%",
    marginBottom: "24px",
  },
  backButton: {
    border: "1px solid var(--soc-border-bright)",
    borderRadius: "8px",
    backgroundColor: "var(--soc-card)",
    padding: "9px 14px",
    color: "var(--soc-text)",
    cursor: "pointer",
  },
  title: {
    margin: "22px 0 0",
    color: "var(--soc-cyan)",
    fontSize: "1.15rem",
    fontWeight: "bold",
    letterSpacing: "1px",
  },
  content: {
    width: "500px",
    maxWidth: "100%",
    color: "var(--soc-muted)",
    fontSize: "0.9rem",
  },
  loading: {
    color: "var(--soc-muted)",
  },
};

export default ReportSectionPage;