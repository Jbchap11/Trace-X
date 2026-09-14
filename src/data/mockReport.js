export const mockReport = {
  caseId: "CASE #1",
  verdict: "🚨 HIGH RISK — Phishing Attempt Detected",
  sections: [
    {
      icon: "🔎",
      heading: "Summary",
      text: "This email has been classified as a phishing attempt with 92% confidence, based on combined evidence from header analysis, content inspection, and IOC correlation.",
    },
    {
      icon: "⚠️",
      heading: "Key Findings",
      text: "The sender domain does not match the claimed organization, and the embedded URL was flagged as malicious by the IOC module. The email uses urgent language to pressure immediate action from the recipient.",
    },
    {
      icon: "🛡️",
      heading: "Recommendation",
      text: "This email should be blocked immediately, and the sender domain should be added to the organization's threat watchlist.",
    },
  ],
};