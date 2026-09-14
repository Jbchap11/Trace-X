import { useState, useEffect } from "react";
import { getCases } from "../services/dataProvider";

function CasesListPage({ onSelectCase }) {
  const [cases, setCases] = useState(null);

  useEffect(() => {
    getCases().then((result) => setCases(result));
  }, []);

  const statusColor = {
    "High Risk": "var(--soc-danger)",
    "Medium Risk": "var(--soc-warning)",
    "Low Risk": "var(--soc-safe)",
  };

  if (!cases) return <p style={styles.loading}>Loading cases...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title} className="efa-glow-title">
        CASES
      </h2>

      <div style={styles.grid}>
        {cases.map((c) => (
          <div
            key={c.id}
            style={{
              ...styles.card,
              borderLeft: `3px solid ${
                statusColor[c.status] || "var(--soc-cyan)"
              }`,
            }}
            className="efa-card efa-clickable"
            onClick={() => onSelectCase(c.id)}
          >
            <p style={styles.caseId}>CASE #{c.id}</p>

            <p style={styles.subject}>{c.subject}</p>

            <p
              style={{
                ...styles.status,
                color: statusColor[c.status] || "var(--soc-text)",
              }}
            >
              ● {c.status}
            </p>

            <p style={styles.classification}>{c.classification}</p>

            <p style={styles.date}>{c.created}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",

    // Keeps your main background visible
    backgroundColor: "transparent",

    color: "var(--soc-text)",
    fontFamily: "var(--font-ui)",

    padding: "40px 40px 40px 110px",
  },

  loading: {
    color: "var(--soc-muted)",
    padding: "40px",
  },

  title: {
    color: "var(--soc-cyan)",
    fontSize: "1.4rem",
    letterSpacing: "1px",
    marginBottom: "24px",

    textShadow: "0 0 18px rgba(39, 216, 242, 0.28)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "18px",
  },

  card: {
    // Transparent glass background
    background:
      "linear-gradient(135deg, rgba(10, 22, 38, 0.48), rgba(12, 25, 42, 0.30))",

    // Glass effect
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",

    // Subtle border
    border: "1px solid rgba(39, 216, 242, 0.35)",
    borderRadius: "12px",

    padding: "20px",
    cursor: "pointer",

    // Soft shadow
    boxShadow:
      "0 10px 28px rgba(0, 0, 0, 0.20), inset 0 0 20px rgba(39, 216, 242, 0.02)",

    transition:
      "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
  },

  caseId: {
    fontSize: "0.75rem",
    color: "#9AAEBC",
    marginBottom: "10px",
    letterSpacing: "0.5px",
  },

  subject: {
    fontSize: "1rem",

    // Bright text for transparent background
    color: "#F2F7FA",

    marginBottom: "12px",
    fontWeight: "bold",

    textShadow: "0 1px 3px rgba(0, 0, 0, 0.55)",
  },

  status: {
    fontSize: "0.85rem",
    marginBottom: "6px",
    fontWeight: "500",

    textShadow: "0 1px 3px rgba(0, 0, 0, 0.45)",
  },

  classification: {
    fontSize: "0.85rem",
    color: "#B8C8D3",
    marginBottom: "10px",

    textShadow: "0 1px 3px rgba(0, 0, 0, 0.4)",
  },

  date: {
    fontSize: "0.75rem",
    color: "#8499A8",
  },
};

export default CasesListPage;