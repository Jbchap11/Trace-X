import { useState, useEffect } from "react";

const steps = [
  "Parsing email headers",
  "Extracting URLs & attachments",
  "Checking IOC database",
  "Running AI classification",
  "Generating investigation summary",
];

function AnalyzingPage({ fileName, onAnalysisComplete }) {
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep += 1;
      setCompletedSteps((prev) => [...prev, steps[currentStep - 1]]);
      setProgress(Math.round((currentStep / steps.length) * 100));

      if (currentStep === steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          onAnalysisComplete();
        }, 800);
      }
    }, 900);

    return () => clearInterval(interval);
  }, [onAnalysisComplete]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title} className="efa-glow-title">ANALYZING EMAIL...</h2>
      <p style={styles.fileName}>{fileName}</p>

      <div style={styles.stepsBox}>
        {steps.map((step, index) => {
          const isDone = completedSteps.includes(step);
          return (
            <div key={step} style={styles.stepRow}>
              <span style={{ ...styles.tick, opacity: isDone ? 1 : 0.2 }}>
                {isDone ? "✔" : "○"}
              </span>
              <span style={{ opacity: isDone ? 1 : 0.4 }}>{step}</span>
            </div>
          );
        })}
      </div>

      <div style={styles.progressBarBg}>
        <div style={{ ...styles.progressBarFill, width: `${progress}%` }} />
      </div>
      <p style={styles.percentage}>{progress}%</p>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "transparent",
    color: "var(--soc-text)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-ui)",
    padding: "20px",
  },
  title: {
    fontSize: "1.6rem",
    fontWeight: "bold",
    marginBottom: "6px",
    letterSpacing: "1px",
  },
  fileName: {
    color: "var(--soc-muted)",
    marginBottom: "30px",
    fontSize: "0.9rem",
  },
  stepsBox: {
    width: "320px",
    marginBottom: "30px",
  },
  stepRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
    fontSize: "0.95rem",
  },
  tick: {
    color: "var(--soc-safe)",
    fontWeight: "bold",
    width: "18px",
  },
  progressBarBg: {
    width: "320px",
    height: "8px",
    backgroundColor: "var(--soc-card-raised)",
    borderRadius: "4px",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "var(--soc-cyan)",
    boxShadow: "0 0 16px rgb(39 216 242 / 30%)",
    transition: "width 0.4s ease",
  },
  percentage: {
    marginTop: "10px",
    fontSize: "0.9rem",
    color: "var(--soc-muted)",
  },
};

export default AnalyzingPage;