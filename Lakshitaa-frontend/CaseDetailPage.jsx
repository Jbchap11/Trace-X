import { useState, useEffect } from "react";
import { getCaseById } from "../services/dataProvider";

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <p style={styles.sectionTitle}>{title}</p>
      <div style={styles.sectionDivider} />
      <div style={styles.sectionBody}>{children}</div>
    </div>
  );
}

function CaseDetailPage({
  caseId,
  onViewReport,
  onViewGraph,
  onCloseCase,
  onViewEmail,
  onInvestigateIOC,
}) {
  const [caseData, setCaseData] = useState(null);

  useEffect(() => {
    getCaseById(caseId).then((result) => setCaseData(result));
  }, [caseId]);

  if (!caseData) return <p style={styles.loading}>Loading case...</p>;

  const statusColor =
    caseData.status === "OPEN" ? "var(--soc-warning)" : "var(--soc-safe)";
  const priorityColor =
    caseData.priority === "HIGH"
      ? "var(--soc-danger)"
      : caseData.priority === "MEDIUM"
      ? "var(--soc-warning)"
      : "var(--soc-safe)";

  return (
    <div style={styles.container}>
      <div style={styles.frame} className="efa-card efa-scan-frame">
        {/* CASE DETAILS */}
        <span style={styles.cornerTL} />
        <span style={styles.cornerTR} />
        <span style={styles.cornerBL} />
        <span style={styles.cornerBR} />
        <Section title="CASE DETAILS">
          <p style={styles.caseIdLine}>CASE #{caseData.id}</p>
          <p style={styles.subjectLine}>{caseData.subjectLine}</p>
          <div style={styles.statusRow}>
            <span>
              Status:{" "}
              <span style={{ color: statusColor, fontWeight: "bold" }}>
                [ {caseData.status} ]
              </span>
            </span>
            <span>
              Priority:{" "}
              <span style={{ color: priorityColor, fontWeight: "bold" }}>
                [ {caseData.priority} ]
              </span>
            </span>
          </div>
        </Section>

        {/* CASE SUMMARY */}
        <Section title="CASE SUMMARY">
          <p style={styles.label}>Description:</p>
          <p style={styles.text}>{caseData.description}</p>

          <div style={styles.metaGrid}>
            <p style={styles.metaLine}>
              Classification: <span style={styles.metaValue}>{caseData.classification}</span>
            </p>
            <p style={styles.metaLine}>
              Risk Score: <span style={styles.metaValue}>{caseData.riskScore}/100</span>
            </p>
            <p style={styles.metaLine}>
              Created: <span style={styles.metaValue}>{caseData.created}</span>
            </p>
            <p style={styles.metaLine}>
              Last Updated: <span style={styles.metaValue}>{caseData.lastUpdated}</span>
            </p>
          </div>
        </Section>

        {/* RELATED EMAILS */}
        <Section title="RELATED EMAILS">
          <div style={styles.tableHeader}>
            <span style={styles.th}>Email ID</span>
            <span style={styles.th}>Sender</span>
            <span style={styles.th}>Subject</span>
            <span style={styles.th}>Action</span>
          </div>
          {caseData.relatedEmails.map((email, i) => (
            <div key={i} style={styles.tableRow}>
              <span style={styles.td}>{email.emailId}</span>
              <span style={styles.td}>{email.sender}</span>
              <span style={styles.td}>{email.subject}</span>
              <span
                style={styles.tdLink}
                onClick={() => onViewEmail(email.emailId)}
              >
                View Email
              </span>
            </div>
          ))}
        </Section>

        {/* RELATED IOCs */}
        <Section title="RELATED IOCs">
          {caseData.relatedIOCs.length === 0 ? (
            <p style={styles.text}>No IOCs found for this case.</p>
          ) : (
            <>
              <div style={styles.tableHeader}>
                <span style={styles.th}>Type</span>
                <span style={styles.th}>IOC Value</span>
                <span style={styles.th}>Confidence</span>
                <span style={styles.th}>Action</span>
              </div>
              {caseData.relatedIOCs.map((ioc, i) => (
                <div key={i} style={styles.tableRow}>
                  <span style={styles.td}>{ioc.type}</span>
                  <span style={styles.td}>{ioc.value}</span>
                  <span style={styles.td}>{ioc.confidence}</span>
                  <span
                    style={styles.tdLink}
                    onClick={() => onInvestigateIOC(ioc.value)}
                  >
                    Investigate
                  </span>
                </div>
              ))}
            </>
          )}
        </Section>

        {/* INVESTIGATION EVIDENCE */}
        <Section title="INVESTIGATION EVIDENCE">
          <ul style={styles.evidenceList}>
            {caseData.evidenceList.map((point, i) => (
              <li key={i} style={styles.evidenceItem}>
                {point}
              </li>
            ))}
          </ul>
        </Section>

        {/* ACTIONS */}
        <Section title="ACTIONS">
          <div style={styles.actionsRow}>
            <button style={styles.actionButton} className="efa-btn-         secondary" onClick={onCloseCase}>
              Close Case
            </button>
          </div>
          <div style={styles.actionsRow}>
            <button style={styles.primaryButton} className="efa-btn-primary"onClick={onViewReport}>
              View Forensic Report
            </button>
            <button style={styles.primaryButton} className="efa-btn-primary"onClick={onViewGraph}>
              View Graph
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}

const styles = {
  cornerTL: { position: "absolute", top: "8px", left: "8px", width: "16px", height: "16px", borderTop: "2px solid var(--soc-cyan)", borderLeft: "2px solid var(--soc-cyan)" },
  cornerTR: { position: "absolute", top: "8px", right: "8px", width: "16px", height: "16px", borderTop: "2px solid var(--soc-cyan)", borderRight: "2px solid var(--soc-cyan)" },
  cornerBL: { position: "absolute", bottom: "8px", left: "8px", width: "16px", height: "16px", borderBottom: "2px solid var(--soc-cyan)", borderLeft: "2px solid var(--soc-cyan)" },
  cornerBR: { position: "absolute", bottom: "8px", right: "8px", width: "16px", height: "16px", borderBottom: "2px solid var(--soc-cyan)", borderRight: "2px solid var(--soc-cyan)" },
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
    width: "min(820px, 92%)",
    maxWidth: "100%",
    border: "1px solid var(--soc-border-bright)",
    borderRadius: "10px",
    backgroundColor: "rgba(18, 29, 46, 0.72)",
    backdropFilter: "blur(6px)",
    boxShadow: "0 18px 44px rgb(0 0 0 / 24%)",
    position: "relative",
  },
  section: {
    borderBottom: "1px solid var(--soc-border)",
    padding: "18px 24px",
  },
  sectionTitle: {
    color: "var(--soc-cyan)",
    fontSize: "0.85rem",
    letterSpacing: "1px",
    fontWeight: "bold",
    margin: "0 0 10px 0",
  },
  sectionDivider: {
    borderBottom: "1px solid var(--soc-border)",
    marginBottom: "12px",
  },
  sectionBody: {
    fontSize: "0.88rem",
  },
  caseIdLine: {
    color: "var(--soc-muted)",
    margin: "0 0 4px 0",
  },
  subjectLine: {
    color: "var(--soc-text)",
    fontWeight: "bold",
    fontSize: "1rem",
    margin: "0 0 12px 0",
  },
  statusRow: {
    display: "flex",
    gap: "30px",
    color: "var(--soc-muted)",
  },
  label: {
    color: "var(--soc-muted)",
    margin: "0 0 4px 0",
  },
  text: {
    color: "var(--soc-text)",
    lineHeight: "1.6",
    margin: "0 0 16px 0",
  },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },
  metaLine: {
    color: "var(--soc-muted)",
    margin: 0,
  },
  metaValue: {
    color: "var(--soc-text)",
  },
  tableHeader: {
    display: "flex",
    gap: "10px",
    paddingBottom: "8px",
    borderBottom: "1px solid var(--soc-border)",
    marginBottom: "8px",
    color: "var(--soc-muted)",
    fontSize: "0.78rem",
  },
  th: {
    flex: 1,
  },
  tableRow: {
    display: "flex",
    gap: "10px",
    padding: "8px 0",
    borderBottom: "1px solid var(--soc-border)",
    fontSize: "0.85rem",
  },
  td: {
    flex: 1,
    color: "var(--soc-text)",
  },
  tdLink: {
    flex: 1,
    color: "var(--soc-cyan)",
    cursor: "pointer",
  },
  evidenceList: {
    margin: 0,
    paddingLeft: "18px",
    color: "var(--soc-text)",
    lineHeight: "1.9",
  },
  evidenceItem: {
    marginBottom: "4px",
  },
  actionsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "10px",
  },
  actionButton: {
    backgroundColor: "var(--soc-panel)",
    color: "var(--soc-text)",
    border: "1px solid var(--soc-border-bright)",
    padding: "8px 14px",
    borderRadius: "6px",
    fontSize: "0.8rem",
    cursor: "pointer",
    fontFamily: "var(--font-ui)",
  },
  primaryButton: {
    backgroundColor: "var(--soc-card-raised)",
    color: "var(--soc-cyan)",
    border: "1px solid var(--soc-cyan)",
    padding: "10px 16px",
    borderRadius: "6px",
    fontSize: "0.85rem",
    fontWeight: "bold",
    cursor: "pointer",
    fontFamily: "var(--font-ui)",
  },
};

export default CaseDetailPage;