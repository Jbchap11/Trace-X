import { useState, useEffect } from "react";
import { getGraphData } from "../../services/dataProvider";

function GraphView({ caseId }) {
  const [graph, setGraph] = useState(null);

  useEffect(() => {
    getGraphData(caseId).then((result) => setGraph(result));
  }, [caseId]);

  if (!graph) return <p>Loading graph...</p>;

  const typeOrder = ["email", "domain", "url", "ip", "ioc"];

  const grouped = {};

  graph.nodes.forEach((node) => {
    const type = typeOrder.includes(node.type) ? node.type : "other";

    if (!grouped[type]) {
      grouped[type] = [];
    }

    grouped[type].push(node);
  });

  const rows = [];

  /*
   * Maximum 3 nodes in one row.
   * This keeps every row centered and prevents overlap.
   */
  const MAX_NODES_PER_ROW = 3;

  typeOrder
    .filter((type) => grouped[type])
    .forEach((type) => {
      const nodes = grouped[type];

      for (let i = 0; i < nodes.length; i += MAX_NODES_PER_ROW) {
        rows.push({
          type,
          nodes: nodes.slice(i, i + MAX_NODES_PER_ROW),
        });
      }
    });

  if (grouped.other) {
    const nodes = grouped.other;

    for (let i = 0; i < nodes.length; i += MAX_NODES_PER_ROW) {
      rows.push({
        type: "other",
        nodes: nodes.slice(i, i + MAX_NODES_PER_ROW),
      });
    }
  }

  // ------------------------------------------------
  // FIXED GRAPH SIZE
  // ------------------------------------------------

  const graphWidth = 750;
  const rowHeight = 145;

  const nodePositions = {};

  rows.forEach((row, rowIndex) => {
    const nodesInRow = row.nodes;
    const count = nodesInRow.length;

    /*
     * Every row is centered.
     *
     * 1 node  -> center
     * 2 nodes -> center-left + center-right
     * 3 nodes -> evenly distributed
     */

    const positions = {
      1: [graphWidth / 2],

      2: [
        graphWidth / 2 - 125,
        graphWidth / 2 + 125,
      ],

      3: [
        graphWidth / 2 - 190,
        graphWidth / 2,
        graphWidth / 2 + 190,
      ],
    };

    const xPositions = positions[count];

    nodesInRow.forEach((node, index) => {
      nodePositions[node.id] = {
        x: xPositions[index],
        y: 65 + rowIndex * rowHeight,
      };
    });
  });

  const findPos = (id) => {
    return (
      nodePositions[id] || {
        x: graphWidth / 2,
        y: 65,
      }
    );
  };

  // ------------------------------------------------
  // NODE COLORS
  // ------------------------------------------------

  const nodeColor = (type) => {
    if (type === "email") {
      return {
        border: "#27d8f2",
        glow: "rgba(39,216,242,0.45)",
        fill: "rgba(39,216,242,0.10)",
      };
    }

    if (type === "domain") {
      return {
        border: "#ff9f45",
        glow: "rgba(255,159,69,0.45)",
        fill: "rgba(255,159,69,0.10)",
      };
    }

    if (type === "url") {
      return {
        border: "#f4b740",
        glow: "rgba(244,183,64,0.45)",
        fill: "rgba(244,183,64,0.10)",
      };
    }

    if (type === "ip") {
      return {
        border: "#ff3b3b",
        glow: "rgba(255,59,59,0.45)",
        fill: "rgba(255,59,59,0.10)",
      };
    }

    return {
      border: "#a855f7",
      glow: "rgba(168,85,247,0.45)",
      fill: "rgba(168,85,247,0.10)",
    };
  };

  // ------------------------------------------------
  // GRAPH HEIGHT
  // ------------------------------------------------

  const graphHeight = Math.max(
    360,
    100 + rows.length * rowHeight
  );

  return (
    <div style={styles.card} className="efa-card">

      {/* Corner Decorations */}
      <span style={styles.cornerTL} />
      <span style={styles.cornerTR} />
      <span style={styles.cornerBL} />
      <span style={styles.cornerBR} />

      <svg
        viewBox={`0 0 ${graphWidth} ${graphHeight}`}
        style={styles.svg}
        preserveAspectRatio="xMidYMid meet"
      >

        {/* -----------------------------------------
            CONNECTION LINES
        ----------------------------------------- */}

        {graph.edges.map((edge, index) => {
          const from = findPos(edge.from || edge.source);
          const to = findPos(edge.to || edge.target);

          return (
            <line
              key={index}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="rgba(120, 160, 180, 0.4)"
              strokeWidth="1.8"
            />
          );
        })}

        {/* -----------------------------------------
            NODES
        ----------------------------------------- */}

        {graph.nodes.map((node) => {
          const pos = findPos(node.id);
          const c = nodeColor(node.type);

          const label = node.label || node.id;

          return (
            <g key={node.id}>

              {/* Node Box */}
              <rect
                x={pos.x - 85}
                y={pos.y - 28}
                width="170"
                height="56"
                rx="10"
                fill={c.fill}
                stroke={c.border}
                strokeWidth="2"
                style={{
                  filter: `drop-shadow(0 0 8px ${c.glow})`,
                }}
              />

              {/* Node Text */}
              <text
                x={pos.x}
                y={pos.y + 6}
                textAnchor="middle"
                fontSize="14"
                fontWeight="700"
                fill="#F2F7FA"
              >
                {label.length > 20
                  ? `${label.slice(0, 20)}...`
                  : label}
              </text>

            </g>
          );
        })}
      </svg>

      {/* -----------------------------------------
          LEGEND
      ----------------------------------------- */}

      <div style={styles.legend}>

        <span style={styles.legendItem}>
          <span
            style={{
              ...styles.dot,
              backgroundColor: "#27d8f2",
            }}
          />
          Email
        </span>

        <span style={styles.legendItem}>
          <span
            style={{
              ...styles.dot,
              backgroundColor: "#ff9f45",
            }}
          />
          Domain
        </span>

        <span style={styles.legendItem}>
          <span
            style={{
              ...styles.dot,
              backgroundColor: "#f4b740",
            }}
          />
          URL
        </span>

        <span style={styles.legendItem}>
          <span
            style={{
              ...styles.dot,
              backgroundColor: "#ff3b3b",
            }}
          />
          IP
        </span>

        <span style={styles.legendItem}>
          <span
            style={{
              ...styles.dot,
              backgroundColor: "#a855f7",
            }}
          />
          IOC
        </span>

      </div>
    </div>
  );
}

const styles = {
  card: {
    width: "min(750px, 96%)",

    background:
      "linear-gradient(135deg, rgba(10, 22, 38, 0.48), rgba(12, 25, 42, 0.30))",

    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",

    border: "1px solid rgba(39, 216, 242, 0.45)",
    borderRadius: "12px",

    padding: "30px 34px",

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

  svg: {
    width: "100%",
    height: "auto",
    minHeight: "360px",
    display: "block",
  },

  legend: {
    display: "flex",
    gap: "18px",
    justifyContent: "center",
    marginTop: "12px",
    flexWrap: "wrap",
  },

  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.75rem",
    color: "var(--soc-muted)",
  },

  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    display: "inline-block",
  },
};

export default GraphView;