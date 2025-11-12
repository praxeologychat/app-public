import express from "express";
import fetch from "node-fetch";

const app = express();

// allow your WordPress domains to embed this
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

// serve your static files (the exported AI Studio app) from /public
app.use(express.static("public", {
  setHeaders: (res) => res.setHeader("Cache-Control", "public, max-age=600")
}));

// secure Gemini proxy route (keeps API key private)
app.use(express.json());
app.post("/api/chat", async (req, res) => {
  try {
    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body)
      }
    );
    const j = await r.json();
    res.json(j);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini request failed" });
  }
});

// serve your app's main HTML for any other route
app.get("*", (_req, res) => res.sendFile(process.cwd() + "/public/index.html"));

// run
const port = process.env.PORT || 8080;
app.listen(port, () => console.log("Public app listening on " + port));


app.get("*", (_req, res) => res.sendFile(process.cwd() + "/public/index.html"));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("Public app listening on " + port));

