function Sidebar({ currentPage, onNavigate }) {
  return (
    <div style={styles.sidebar}>
      <div style={styles.brand}>
        <div style={styles.logoIcon}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 6.5 12 13l9-6.5"
              stroke="white"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="3"
              y="5"
              width="18"
              height="14"
              rx="2.5"
              stroke="white"
              strokeWidth="1.6"
            />
          </svg>
        </div>
        <p style={styles.brandText}>
          Email Forensic
          <br />
          Analyzer
        </p>
      </div>

      <button
        style={{
          ...styles.navItem,
          color: currentPage === "home" ? "var(--soc-cyan)" : "var(--soc-muted)",
          backgroundColor:
            currentPage === "home" ? "rgba(39, 216, 242, 0.12)" : "transparent",
          boxShadow:
            currentPage === "home" ? "0 0 16px rgba(39, 216, 242, 0.18)" : "none",
        }}
        onClick={() => onNavigate("home")}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={styles.navLabel}>Home</span>
      </button>

      <button
        style={{
          ...styles.navItem,
          color: currentPage === "casesList" ? "var(--soc-cyan)" : "var(--soc-muted)",
          backgroundColor:
            currentPage === "casesList" ? "rgba(39, 216, 242, 0.12)" : "transparent",
          boxShadow:
            currentPage === "casesList" ? "0 0 16px rgba(39, 216, 242, 0.18)" : "none",
        }}
        onClick={() => onNavigate("casesList")}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 7a1 1 0 0 1 1-1h4.5l2 2H20a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={styles.navLabel}>Cases</span>
      </button>

      <div style={styles.tagline}>
        Small clues.
        <br />
        Big truths.
      </div>

      <div style={styles.footer}>
        <span style={styles.statusDot} />
        <div>
          <p style={styles.footerTitle}>System Ready</p>
          <p style={styles.footerSub}>Analyze · Detect · Investigate</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "210px",
    minHeight: "100vh",
    backgroundColor: "var(--soc-panel)",
    borderRight: "1px solid var(--soc-border)",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "24px 18px",
    gap: "10px",
    position: "fixed",
    left: 0,
    top: 0,
    fontFamily: "var(--font-ui)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "22px",
  },
  logoIcon: {
    width: "34px",
    height: "34px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, var(--soc-blue), #8b5cf6)",
    boxShadow: "0 0 18px rgba(61, 139, 253, 0.35)",
    flexShrink: 0,
  },
  brandText: {
    color: "var(--soc-text)",
    fontWeight: "bold",
    fontSize: "0.82rem",
    lineHeight: "1.25",
    margin: 0,
  },
  navItem: {
    border: "none",
    fontSize: "0.9rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    transition: "background-color 160ms ease, box-shadow 160ms ease",
    fontFamily: "var(--font-ui)",
  },
  navLabel: {
    fontSize: "0.85rem",
  },
  tagline: {
    marginTop: "auto",
    color: "var(--soc-subtle)",
    fontSize: "0.8rem",
    fontStyle: "italic",
    lineHeight: "1.5",
    paddingLeft: "4px",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    borderTop: "1px solid var(--soc-border)",
    paddingTop: "16px",
    marginTop: "16px",
    width: "100%",
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "var(--soc-safe)",
    boxShadow: "0 0 8px var(--soc-safe)",
    flexShrink: 0,
  },
  footerTitle: {
    color: "var(--soc-text)",
    fontSize: "0.78rem",
    fontWeight: "bold",
    margin: 0,
  },
  footerSub: {
    color: "var(--soc-subtle)",
    fontSize: "0.68rem",
    margin: 0,
  },
};

export default Sidebar;