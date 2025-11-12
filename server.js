import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// allow embedding in WordPress and remove strict CSP
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;"
  );
  res.setHeader("X-Frame-Options", "ALLOWALL");
  next();
});

// serve static files
app.use(
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res) => res.setHeader("Cache-Control", "public, max-age=600"),
  })
);

// proxy to Gemini
app.use(express.json());
app.post("/api/chat", async (req, res) => {
  try {
    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      }
    );
    const j = await r.json();
    res.json(j);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini request failed" });
  }
});

// fallback route
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// run
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () =>
  console.log("✅ Public app listening on port " + port)
);

