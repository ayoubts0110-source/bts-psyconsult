import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Developer photo endpoints
app.post("/api/developer/photo", (req, res) => {
  try {
    const { image, passcode } = req.body;
    if (passcode !== "ayoub0110") {
      return res.status(403).json({ error: "Unauthorized: Invalid passcode" });
    }
    if (!image) {
      return res.status(400).json({ error: "Bad Request: No image data provided" });
    }

    // Extract base64 content
    const matches = image.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: "Invalid base64 image data" });
    }
    const buffer = Buffer.from(matches[2], "base64");

    // Ensure public folder exists
    const publicDir = path.join(process.cwd(), "public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write to public/developer_photo.png
    const publicPath = path.join(publicDir, "developer_photo.png");
    fs.writeFileSync(publicPath, buffer);
    console.log("Developer photo written to:", publicPath);

    // Also write to dist/developer_photo.png if dist exists so it's live immediately
    const distDir = path.join(process.cwd(), "dist");
    if (fs.existsSync(distDir)) {
      const distPath = path.join(distDir, "developer_photo.png");
      fs.writeFileSync(distPath, buffer);
      console.log("Developer photo also written to production dist:", distPath);
    }

    res.json({ success: true, url: `/developer_photo.png?t=${Date.now()}` });
  } catch (error: any) {
    console.error("Error saving developer photo:", error);
    res.status(500).json({ error: "Failed to save photo", details: error.message });
  }
});

app.delete("/api/developer/photo", (req, res) => {
  try {
    const { passcode } = req.body;
    if (passcode !== "ayoub0110") {
      return res.status(403).json({ error: "Unauthorized: Invalid passcode" });
    }

    const publicPath = path.join(process.cwd(), "public", "developer_photo.png");
    if (fs.existsSync(publicPath)) {
      fs.unlinkSync(publicPath);
    }

    const distPath = path.join(process.cwd(), "dist", "developer_photo.png");
    if (fs.existsSync(distPath)) {
      fs.unlinkSync(distPath);
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting developer photo:", error);
    res.status(500).json({ error: "Failed to delete photo", details: error.message });
  }
});

// Initialize server-side Gemini API client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("Warning: GEMINI_API_KEY environment variable is not set. AI features will be disabled.");
}

// DSM-5 AI Assistant endpoint
app.post("/api/dsm5/chat", async (req, res) => {
  try {
    const { messages, screeningResult } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: "Gemini API client is not initialized. Please ensure GEMINI_API_KEY is configured in Settings > Secrets."
      });
    }

    // Build the chat prompt
    let systemInstruction = `You are an expert educational and clinical companion specializing in the DSM-5 (Diagnostic and Statistical Manual of Mental Disorders, Fifth Edition).
Your goal is to help users explore symptoms conceptually, explain specific DSM-5 diagnostic criteria, explain typical clinical differences (differential diagnosis), and clarify what terms mean.

IMPORTANT GUIDELINES:
1. STRICT DISCLAIMER: You MUST remind the user that your feedback is strictly for educational/informational purposes, is not a formal clinical diagnosis, and does not replace professional psychiatric or psychological assessment.
2. EMPATHETIC & CLINICAL TONE: Be warm, professional, respectful, non-judgmental, and evidence-based.
3. LANGUAGE DUALITY: The user may ask questions or speak in Arabic or English. Respond in the same language as the user. If they write in Arabic, respond in clear, professional Arabic. If they write in English, respond in English.
4. MEDICAL CODES: When discussing a disorder, mention its corresponding DSM-5 clinical criteria code (or ICD-10 code if relevant, e.g. Major Depressive Disorder is F32.x/F33.x) to provide educational value.
5. SCREENING CONTEXT: If the user has just taken a screening assessment and includes the results, reference those results specifically to explain how those symptoms align with DSM-5 criteria (e.g. A-criteria, duration, distress/impairment, exclusion of substances/medical conditions).
6. CRITICAL SAFETY: If the user expresses self-harm or suicidal thoughts, immediately provide helpline resources and strongly urge professional care. Do not try to diagnose in those scenarios.
`;

    // Convert message history to Gemini SDK format
    // Map roles: 'user' -> 'user', 'assistant'/'model' -> 'model'
    const geminiContents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    // If there is a screening result, we can append it as context
    if (screeningResult) {
      const resultContext = `[Context: The user just completed a DSM-5 aligned self-screening for "${screeningResult.title}". Result Category: "${screeningResult.category}". Key responses: ${JSON.stringify(screeningResult.details)}.]`;
      // Insert this context into the last user message or as a system indicator
      if (geminiContents.length > 0) {
        const lastMsg = geminiContents[geminiContents.length - 1];
        lastMsg.parts[0].text = `${resultContext}\n\nUser message/question: ${lastMsg.parts[0].text}`;
      } else {
        geminiContents.push({
          role: "user",
          parts: [{ text: `${resultContext}\nPlease provide an overview of this result and what the next educational steps are.` }]
        });
      }
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: geminiContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({
      role: "assistant",
      content: response.text || "I was unable to generate a response. Please try again."
    });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "Failed to communicate with the DSM-5 AI Assistant.",
      details: error.message
    });
  }
});

// Setup Vite development server or production static serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite development server middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static files in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running at http://localhost:${PORT}`);
  });
}

setupServer();
