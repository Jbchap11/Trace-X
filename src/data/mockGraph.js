export const mockGraph = {
  nodes: [
    { id: "sender", label: "Sender", x: 250, y: 20 },
    { id: "email", label: "EMAIL", x: 250, y: 100 },
    { id: "domain", label: "DOMAIN", x: 150, y: 200 },
    { id: "url", label: "URL", x: 350, y: 200 },
    { id: "ioc1", label: "IOC", x: 150, y: 300 },
    { id: "ioc2", label: "IOC", x: 350, y: 300 },
  ],
  edges: [
    { from: "sender", to: "email" },
    { from: "email", to: "domain" },
    { from: "email", to: "url" },
    { from: "domain", to: "ioc1" },
    { from: "url", to: "ioc2" },
  ],
};