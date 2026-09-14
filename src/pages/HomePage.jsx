import { useState } from "react";
import { uploadEmail } from "../services/dataProvider";

function HomePage({ onStartAnalysis }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleStartAnalysis = async () => {
    if (!file) {
      alert("Please upload an email file first.");
      return;
    }
    const emailId = await uploadEmail(file);
    onStartAnalysis(file, emailId);
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <span style={styles.eyebrow}>DIGITAL EVIDENCE &nbsp;→&nbsp; REAL INSIGHTS</span>
        <div style={styles.profilePill}>
          <span style={styles.profileDot} />
          Investigator
        </div>
      </div>

      <div style={styles.heroRow}>
        <div>
          <h1 style={styles.title} className="efa-glow-title">
            Email Forensic <span style={styles.titleAccent}>Analyzer</span>
          </h1>
          <p style={styles.subtitle}>
            Detect &nbsp;•&nbsp; Investigate &nbsp;•&nbsp; Understand
          </p>
        </div>

        <div style={styles.envelopeWrap}>
          <svg width="90" height="90" viewBox="0 0 100 100" fill="none">
            <defs>
              <linearGradient id="envGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#3d8bfd" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" stroke="url(#envGrad)" strokeWidth="1" opacity="0.35" />
            <rect x="20" y="30" width="60" height="42" rx="6" fill="url(#envGrad)" opacity="0.9" />
            <path d="M20 34 L50 56 L80 34" stroke="#0d1728" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="18" cy="28" r="2.5" fill="var(--soc-cyan)" />
            <circle cx="84" cy="42" r="2" fill="var(--soc-cyan)" />
            <circle cx="70" cy="18" r="1.5" fill="#c084fc" />
          </svg>
          <p style={styles.envelopeCaption}>Every email has a story...</p>
        </div>
      </div>

      <div style={styles.uploadBox} className="efa-card">
        <div style={styles.uploadIcon}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--soc-cyan)" strokeWidth="1.6">
            <rect x="4" y="3" width="16" height="18" rx="2" />
            <path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
          </svg>
        </div>
        <p style={styles.uploadTitle}>Choose a File</p>
        <p style={styles.uploadHint}>
          Upload your email file (e.g. .eml, .msg, .txt) to begin forensic analysis.
        </p>
        <label style={styles.browseButton} className="efa-btn-primary">
          Browse Files
          <input type="file" onChange={handleFileChange} style={{ display: "none" }} />
        </label>
        <p style={styles.fileName}>
          {file ? `Selected: ${file.name}` : "No file chosen"}
        </p>
      </div>

      <button style={styles.startButton} className="efa-btn-primary" onClick={handleStartAnalysis}>
        Start Analysis →
      </button>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    color: "var(--soc-text)",
    fontFamily: "var(--font-ui)",
    padding: "40px 60px",
  },
  topBar: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "10px",
  },
  eyebrow: {
    position: "absolute",
    left: "60px",
    color: "var(--soc-subtle)",
    fontSize: "0.75rem",
    letterSpacing: "1px",
  },
  profilePill: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "1px solid var(--soc-border)",
    borderRadius: "999px",
    padding: "6px 14px",
    fontSize: "0.85rem",
    color: "var(--soc-text)",
    backgroundColor: "var(--soc-card)",
  },
  profileDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "var(--soc-cyan)",
  },
  heroRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "60px",
    marginBottom: "40px",
    flexWrap: "wrap",
    gap: "24px",
  },
  title: {
    fontSize: "2.4rem",
    fontWeight: "bold",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  titleAccent: {
    background: "linear-gradient(90deg, #c084fc, var(--soc-cyan))",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    color: "var(--soc-muted)",
    marginTop: "10px",
    fontSize: "0.95rem",
    letterSpacing: "1px",
  },
  envelopeWrap: {
    textAlign: "center",
  },
  envelopeCaption: {
    color: "var(--soc-subtle)",
    fontSize: "0.75rem",
    fontStyle: "italic",
    marginTop: "6px",
  },
  uploadBox: {
    border: "1px dashed var(--soc-border-bright)",
    borderRadius: "14px",
    padding: "36px",
    width: "440px",
    maxWidth: "100%",
    textAlign: "center",
    marginBottom: "28px",
    backgroundColor: "var(--soc-card)",
    boxShadow: "0 18px 44px rgb(0 0 0 / 24%)",
  },
  uploadIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--soc-card-raised)",
    margin: "0 auto 14px",
  },
  uploadTitle: {
    fontWeight: "bold",
    fontSize: "1rem",
    margin: "0 0 6px",
  },
  uploadHint: {
    color: "var(--soc-muted)",
    fontSize: "0.82rem",
    marginBottom: "18px",
  },
  browseButton: {
    display: "inline-block",
    background: "linear-gradient(90deg, #c084fc, var(--soc-blue))",
    color: "white",
    border: "none",
    padding: "11px 22px",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: "bold",
    cursor: "pointer",
  },
  fileName: {
    marginTop: "12px",
    color: "var(--soc-subtle)",
    fontSize: "0.8rem",
  },
  startButton: {
    background: "linear-gradient(90deg, var(--soc-blue), #8b5cf6)",
    color: "var(--soc-text)",
    border: "none",
    padding: "14px 32px",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 0 24px rgba(61, 139, 253, 0.28)",
  },
};

export default HomePage;