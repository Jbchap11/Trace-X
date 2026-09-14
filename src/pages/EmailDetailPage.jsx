import { useState, useEffect } from "react";
import { getEmailById } from "../services/dataProvider";

function EmailDetailPage({ emailId, onBack }) {
  const [email, setEmail] = useState(null);

  useEffect(() => {
    getEmailById(emailId).then((result) => setEmail(result));
  }, [emailId]);

  if (!email) return <p style={styles.loading}>Loading email...</p>;

  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "—";
    }

    if (Array.isArray(value)) {
      return value.map((item) => formatValue(item)).join(", ");
    }

    if (typeof value === "object") {
      return Object.entries(value)
        .map(([key, item]) => `${key}: ${formatValue(item)}`)
        .join(" · ");
    }

    return String(value);
  };

  const headers = email.headers || {};
  const extractedUrls = email.extractedUrls || [];
  const attachments = email.attachments || [];

  return (
    <div style={styles.container}>
      <div style={styles.frame} className="efa-card">
        <span style={styles.cornerTL} />
        <span style={styles.cornerTR} />
        <span style={styles.cornerBL} />
        <span style={styles.cornerBR} />
        <button style={styles.backButton} className="efa-btn-secondary" onClick={onBack}>
          ← Back to Case
        </button>

        <div style={styles.section}>
          <p style={styles.sectionTitle}>EMAIL DETAILS</p>
          <div style={styles.divider} />
          <p style={styles.line}><span style={styles.label}>From:</span> {formatValue(email.from)}</p>
          <p style={styles.line}><span style={styles.label}>To:</span> {formatValue(email.to)}</p>
          <p style={styles.line}><span style={styles.label}>Subject:</span> {formatValue(email.subject)}</p>
          <p style={styles.line}><span style={styles.label}>Date:</span> {formatValue(email.date)}</p>
        </div>

        <div style={styles.section}>
          <p style={styles.sectionTitle}>BODY</p>
          <div style={styles.divider} />
          <p style={styles.body}>{formatValue(email.body)}</p>
        </div>

        <div style={styles.section}>
          <p style={styles.sectionTitle}>HEADERS</p>
          <div style={styles.divider} />
          {Object.entries(headers).map(([key, value]) => (
            <p key={key} style={styles.line}>
              <span style={styles.label}>{key}:</span>{" "}
              <span style={{ color: value === "FAIL" ? "var(--soc-danger)" : "var(--soc-text)" }}>
                {formatValue(value)}
              </span>
            </p>
          ))}
        </div>

        <div style={styles.section}>
          <p style={styles.sectionTitle}>EXTRACTED URLS</p>
          <div style={styles.divider} />
          {extractedUrls.length === 0 ? (
            <p style={styles.body}>None found.</p>
          ) : (
            extractedUrls.map((url, i) => (
              <p key={i} style={styles.body}>{formatValue(url)}</p>
            ))
          )}
        </div>

        <div style={styles.section}>
          <p style={styles.sectionTitle}>ATTACHMENTS</p>
          <div style={styles.divider} />
          {attachments.length === 0 ? (
            <p style={styles.body}>None found.</p>
          ) : (
            attachments.map((file, i) => (
              <p key={i} style={styles.body}>{formatValue(file)}</p>
            ))
          )}
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
    width: "min(720px, 92%)",
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
    lineHeight: "1.7",
    color: "var(--soc-text)",
    margin: 0,
  },
};

export default EmailDetailPage;