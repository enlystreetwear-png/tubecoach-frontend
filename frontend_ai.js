// frontend_ai.js
import axios from "axios";

// =====================
// CONFIG
// =====================
const API_BASE = "/api"; // GitHub rewrites will redirect to your Railway backend
const API_KEY = "baiu-secret-12345"; // Replace with your real key or use env variable

// =====================
// HELPER TO CALL BAIUGPT
// =====================
async function callBaiuGPT(path, body, timeout = 120000) {
  try {
    const res = await axios.post(
      `${API_BASE}${path}`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": API_KEY
        },
        timeout
      }
    );
    return res.data;
  } catch (err) {
    console.error(`BaiuGPT API error (${path}):`, err);
    return null;
  }
}

// =====================
// WEEKLY PLAN
// =====================
export async function generateWeeklyPlan(channel, profile, snapshots) {
  return callBaiuGPT("/ai/weekly-plan", { channel, profile, snapshots });
}

// =====================
// ANALYSIS
// =====================
export async function generateAnalysis(channel, profile, snapshots) {
  return callBaiuGPT("/ai/analysis", { channel, profile, snapshots });
}

// =====================
// AI COACH CHAT
// =====================
export async function chatWithCoach(messages, user, channel, profile, taskContext, niche, lang) {
  const body = { messages, user, channel, profile, taskContext, niche, lang };
  const result = await callBaiuGPT("/ai/coach", body);
  return result?.reply || result?.answer || "Sorry, I couldn't answer that.";
}

// =====================
// GOAL ROADMAP
// =====================
export async function estimateGoalTimeline(channel, profile, snapshots) {
  return callBaiuGPT("/ai/goal-roadmap", { channel, profile, snapshots });
}

// =====================
// TASK GUIDE
// =====================
export async function generateTaskGuide(task, channel, profile) {
  return callBaiuGPT("/ai/task-guide", { task, channel, profile });
}

// =====================
// EXAMPLES
// =====================
/*
Example usage:

import { generateWeeklyPlan, generateAnalysis, chatWithCoach } from './frontend_ai.js';

const weekly = await generateWeeklyPlan({name: "MyChannel"}, {subscribers: 100}, []);
console.log(weekly);

const analysis = await generateAnalysis({name: "MyChannel"}, {subscribers: 100}, []);
console.log(analysis);

const reply = await chatWithCoach(
  [{role: "user", text: "Give me a YouTube video idea"}],
  {id: "user123"},
  {name: "TechChannel"},
  {subscribers: 0},
  null,
  "Tech Reviews",
  "English"
);
console.log(reply);
*/
