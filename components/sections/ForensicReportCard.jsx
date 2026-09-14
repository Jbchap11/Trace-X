function ForensicReportCard({ report, onOpen }) {
  const cardStyle = {
    ...styles.reportCard,
    ...(onOpen ? styles.interactive : {}),
  };

  return (
    <div
      style={cardStyle}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (onOpen && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onOpen();
        }
      }}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
    >
      <span style={styles.cornerTL} />
      <span style={styles.cornerTR} />
      <span style={styles.cornerBL} />
      <span style={styles.cornerBR} />

      <p style={styles.reportLabel}>
        FORENSIC REPORT — {report.caseId}
      </p>

      <p style={styles.verdict}>{report.verdict}</p>

      {report.sections.map((section, i) => (
        <div key={i} style={styles.section}>
          <p style={styles.sectionHeading}>
            {section.icon} {section.heading}
          </p>

          <p style={styles.sectionText}>{section.text}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  reportCard: {
    // Transparent glass background
    background:
      "linear-gradient(135deg, rgba(10, 22, 38, 0.48), rgba(12, 25, 42, 0.30))",

    // Keeps background visible
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",

    // Subtle futuristic border
    border: "1px solid rgba(39, 216, 242, 0.45)",
    borderRadius: "14px",

    padding: "30px 40px",
    width: "min(680px, 95%)",
    maxWidth: "100%",
    marginBottom: "30px",
    position: "relative",

    // Soft glass shadow
    boxShadow:
      "0 12px 35px rgba(0, 0, 0, 0.22), inset 0 0 25px rgba(39, 216, 242, 0.025)",

    overflow: "hidden",

    // Smooth interaction
    transition: "transform 0.2s ease, border-color 0.2s ease",
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

  interactive: {
    cursor: "pointer",
  },

  reportLabel: {
    color: "var(--soc-cyan)",
    fontSize: "0.78rem",
    letterSpacing: "1px",
    fontWeight: "bold",
    marginBottom: "14px",

    textShadow: "0 0 12px rgba(39, 216, 242, 0.35)",
  },

  verdict: {
    fontSize: "1.15rem",
    fontWeight: "bold",

    color: "var(--soc-danger)",

    marginBottom: "22px",
    paddingBottom: "18px",

    // Softer separator
    borderBottom: "1px solid rgba(120, 160, 180, 0.22)",

    textShadow: "0 1px 4px rgba(0, 0, 0, 0.55)",
  },

  section: {
    marginBottom: "18px",
  },

  sectionHeading: {
    fontSize: "0.95rem",
    fontWeight: "bold",
    marginBottom: "6px",

    // Brighter heading
    color: "#F2F7FA",

    textShadow: "0 1px 3px rgba(0, 0, 0, 0.55)",
  },

  sectionText: {
    fontSize: "0.88rem",
    lineHeight: "1.7",

    // Improved readability on transparent card
    color: "#B8C8D3",

    margin: 0,

    textShadow: "0 1px 3px rgba(0, 0, 0, 0.45)",
  },
};

export default ForensicReportCard;