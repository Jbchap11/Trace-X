export const mockEvidence = [
  {
    label: "SENDER",
    value: "accounts@xyz-support.com",
    flag: "Suspicious",
    flagType: "warning",
  },
  {
    label: "URL",
    value: "xyz-login.com",
    flag: "Flagged by IOC",
    flagType: "danger",
  },
  {
    label: "CONTENT",
    value: '"Your account will be blocked..."',
    flag: "Urgency detected",
    flagType: "warning",
  },
  {
    label: "HEADER",
    value: "Sender/domain mismatch",
    flag: "Detected",
    flagType: "warning",
  },
];