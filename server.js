import express from "express";
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

app.get("*", (_req, res) => res.sendFile(process.cwd() + "/public/index.html"));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("Public app listening on " + port));
