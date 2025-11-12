
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This is the critical security setting that allows the app to be embedded
app.use((req, res, next) => {
  // Allows embedding from any site.
  // For higher security, you could replace '*' with your WordPress domain:
  // res.setHeader('Content-Security-Policy', "frame-ancestors 'self' https://your-wordpress-domain.com");
  res.setHeader('Content-Security-Policy', "frame-ancestors *");
  next();
});

// Serve the static files from the main directory
app.use(express.static(path.join(__dirname, '..')));

// Send the index.html file for any request
// FIX: Changed from app.get() to app.route().get() to resolve a TypeScript overload error.
// This is functionally identical but helps the compiler correctly infer types.
app.route('*').get((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
