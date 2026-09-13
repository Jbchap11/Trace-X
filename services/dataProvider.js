const BASE_URL = "https://trace-x-io6z.onrender.com";
import { mockAISummary } from "../data/mockAISummary";
import { mockGeoIOCs } from "../data/mockGeoIOCs";
export async function getGeoIOCs(caseId) {
  try {
    const url = caseId
      ? `${BASE_URL}/api/iocs?caseId=${caseId}`
      : `${BASE_URL}/api/iocs`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Backend request failed: ${res.status}`);
    }

    const json = await res.json();

    const geoPoints = (json.data || [])
      .filter((i) => {
        const lat = Number(i.geolocation?.latitude);
        const lng = Number(i.geolocation?.longitude);

        return (
          Number.isFinite(lat) &&
          Number.isFinite(lng) &&
          i.geolocation?.city &&
          i.geolocation?.country
        );
      })
      .map((i) => ({
        lat: Number(i.geolocation.latitude),
        lng: Number(i.geolocation.longitude),
        label: i.value,
        country: i.geolocation.country,
        city: i.geolocation.city,
      }));

    // Backend data available → use backend data
    // No valid backend location → use dummy data
    return geoPoints.length > 0 ? geoPoints : mockGeoIOCs;
  } catch (error) {
    console.log(
      "Backend not reachable, using dummy data:",
      error.message
    );

    return mockGeoIOCs;
  }
}

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
  try {
    const res = await fetch(`${BASE_URL}/api/emails/${emailId}/evidence`);
    const json = await res.json();
    const e = json.data;

    return {
      from: e.sender,
      to: "N/A",
      subject: "N/A",
      date: "N/A",
      body: e.content || "No content available",
      headers: e.headers || {},
      attachments: [],
      extractedUrls: e.urls || [],
    };
  } catch (error) {
    console.log("Backend not reachable, using dummy data:", error.message);
    return mockEmailDetail[emailId] || mockEmailDetail["email_001"];
  }
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
  return (
    mockIOCDetail[iocValue] || {
      type: "Unknown",
      value: iocValue,
      confidence: "Unknown",
      firstSeen: "N/A",
      timesSeen: "N/A",
      threatSource: "N/A",
      relatedCases: [],
    }
  );
}
import { mockIOCs } from "../data/mockIOCs";
export async function getIOCs(caseId, emailId) {
  try {
    let allIOCs = [];

    // Case ke IOCs
    if (caseId) {
      const caseRes = await fetch(
        `${BASE_URL}/api/iocs?caseId=${caseId}`
      );

      if (caseRes.ok) {
        const caseJson = await caseRes.json();

        if (Array.isArray(caseJson.data)) {
          allIOCs.push(...caseJson.data);
        }
      }
    }

    // Email ke IOCs
    if (emailId) {
      const emailRes = await fetch(
        `${BASE_URL}/api/iocs?emailId=${emailId}`
      );

      if (emailRes.ok) {
        const emailJson = await emailRes.json();

        if (Array.isArray(emailJson.data)) {
          allIOCs.push(...emailJson.data);
        }
      }
    }

    // Duplicate IOCs remove karna
    const uniqueIOCs = [];
    const seen = new Set();

    allIOCs.forEach((ioc) => {
      const key = `${ioc.type}-${ioc.value}`;

      if (!seen.has(key)) {
        seen.add(key);
        uniqueIOCs.push(ioc);
      }
    });

    console.log("All IOCs:", uniqueIOCs);

    return uniqueIOCs.map((ioc) => ({
      indicator: ioc.value,
      type: ioc.type,
      status: ioc.status
        ? ioc.status.charAt(0).toUpperCase() + ioc.status.slice(1)
        : "Unknown",
    }));

  } catch (error) {
    console.log(
      "Backend not reachable, using dummy IOC data:",
      error.message
    );

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
  try {
    const res = await fetch(`${BASE_URL}/api/cases/${caseId}`);
    const json = await res.json();
    const c = json.data;

    const nodes = [];
    const edges = [];

    // Email nodes
    c.emailIds.forEach((e) => {
      nodes.push({
        id: `email_${e.email_id}`,
        label: e.subject || e.email_id,
        type: "email",
      });
    });

    // IOC nodes + edges (har IOC ko pehle email se connect kar rahe hain)
    c.iocIds.forEach((ioc) => {
      const iocNodeId = `ioc_${ioc.value}`;
      nodes.push({
        id: iocNodeId,
        label: ioc.value,
        type: ioc.type,
      });

      if (c.emailIds[0]) {
        edges.push({
          from: `email_${c.emailIds[0].email_id}`,
          to: iocNodeId,
        });
      }
    });

    return { nodes, edges };
  } catch (error) {
    console.log("Backend not reachable, using dummy data:", error.message);
    return mockGraph;
  }
}

  // BAAD MEIN — yeh Member 4 ka real graph data hoga:
  // const res = await fetch(`/api/graph/${caseId}`);
  // return res.json();

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

    // AI ka risk_level pehle se hi "high"/"medium"/"low" text mein aata hai
    const riskWord = (a.risk_level || "medium").toLowerCase();
    const riskLevel =
      riskWord.charAt(0).toUpperCase() + riskWord.slice(1) + " Risk";

    return {
      suspicious: a.classification !== "legitimate",
      category:
        a.classification.charAt(0).toUpperCase() + a.classification.slice(1),
      riskLevel,
      confidence: Math.round(a.confidence * 100),
      reasons: a.evidence || [a.summary],
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

    // sender object se sirf pehla email address nikaal rahe hain
    const senderEmail =
      e.sender?.from?.[0] || e.sender?.replyTo || "Unknown sender";

    // content object se text ya html nikaal rahe hain
    const contentText =
      e.content?.text?.trim() ||
      e.content?.html?.trim() ||
      "No content excerpt available";

    return [
      {
        label: "SENDER",
        value: senderEmail,
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
        value: contentText,
        flag: "Email body excerpt",
        flagType: "warning",
      },
      {
        label: "HEADER",
        value: e.headers?.received?.[0]
          ? e.headers.received[0].split(";")[0].trim()
          : "No header data",
        flag: "Header analysis",
        flagType: "warning",
      },
    ];
  } catch (error) {
    console.log("Backend not reachable, using dummy data:", error.message);
    return mockEvidence;
  }
}