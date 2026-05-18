// frontend_ai.js
// Optional helper for calling the TubeCoach backend. The backend uses Ollama.

const API_BASE = "/api";

function getToken() {
  return localStorage.getItem("tubecoach_token") || localStorage.getItem("token") || "";
}

async function callBackend(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (_err) {
    throw new Error(`Invalid response: ${text.slice(0, 120)}`);
  }

  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export async function generateWeeklyPlan() {
  return callBackend("/dashboard/plan");
}

export async function generateAnalysis() {
  return callBackend("/dashboard/analysis");
}

export async function chatWithCoach(messages, user, channel, profile, taskContext, niche, lang) {
  const result = await callBackend("/dashboard/chat", {
    method: "POST",
    body: { messages, user, channel, profile, taskContext, niche, lang },
  });
  return result.reply || "Sorry, I couldn't answer that.";
}

export async function estimateGoalTimeline() {
  return callBackend("/dashboard/goal");
}

export async function generateTaskGuide(task) {
  return callBackend("/dashboard/task-guide", {
    method: "POST",
    body: { task },
  });
}
