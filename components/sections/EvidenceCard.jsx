import { useState, useEffect } from "react";
import { getEvidence } from "../../services/dataProvider";

function EvidenceCard({ emailId }) {
  const [evidence, setEvidence] = useState(null);

  useEffect(() => {
    getEvidence(emailId).then((result) => setEvidence(result));
  }, [emailId]);

  const flagColor = {
    warning: "var(--soc-warning)",
    danger: "var(--soc-danger)",
  };

  if (!evidence) return <p>Loading evidence...</p>;

  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "—";
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return String(value);
  };

  return (
    <div style={styles.card} className="efa-card">
      <span style={styles.cornerTL} />
      <span style={styles.cornerTR} />
      <span style={styles.cornerBL} />
      <span style={styles.cornerBR} />

      <p style={styles.title}>EVIDENCE</p>

      {evidence.map((item, i) => (
        <div
          key={i}
          style={{
            ...styles.item,
            borderLeft: `2px solid ${
              item.flagType === "danger"
                ? "var(--soc-danger)"
                : "var(--soc-warning)"
            }`,
          }}
        >
          <p style={styles.label}>{item.label}</p>

          <p style={styles.value}>{formatValue(item.value)}</p>

          <p
            style={{
              ...styles.flag,
              color: flagColor[item.flagType],
            }}
          >
            {item.flagType === "danger" ? "🔴" : "⚠️"} {item.flag}
          </p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: {
    width: "min(820px, 95%)",
    background:
      "linear-gradient(135deg, rgba(10, 22, 38, 0.48), rgba(12, 25, 42, 0.30))",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(39, 216, 242, 0.45)",
    borderRadius: "12px",
    padding: "30px 40px",
    position: "relative",
    boxShadow:
      "0 12px 35px rgba(0, 0, 0, 0.22), inset 0 0 25px rgba(39, 216, 242, 0.025)",
    overflow: "hidden",
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
  title: {
    color: "var(--soc-cyan)",
    fontSize: "0.8rem",
    letterSpacing: "1px",
    fontWeight: "bold",
    marginBottom: "20px",
    textShadow: "0 0 12px rgba(39, 216, 242, 0.35)",
  },
  item: {
    marginBottom: "18px",
    paddingBottom: "14px",
    paddingLeft: "14px",
    borderBottom: "1px solid rgba(120, 160, 180, 0.18)",
  },
  label: {
    fontSize: "0.75rem",
    color: "var(--soc-subtle)",
    marginBottom: "4px",
    letterSpacing: "0.5px",
  },
  value: {
    fontSize: "0.95rem",
    color: "#F2F7FA",
    marginBottom: "4px",
    fontWeight: "500",
    textShadow: "0 1px 3px rgba(0, 0, 0, 0.6)",
  },
  flag: {
    fontSize: "0.85rem",
    margin: 0,
    fontWeight: "500",
    textShadow: "0 1px 3px rgba(0, 0, 0, 0.5)",
  },
};

export default EvidenceCard;