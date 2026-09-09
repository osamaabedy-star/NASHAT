import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

interface EvaluationRecord {
  score: number | null;
  notes: string;
  updatedAt?: string;
}

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Persistent storage file
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "evaluations.json");

function ensureDataFile(): Record<string, EvaluationRecord> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2), "utf-8");
      return {};
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading evaluations file:", err);
    return {};
  }
}

function saveDataFile(data: Record<string, EvaluationRecord>) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing evaluations file:", err);
  }
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// GET all evaluations
app.get("/api/evaluations", (req, res) => {
  const data = ensureDataFile();
  res.json({ success: true, data });
});

// POST or update single evaluation
app.post("/api/evaluations", (req, res) => {
  const { key, score, notes } = req.body;
  if (!key) {
    res.status(400).json({ success: false, error: "Key is required" });
    return;
  }

  const allData = ensureDataFile();
  const existing = allData[key] || { score: null, notes: "" };

  allData[key] = {
    score: score !== undefined ? (score === null || score === "" ? null : Number(score)) : existing.score,
    notes: notes !== undefined ? String(notes) : existing.notes,
    updatedAt: new Date().toISOString(),
  };

  saveDataFile(allData);
  res.json({ success: true, record: allData[key] });
});

// POST batch update
app.post("/api/evaluations/batch", (req, res) => {
  const { records } = req.body;
  if (!records || typeof records !== "object") {
    res.status(400).json({ success: false, error: "Records object is required" });
    return;
  }

  const allData = ensureDataFile();
  for (const [key, val] of Object.entries(records)) {
    const existing = allData[key] || { score: null, notes: "" };
    const item = val as Partial<EvaluationRecord>;
    allData[key] = {
      score: item.score !== undefined ? (item.score === null ? null : Number(item.score)) : existing.score,
      notes: item.notes !== undefined ? String(item.notes) : existing.notes,
      updatedAt: new Date().toISOString(),
    };
  }

  saveDataFile(allData);
  res.json({ success: true, count: Object.keys(records).length });
});

// POST reset evaluations
app.post("/api/evaluations/reset", (req, res) => {
  saveDataFile({});
  res.json({ success: true, message: "All evaluations reset to empty" });
});

async function startServer() {
  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
