const BASE_URL = "https://trace-x-io6z.onrender.com";
import { mockAISummary } from "../data/mockAISummary";

export async function getAISummary(emailId) {
  return mockAISummary;

  // BAAD MEIN:
  // const res = await fetch(`/api/ai-summary/${emailId}`);
  // return res.json();
}
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    if (!res.ok) throw new Error("Health check failed");
    return true;
  } catch (error) {
    console.log("Backend health check failed:", error.message);
    return false;
  }
}
import { mockEmailDetail } from "../data/mockEmailDetail";
import { mockIOCDetail } from "../data/mockIOCDetail";
export async function getEmailById(emailId) {
  return mockEmailDetail[emailId];
}
export async function uploadEmail(file) {
  try {
    const formData = new FormData();
    formData.append("file", file); // file ko form-data mein daal rahe hain

    const res = await fetch(`${BASE_URL}/api/emails`, {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    console.log("Upload response:", json); // temporarily — dekhne ke liye kya aaya

    // Assuming response mein emailId hoga — agar naam alag nikle, yahan badal denge
    return json.data?.emailId || json.data?._id || json.emailId;
  } catch (error) {
    console.log("Upload failed:", error.message);
    return null;
  }
}

export async function getIOCDetail(iocValue) {
  return mockIOCDetail[iocValue];
}
import { mockIOCs } from "../data/mockIOCs";
export async function getIOCs(caseId) {
  try {
    const url = caseId
      ? `${BASE_URL}/api/iocs?caseId=${caseId}`
      : `${BASE_URL}/api/iocs`;

    const res = await fetch(url);
    const json = await res.json();

    return json.data.map((i) => ({
      indicator: i.value,
      type: i.type,
      status: i.status.charAt(0).toUpperCase() + i.status.slice(1),
    }));
  } catch (error) {
    console.log("Backend not reachable, using dummy data:", error.message);
    return mockIOCs;
  }
}
import { mockCases } from "../data/mockCases";
export async function getCases() {
  try {
    const res = await fetch(`${BASE_URL}/api/cases`);
    const json = await res.json();

    return json.data.map((c) => ({
      id: c._id,
      subject: c.title,
      status: c.status.toUpperCase(),
      priority: c.priority.toUpperCase(),
      classification: c.classification,
      riskScore: c.threatScore,
      created: new Date(c.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      evidenceCount: c.emailIds?.length || 0,
      iocCount: c.iocIds?.length || 0,
      emailCount: c.emailIds?.length || 0,
    }));
  } catch (error) {
    console.log("Backend not reachable, using dummy data:", error.message);
    return mockCases;
  }
}

export async function getCaseById(caseId) {
  try {
    const res = await fetch(`${BASE_URL}/api/cases/${caseId}`);
    const json = await res.json();
    const c = json.data;

    // evidence object ({spfFailed: true, maliciousUrl: true}) ko
    // readable sentences ki list mein badal rahe hain
    const evidenceList = [];
    if (c.evidence?.spfFailed) evidenceList.push("SPF check failed");
    if (c.evidence?.maliciousUrl) evidenceList.push("Malicious URL found");
    if (c.aiSummary) evidenceList.push(`AI Explanation: ${c.aiSummary}`);

    return {
      id: c._id,
      subjectLine: c.title,
      status: c.status.toUpperCase(),
      priority: c.priority.toUpperCase(),
      classification: c.classification,
      riskScore: c.threatScore,
      created: new Date(c.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      lastUpdated: new Date(c.updatedAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      description: c.description,
      relatedEmails: c.emailIds.map((e) => ({
        emailId: e.email_id,
        sender: e.sender[0],
        subject: e.subject,
      })),
      relatedIOCs: c.iocIds.map((i) => ({
        type: i.type,
        value: i.value,
        confidence: i.investigation?.confidence
          ? `${Math.round(i.investigation.confidence * 100)}%`
          : "Unknown",
      })),
      evidenceList,
      evidenceCount: evidenceList.length,
      iocCount: c.iocIds.length,
      emailCount: c.emailIds.length,
    };
  } catch (error) {
    console.log("Backend not reachable, using dummy data:", error.message);
    return mockCases.find((cc) => cc.id === caseId);
  }
}
import { mockTimeline } from "../data/mockTimeline";
export async function getTimeline(caseId) {
  return mockTimeline;

  // BAAD MEIN:
  // const res = await fetch(`/api/timeline/${caseId}`);
  // return res.json();
}
import { mockGraph } from "../data/mockGraph";
export async function getGraphData(caseId) {
  return mockGraph;

  // BAAD MEIN — yeh Member 4 ka real graph data hoga:
  // const res = await fetch(`/api/graph/${caseId}`);
  // return res.json();
}
import { mockThreatAnalysis } from "../data/mockThreatAnalysis";
import { mockReport } from "../data/mockReport";
import { mockEvidence } from "../data/mockEvidence";

// Har function abhi dummy data return karta hai.
// Baad mein jab real backend/AI ready ho, sirf yeh functions
// update karne honge (fetch/axios call daalna hoga) — kahi aur kuch nahi badlega.

export async function getThreatAnalysis(emailId) {
  try {
    const res = await fetch(`${BASE_URL}/api/analyses/${emailId}`);
    const json = await res.json();
    const a = json.data;

    return {
      suspicious: a.classification !== "legitimate",
      category:
        a.classification.charAt(0).toUpperCase() + a.classification.slice(1),
      riskLevel:
        a.threatScore >= 70
          ? "High Risk"
          : a.threatScore >= 40
          ? "Medium Risk"
          : "Low Risk",
      confidence: Math.round(a.confidence * 100),
      reasons: a.recommendations || [a.summary],
    };
  } catch (error) {
    console.log("Backend not reachable, using dummy data:", error.message);
    return mockThreatAnalysis;
  }
}

export async function getReport(caseId) {
  return mockReport;

  // BAAD MEIN:
  // const res = await fetch(`/api/report/${caseId}`);
  // return res.json();
}

export async function getEvidence(emailId) {
  try {
    const res = await fetch(`${BASE_URL}/api/emails/${emailId}/evidence`);
    const json = await res.json();
    const e = json.data;
    console.log("Evidence data:", e);

    return [
      {
        label: "SENDER",
        value: e.sender,
        flag: "From parsed email",
        flagType: "warning",
      },
      {
        label: "URL",
        value: e.urls?.[0] || "None found",
        flag: e.urls?.length ? "Extracted from content" : "No URLs found",
        flagType: e.urls?.length ? "danger" : "warning",
      },
      {
        label: "CONTENT",
        value: e.content || "No content excerpt available",
        flag: "Email body excerpt",
        flagType: "warning",
      },
      {
        label: "HEADER",
        value: e.headers ? JSON.stringify(e.headers) : "No header data",
        flag: "Header analysis",
        flagType: "warning",
      },
    ];
  } catch (error) {
    console.log("Backend not reachable, using dummy data:", error.message);
    return mockEvidence;
  }
}