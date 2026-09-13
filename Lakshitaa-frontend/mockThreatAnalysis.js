export const mockThreatAnalysis = {
  suspicious: true,
  category: "Phishing",
  riskLevel: "High Risk",
  confidence: 92,
  reasons: [
    "Sender domain does not match the claimed organization.",
    "Embedded URL flagged as malicious by the IOC module.",
    "Email uses urgent language to pressure immediate action.",
    "Header analysis shows sender/domain mismatch.",
  ],
};