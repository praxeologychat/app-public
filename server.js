import express from "express";
import fetch from "node-fetch";  // new
const app = express();

const FRAME_ANCESTORS = [
  "https://praxeologychat.wpcomstaging.com",
  "https://praxeologychat.wordpress.com"
].join(" ");

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    `default-src 'self' blob: data: https:; frame-ancestors 'self' ${FRAME_ANCESTORS}`
  );
  res.removeHeader("X-Frame-Options");
  next();
});

app.use(express.static("public", {
  setHeaders: (res) => res.setHeader("Cache-Control", "public, max-age=600")
}));

// === Gemini API proxy route ===
app.use(express.json());
app.post("/api/chat", async (req, res) => {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body)
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini request failed" });
  }
});
// ===============================

app.get("*", (_req, res) => res.sendFile(process.cwd() + "/public/index.html"));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("Public app listening on " + port));

