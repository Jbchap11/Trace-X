import { useState, useEffect } from "react";
import { getGraphData } from "../../services/dataProvider";

function GraphView() {
  const [graph, setGraph] = useState(null);

  useEffect(() => {
    getGraphData().then((result) => setGraph(result));
  }, []);

  if (!graph) return <p>Loading graph...</p>;

  const findNode = (id) => graph.nodes.find((n) => n.id === id);

  return (
    <div style={styles.card}>
      <span style={styles.cornerTL} />
      <span style={styles.cornerTR} />
      <span style={styles.cornerBL} />
      <span style={styles.cornerBR} />

      <p style={styles.title}>GRAPH VIEW</p>

      <svg viewBox="0 0 500 340" style={styles.svg}>
        {graph.edges.map((edge, i) => {
          const from = findNode(edge.from);
          const to = findNode(edge.to);

          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="var(--soc-border-bright)"
              strokeWidth="1.5"
            />
          );
        })}

        {graph.nodes.map((node) => (
          <g key={node.id}>
            <rect
              x={node.x - 40}
              y={node.y - 15}
              width="80"
              height="30"
              rx="6"
              fill="rgba(10, 25, 42, 0.78)"
              stroke="var(--soc-cyan)"
              strokeWidth="1"
            />

            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              fontSize="11"
              fill="#F2F7FA"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

const styles = {
  card: {
    width: "min(680px, 95%)",

    // Transparent glass background
    background:
      "linear-gradient(135deg, rgba(10, 22, 38, 0.48), rgba(12, 25, 42, 0.30))",

    // Background remains visible
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",

    border: "1px solid rgba(39, 216, 242, 0.45)",
    borderRadius: "12px",

    padding: "26px 30px",
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
    fontSize: "0.78rem",
    letterSpacing: "1px",
    fontWeight: "bold",
    marginBottom: "18px",
    textShadow: "0 0 12px rgba(39, 216, 242, 0.35)",
  },

  svg: {
    width: "100%",
    height: "340px",
  },
};

export default GraphView;