import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// allow embedding in WordPress and relax CSP
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;"
  );
  res.setHeader("X-Frame-Options", "ALLOWALL");
  next();
});

// serve static files with correct MIME types
app.use(
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res, filePath) => {
      res.setHeader("Cache-Control", "public, max-age=600");
      if (filePath.endsWith(".js")) res.type("application/javascript");
      if (filePath.endsWith(".ts") || filePath.endsWith(".tsx"))
